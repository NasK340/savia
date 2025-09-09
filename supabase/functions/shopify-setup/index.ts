import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialiser Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Créer les tables nécessaires pour Shopify et GDPR
    const tables = [
      // Table des boutiques Shopify
      `
      CREATE TABLE IF NOT EXISTS shopify_stores (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        shop_domain text UNIQUE NOT NULL,
        access_token text NOT NULL,
        shop_data jsonb,
        installed_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
      `,
      
      // Table des demandes GDPR
      `
      CREATE TABLE IF NOT EXISTS gdpr_requests (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        type text NOT NULL CHECK (type IN ('data_request', 'customer_redact', 'shop_redact')),
        shop_domain text NOT NULL,
        customer_id text,
        customer_email text,
        request_data jsonb,
        status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        processed_at timestamptz,
        created_at timestamptz DEFAULT now()
      );
      `,
      
      // Table des webhooks
      `
      CREATE TABLE IF NOT EXISTS shopify_webhooks (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        shop_domain text NOT NULL,
        webhook_id text NOT NULL,
        topic text NOT NULL,
        address text NOT NULL,
        created_at timestamptz DEFAULT now()
      );
      `,
      
      // Index pour les performances
      `
      CREATE INDEX IF NOT EXISTS idx_shopify_stores_domain ON shopify_stores(shop_domain);
      CREATE INDEX IF NOT EXISTS idx_gdpr_requests_shop ON gdpr_requests(shop_domain);
      CREATE INDEX IF NOT EXISTS idx_gdpr_requests_status ON gdpr_requests(status);
      CREATE INDEX IF NOT EXISTS idx_shopify_webhooks_shop ON shopify_webhooks(shop_domain);
      `
    ]

    // Exécuter chaque requête SQL
    for (const sql of tables) {
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.error('SQL Error:', error)
        throw new Error(`Erreur SQL: ${error.message}`)
      }
    }

    // Configurer les webhooks GDPR obligatoires
    const { shop_domain } = await req.json()
    
    if (shop_domain) {
      // Récupérer l'access token
      const { data: store, error: storeError } = await supabase
        .from('shopify_stores')
        .select('access_token')
        .eq('shop_domain', shop_domain)
        .single()

      if (storeError || !store) {
        throw new Error('Boutique non trouvée')
      }

      // Créer les webhooks GDPR obligatoires
      const webhooks = [
        {
          topic: 'customers/data_request',
          address: `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-gdpr`,
        },
        {
          topic: 'customers/redact',
          address: `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-gdpr`,
        },
        {
          topic: 'shop/redact',
          address: `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-gdpr`,
        },
      ]

      for (const webhook of webhooks) {
        const response = await fetch(`https://${shop_domain}/admin/api/2023-10/webhooks.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhook: {
              topic: webhook.topic,
              address: webhook.address,
              format: 'json',
            },
          }),
        })

        if (response.ok) {
          const webhookData = await response.json()
          
          // Sauvegarder en base
          await supabase
            .from('shopify_webhooks')
            .insert({
              shop_domain,
              webhook_id: webhookData.webhook.id.toString(),
              topic: webhook.topic,
              address: webhook.address,
            })
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Tables et webhooks GDPR initialisés avec succès' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur interne du serveur' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})