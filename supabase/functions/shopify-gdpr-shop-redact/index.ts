// Reçoit le webhook GDPR "shop/redact"
// Action: supprimer toutes les données de la boutique (quand le marchand le demande), après délais Shopify si applicable
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

    const payload = JSON.parse(new TextDecoder().decode(raw)); // contient shop_id / shop_domain

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 1) Log l'événement
    await supabase.from("webhook_events").insert({
      shop,
      topic: "shop/redact",
      payload,
      hmac_valid: true,
      processed: false,
    });

    // 2) Purge des données liées à la boutique (exemples)
    // ATTENTION : si tu dois conserver certaines données pour obligations légales, documente l'exception.
    await supabase.from("orders").delete().eq("shop_id",
      // adapte si tu stockes shop_id ou domain
      payload.shop_id ?? -1
    ).throwOnError(); // facultatif

    await supabase.from("customers").delete().eq("shop_id", payload.shop_id ?? -1);
    await supabase.from("products").delete().eq("shop_id", payload.shop_id ?? -1);

    // Marquer la boutique comme supprimée/expurgée
    await supabase.from("shops").update({
      status: "redacted",
      access_token: null,
      uninstalled_at: new Date().toISOString(),
    }).eq("domain", shop);

    await supabase.from("webhook_events")
      .update({ processed: true })
      .eq("shop", shop)
      .eq("topic", "shop/redact")
      .order("received_at", { ascending: false })
      .limit(1);

    return new Response("OK", { status: 200, headers: CORS });
  } catch (e) {
    return new Response(`Error: ${e?.message || e}`, { status: 500, headers: CORS });
  }
});
