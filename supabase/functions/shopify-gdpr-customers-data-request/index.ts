// Reçoit le webhook GDPR "customers/data_request"
// Action: log + (optionnel) préparer les données client à retourner manuellement si Shopify/merchant le demande
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
async function verifyWebhookHmac(raw: ArrayBuffer, secret: string, headerB64: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, raw);
  const expected = new Uint8Array(sig);
  const received = base64ToUint8Array(headerB64.trim());
  return timingSafeEqual(expected, received);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

  const hmac = req.headers.get("X-Shopify-Hmac-SHA256") ?? "";
  const shop = req.headers.get("X-Shopify-Shop-Domain") ?? "";

  try {
    const secret = Deno.env.get("SHOPIFY_API_SECRET");
    if (!secret) return new Response("Missing SHOPIFY_API_SECRET", { status: 500, headers: CORS });

    const raw = await req.arrayBuffer();
    const valid = await verifyWebhookHmac(raw, secret, hmac);
    if (!valid) return new Response("Unauthorized", { status: 401, headers: CORS });

    const payload = JSON.parse(new TextDecoder().decode(raw)); // contient customer.id, etc.

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Log l'événement
    await supabase.from("webhook_events").insert({
      shop,
      topic: "customers/data_request",
      payload,
      hmac_valid: true,
      processed: true,
    });

    // (Optionnel) Préparer les données client à renvoyer hors bande.
    // Ex: const data = await supabase.from("customers").select("*").eq("shopify_customer_id", payload.customer.id);

    return new Response("OK", { status: 200, headers: CORS });
  } catch (e) {
    return new Response(`Error: ${e?.message || e}`, { status: 500, headers: CORS });
  }
});
