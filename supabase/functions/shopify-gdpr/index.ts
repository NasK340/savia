import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256')
    const topic = req.headers.get('x-shopify-topic')
    const shopDomain = req.headers.get('x-shopify-shop-domain')

    // Vérification HMAC obligatoire pour les webhooks Shopify
    if (!hmacHeader || !topic || !shopDomain) {
      return new Response(
        JSON.stringify({ error: 'Headers manquants' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Vérifier la signature HMAC
    const webhookSecret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('SHOPIFY_WEBHOOK_SECRET non configuré')
    }

    const calculatedHmac = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => 
      crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
    ).then(signature => 
      btoa(String.fromCharCode(...new Uint8Array(signature)))
    )

    if (calculatedHmac !== hmacHeader) {
      return new Response(
        JSON.stringify({ error: 'HMAC invalide' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parser le payload
    const payload = JSON.parse(body)

    // Initialiser Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Traiter selon le type de webhook GDPR
    switch (topic) {
      case 'customers/data_request':
        // Demande d'accès aux données client
        await supabase
          .from('gdpr_requests')
          .insert({
            type: 'data_request',
            shop_domain: shopDomain,
            customer_id: payload.customer.id,
            customer_email: payload.customer.email,
            request_data: payload,
            status: 'pending',
            created_at: new Date().toISOString(),
          })
        break

      case 'customers/redact':
        // Demande de suppression des données client
        await supabase
          .from('gdpr_requests')
          .insert({
            type: 'customer_redact',
            shop_domain: shopDomain,
            customer_id: payload.customer.id,
            customer_email: payload.customer.email,
            request_data: payload,
            status: 'pending',
            created_at: new Date().toISOString(),
          })
        break

      case 'shop/redact':
        // Demande de suppression des données de la boutique
        await supabase
          .from('gdpr_requests')
          .insert({
            type: 'shop_redact',
            shop_domain: shopDomain,
            request_data: payload,
            status: 'pending',
            created_at: new Date().toISOString(),
          })
        break

      default:
        console.log(`Webhook GDPR non géré: ${topic}`)
    }

    // Réponse 200 OK obligatoire pour Shopify
    return new Response(
      JSON.stringify({ status: 'ok' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('GDPR webhook error:', error)
    
    // Toujours retourner 200 pour éviter les retry de Shopify
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})