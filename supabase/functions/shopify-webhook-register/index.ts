// Supabase Edge Function — enregistre les webhooks nécessaires sur une boutique
// Appel: POST/GET ?shop=<shop>.myshopify.com
// Body optionnel: { topics?: string[], webhook_url?: string }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeShop(input: string): string | null {
  if (!input) return null;
  let s = input.trim().toLowerCase();
  if (s.startsWith("http")) s = new URL(s).host;
  if (!s.endsWith(".myshopify.com")) s = `${s}.myshopify.com`;
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(s) ? s : null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const shopParam = (url.searchParams.get("shop") || body.shop || "").toString();
    const shop = normalizeShop(shopParam);
    if (!shop) return new Response("Invalid shop", { status: 400, headers: CORS });

    const WEBHOOK_HANDLER_URL =
      (body.webhook_url as string) ||
      Deno.env.get("WEBHOOK_HANDLER_URL") || // ex: https://<project-ref>.functions.supabase.co/shopify-webhooks
      "";
    if (!WEBHOOK_HANDLER_URL) {
      return new Response("Missing WEBHOOK_HANDLER_URL", { status: 500, headers: CORS });
    }

    const topics: string[] =
      (Array.isArray(body.topics) && body.topics.length ? body.topics : null) ||
      (Deno.env.get("SHOPIFY_WEBHOOK_TOPICS")?.split(",").map((t) => t.trim()).filter(Boolean)) ||
      ["app/uninstalled", "orders/create", "orders/updated", "customers/update", "products/update"];

    const API_VERSION = Deno.env.get("SHOPIFY_API_VERSION") || "2025-01";

    // Récupérer l'access token de la boutique
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: shopRow, error } = await supabase.from("shops").select("*").eq("domain", shop).single();
    if (error || !shopRow) return new Response("Shop not found in DB", { status: 404, headers: CORS });
    const ACCESS_TOKEN: string = shopRow.access_token;

    // Récupérer les webhooks existants
    const listRes = await fetch(`https://${shop}/admin/api/${API_VERSION}/webhooks.json`, {
      headers: {
        "X-Shopify-Access-Token": ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });
    if (!listRes.ok) {
      return new Response(`Failed to list webhooks: ${await listRes.text()}`, { status: 400, headers: CORS });
    }
    const existing = (await listRes.json()).webhooks as Array<{ id: number; topic: string; address: string }>;

    // Créer ceux qui manquent (idempotent)
    const results: Record<string, unknown> = {};
    for (const topic of topics) {
      const address = WEBHOOK_HANDLER_URL; // endpoint unique qui route par X-Shopify-Topic
      const already = existing.find((w) => w.topic === topic && w.address === address);
      if (already) {
        results[topic] = { status: "exists", id: already.id, address };
        continue;
      }
      const createRes = await fetch(`https://${shop}/admin/api/${API_VERSION}/webhooks.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhook: { topic, address, format: "json" },
        }),
      });
      const text = await createRes.text();
      results[topic] = { status: createRes.ok ? "created" : "error", response: text };
    }

    return new Response(JSON.stringify({ shop, results }), {
      headers: { "Content-Type": "application/json", ...CORS },
      status: 200,
    });
  } catch (e) {
    return new Response(`Error: ${e?.message || e}`, { status: 500, headers: CORS });
  }
});
