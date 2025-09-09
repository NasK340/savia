import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 GDPR Webhooks Registration Started");
    
    // Parse request body
    const { shop } = await req.json();
    
    if (!shop) {
      return new Response(
        JSON.stringify({ success: false, error: "Shop parameter is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("🏪 Shop:", shop);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Get the shop's access token
    const { data: shopData, error: shopError } = await supabase
      .from("shopify_accounts")
      .select("access_token")
      .eq("shop", shop)
      .single();

    if (shopError || !shopData) {
      console.error("❌ Shop not found:", shopError);
      throw new Error(`Shop not found: ${shopError?.message || "No data"}`);
    }

    const accessToken = shopData.access_token;
    console.log("🔑 Access token retrieved");

    // Register the mandatory GDPR webhooks
    const webhookSecret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("SHOPIFY_WEBHOOK_SECRET not configured");
    }

    const functionUrl = `${supabaseUrl}/functions/v1/shopify-gdpr`;
    console.log("🔗 Webhook endpoint:", functionUrl);

    const gdprTopics = [
      "customers/data_request",
      "customers/redact",
      "shop/redact"
    ];

    const results = [];

    for (const topic of gdprTopics) {
      console.log(`🔄 Registering webhook for ${topic}`);
      
      const response = await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          webhook: {
            topic,
            address: functionUrl,
            format: "json"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to register ${topic} webhook:`, errorText);
        results.push({ topic, success: false, error: errorText });
        continue;
      }

      const webhookData = await response.json();
      console.log(`✅ Webhook registered for ${topic}:`, webhookData.webhook.id);
      
      results.push({ 
        topic, 
        success: true, 
        id: webhookData.webhook.id 
      });

      // Store webhook in database
      await supabase
        .from("shopify_webhooks")
        .upsert({
          shop_domain: shop,
          webhook_id: webhookData.webhook.id.toString(),
          topic,
          address: functionUrl,
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "GDPR webhooks registered successfully",
        results
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("❌ GDPR registration error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});