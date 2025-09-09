// supabase/functions/shopify-oauth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const url = new URL(req.url);
  const origin = url.origin; // ex: https://<project-ref>.functions.supabase.co
  const shop = url.searchParams.get("shop") || "";
  const mode = (url.searchParams.get("mode") || "offline").toLowerCase();
  const redirect = url.searchParams.get("redirect") ?? "1";

  // Compat: si on nous passe encore ?shop=..., on redirige vers la nouvelle fonction
  if (shop) {
    const target =
      `${origin}/shopify-oauth-start` +
      `?shop=${encodeURIComponent(shop)}&mode=${mode}&redirect=${redirect}`;
    return Response.redirect(target, 302);
  }

  // Sinon on indique que l'endpoint est obsolète
  return new Response(
    JSON.stringify({
      error: "Deprecated endpoint. Use /shopify-oauth-start.",
      next: `${origin}/shopify-oauth-start?shop=<your-shop>.myshopify.com&mode=offline&redirect=1`,
    }),
    { status: 410, headers: { ...CORS, "Content-Type": "application/json" } }
  );
});
