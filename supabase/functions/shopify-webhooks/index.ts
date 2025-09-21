// supabase/functions/shopify-webhooks/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function base64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

async function verifyWebhookHmac(rawBody: ArrayBuffer, secret: string, headerB64: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, rawBody);
  const expected = new Uint8Array(sig);
  const received = base64ToUint8Array(headerB64.trim());
  return timingSafeEqual(expected, received);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

  const topic = req.headers.get("X-Shopify-Topic") ?? "";
  const shop = req.headers.get("X-Shopify-Shop-Domain") ?? "";
  const hmac = req.headers.get("X-Shopify-Hmac-Sha256") ?? "";
  const webhookId = req.headers.get("X-Shopify-Webhook-Id") ?? crypto.randomUUID();

  try {
    const secret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
    if (!secret) return new Response("Missing SHOPIFY_API_SECRET", { status: 500, headers: CORS });

    const raw = await req.arrayBuffer();

    // Verify HMAC using raw body
    const valid = await verifyWebhookHmac(raw, secret, hmac);
    if (!valid) return new Response("Unauthorized", { status: 401, headers: CORS });

    const text = new TextDecoder().decode(raw);
    const payload = text ? JSON.parse(text) : null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Persist the event (idempotent if you add a UNIQUE index on webhook_id)
    const eventRecord = {
      webhook_id: webhookId,
      shop,
      topic,
      received_at: new Date().toISOString(),
      hmac_valid: true,
      payload,
      processed: false,
    };

    await supabase.from("webhook_events")
      .upsert(eventRecord, { onConflict: "webhook_id" });

    // Minimal built-in handlers
    if (topic === "app/uninstalled") {
      await supabase
        .from("shops")
        .update({
          status: "uninstalled",
          uninstalled_at: new Date().toISOString(),
        })
        .eq("domain", shop);
    }

    // Mark processed for simple topics immediately (optional)
    await supabase
      .from("webhook_events")
      .update({ processed: true })
      .eq("webhook_id", webhookId);

    return new Response("OK", { status: 200, headers: CORS });
  } catch (e) {
    return new Response(`Error: ${e?.message || e}`, { status: 500, headers: CORS });
  }
});
