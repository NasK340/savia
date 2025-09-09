import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

async function verifyHmac(params: URLSearchParams, secret: string, hmac: string): Promise<boolean> {
  try {
    // Create a copy and remove hmac parameter
    const copy = new URLSearchParams(params);
    copy.delete("hmac");
    copy.delete("signature");
    
    // Sort parameters alphabetically (Shopify requirement)
    const sortedParams = Array.from(copy.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    
    console.log("🔐 HMAC verification string:", sortedParams);
    
    // Create HMAC using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(sortedParams);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const digest = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("🔐 Calculated HMAC:", digest.substring(0, 8) + "...");
    console.log("🔐 Received HMAC:", hmac.substring(0, 8) + "...");
    
    return digest === hmac;
  } catch (error) {
    console.error("❌ HMAC verification error:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Shopify OAuth Callback Started");
    console.log("📌 Request URL:", req.url);
    
    const url = new URL(req.url);
    const shop = url.searchParams.get("shop");
    const hmac = url.searchParams.get("hmac");
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const timestamp = url.searchParams.get("timestamp");
    const host = url.searchParams.get("host");

    console.log("📦 OAuth Params:", { 
      shop: shop ? "✓" : "✗", 
      hmac: hmac ? "✓" : "✗", 
      code: code ? "✓" : "✗", 
      state: state ? "✓" : "✗",
      timestamp: timestamp ? "✓" : "✗",
      host: host ? "✓" : "✗"
    });

    // Validate required parameters
    if (!shop || !hmac || !code) {
      console.error("❌ Missing required parameters");
      return new Response("Missing required parameters: shop, hmac, or code", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get environment variables
    const apiKey = Deno.env.get("SHOPIFY_API_KEY");
    const apiSecret = Deno.env.get("SHOPIFY_API_SECRET");
    const appUrl = Deno.env.get("APP_URL") || "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--96435430.local-credentialless.webcontainer-api.io/";
    
    if (!apiKey || !apiSecret) {
      console.error("❌ Missing Shopify credentials");
      return new Response("Missing Shopify API credentials", { 
        status: 500,
        headers: corsHeaders
      });
    }

    console.log("🔑 Using API Key:", apiKey);
    console.log("🌐 App URL:", appUrl);

    // Verify HMAC signature
    console.log("🔐 Verifying HMAC signature...");
    const isValidHmac = await verifyHmac(url.searchParams, apiSecret, hmac);
    
    if (!isValidHmac) {
      console.error("❌ Invalid HMAC signature");
      return new Response("Invalid HMAC signature", { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log("✅ HMAC verification passed");

    // Exchange code for access token
    console.log("🔄 Exchanging code for access token...");
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("❌ Token exchange failed:", errorText);
      return new Response(`Token exchange failed: ${errorText}`, { 
        status: 400,
        headers: corsHeaders
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const scope = tokenData.scope;
    
    console.log("✅ Token exchange successful");
    console.log("🔑 Access Token:", accessToken.substring(0, 8) + "...");
    console.log("🔍 Scope:", scope);

    // Get shop information
    console.log("🔄 Fetching shop information...");
    const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json"
      },
    });

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text();
      console.error("❌ Shop info retrieval failed:", errorText);
      return new Response(`Failed to retrieve shop info: ${errorText}`, { 
        status: 400,
        headers: corsHeaders
      });
    }

    const shopData = await shopResponse.json();
    console.log("✅ Shop info retrieved:", shopData.shop.name);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Supabase credentials missing");
      return new Response("Supabase credentials missing", { 
        status: 500,
        headers: corsHeaders
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, { 
      auth: { persistSession: false } 
    });

    // Store shop data in database
    console.log("🔄 Storing shop data in database...");
    const { error: dbError } = await supabase
      .from("shopify_accounts")
      .upsert({
        shop: shop,
        access_token: accessToken,
        scope: scope,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return new Response(`Database error: ${dbError.message}`, { 
        status: 500,
        headers: corsHeaders
      });
    }

    console.log("✅ Shop data stored successfully");

    // Register GDPR webhooks
    console.log("🔄 Registering GDPR webhooks...");
    try {
      const gdprResponse = await fetch(`${supabaseUrl}/functions/v1/shopify-gdpr-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ shop })
      });

      if (gdprResponse.ok) {
        console.log("✅ GDPR webhooks registered successfully");
      } else {
        console.warn("⚠️ GDPR webhook registration failed, but continuing...");
      }
    } catch (error) {
      console.warn("⚠️ GDPR webhook registration error:", error);
      // Continue anyway - this shouldn't block the OAuth flow
    }

    // Build redirect URL with shop and host parameters
    const redirectParams = new URLSearchParams();
    redirectParams.set("shop", shop);
    if (host) {
      redirectParams.set("host", host);
    }
    redirectParams.set("installed", "1");
    
    const redirectUrl = `${appUrl}/?${redirectParams.toString()}`;
    
    console.log("🔄 Redirecting to:", redirectUrl);

    // Return 302 redirect to the app
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl
      }
    });

  } catch (error) {
    console.error("❌ OAuth callback error:", error);
    return new Response(
      `OAuth callback error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
});