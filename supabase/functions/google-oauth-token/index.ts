import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TokenRequest {
  code: string
  codeVerifier: string
  redirectUri: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, codeVerifier, redirectUri }: TokenRequest = await req.json()

    // Validation des paramètres
    if (!code || !codeVerifier || !redirectUri) {
      return new Response(
        JSON.stringify({ success: false, message: 'Paramètres manquants' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const clientId = Deno.env.get('VITE_GOOGLE_CLIENT_ID')
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      throw new Error('Configuration Google OAuth manquante')
    }

    // Échanger le code contre des tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      throw new Error(`Erreur Google OAuth: ${errorData.error_description || errorData.error}`)
    }

    const tokens = await tokenResponse.json()

    // Vérifier l'ID token si présent
    if (tokens.id_token) {
      const idTokenParts = tokens.id_token.split('.')
      if (idTokenParts.length === 3) {
        const payload = JSON.parse(atob(idTokenParts[1]))
        
        // Vérifier l'audience et l'émetteur
        if (payload.aud !== clientId || payload.iss !== 'https://accounts.google.com') {
          throw new Error('ID token invalide')
        }
        
        // Vérifier l'expiration
        if (payload.exp < Date.now() / 1000) {
          throw new Error('ID token expiré')
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        token_type: tokens.token_type,
        scope: tokens.scope,
        id_token: tokens.id_token,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Google OAuth token error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Erreur interne du serveur' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})