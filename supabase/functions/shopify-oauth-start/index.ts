// Deno (Supabase Edge Function)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeShop(input: string): string | null {
  try {
    let s = input.trim().toLowerCase();
    if (s.startsWith("https://") || s.startsWith("http://")) {
      s = new URL(s).host; // garde le host
    }
    // autoriser "acme" ou "acme.myshopify.com"
    if (!s.endsWith(".myshopify.com")) s = `${s}.myshopify.com`;
    // validation basique
    if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(s)) return null;
    return s;
  } catch (_e) {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const shopParam = (url.searchParams.get("shop") || body.shop || "").toString();
    const modeParam = (url.searchParams.get("mode") || body.mode || "").toString(); // "online" | "offline"
    const redirectFlag = url.searchParams.get("redirect") ?? body.redirect; // "1" pour 302

    const shop = normalizeShop(shopParam);
    if (!shop) return new Response("Invalid 'shop' parameter", { status: 400, headers: CORS });

    // ENV requis
    const API_KEY = Deno.env.get("SHOPIFY_API_KEY")!;
    const REDIRECT_URI = Deno.env.get("SHOPIFY_REDIRECT_URI")!; // ex: https://<project-ref>.functions.supabase.co/shopify-callback
    const SCOPES = Deno.env.get("SHOPIFY_SCOPES") || "read_products,read_orders";
    const ACCESS_MODE = (modeParam || Deno.env.get("SHOPIFY_ACCESS_MODE") || "offline").toLowerCase();

    if (!API_KEY || !REDIRECT_URI) {
      return new Response("Missing SHOPIFY_API_KEY or SHOPIFY_REDIRECT_URI", { status: 500, headers: CORS });
    }

    // 1) génère et stocke le state
    const state = crypto.randomUUID();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // server-side only
    );

    await supabase.from("oauth_states").upsert({
      state,
      shop,
      created_at: new Date().toISOString(),
      used: false,
    });

    // 2) construit l'URL d'authorize
    const grant = ACCESS_MODE === "online" ? "&grant_options[]=per-user" : "";
    const authorizeUrl =
      `https://${shop}/admin/oauth/authorize` +
      `?client_id=${encodeURIComponent(API_KEY)}` +
      `&scope=${encodeURIComponent(SCOPES)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=${encodeURIComponent(state)}` +
      grant;

    // 3) soit on redirige, soit on renvoie l'URL en JSON
    if (redirectFlag === "1" || redirectFlag === 1 || redirectFlag === true) {
      return Response.redirect(authorizeUrl, 302);
    }
    return new Response(JSON.stringify({ authorize_url: authorizeUrl, state, shop, access_mode: ACCESS_MODE }), {
      headers: { "Content-Type": "application/json", ...CORS },
      status: 200,
    });
  } catch (e) {
    return new Response(`Error: ${e?.message || e}`, { status: 500, headers: CORS });
  }
});