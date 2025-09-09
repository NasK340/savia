import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface UserSaveRequest {
  userInfo: {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
  }
  tokens: {
    access_token: string
    refresh_token?: string
    expires_in: number
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userInfo, tokens }: UserSaveRequest = await req.json()

    // Validation des données
    if (!userInfo || !userInfo.email || !userInfo.verified_email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Informations utilisateur invalides' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!tokens || !tokens.access_token) {
      return new Response(
        JSON.stringify({ success: false, message: 'Tokens manquants' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialiser Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Calculer la date d'expiration
    const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000))

    // Sauvegarder ou mettre à jour l'utilisateur Google
    const { data: existingUser, error: fetchError } = await supabase
      .from('google_users')
      .select('*')
      .eq('google_id', userInfo.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Erreur lors de la recherche utilisateur: ${fetchError.message}`)
    }

    const userData = {
      google_id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      picture: userInfo.picture,
      locale: userInfo.locale,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: expiresAt.toISOString(),
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    let user
    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      const { data, error } = await supabase
        .from('google_users')
        .update(userData)
        .eq('google_id', userInfo.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`)
      }
      user = data
    } else {
      // Créer un nouvel utilisateur
      const { data, error } = await supabase
        .from('google_users')
        .insert({
          ...userData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Erreur lors de la création: ${error.message}`)
      }
      user = data
    }

    // Créer une session sécurisée
    const sessionToken = crypto.randomUUID()
    const sessionExpiry = new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24h

    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: sessionExpiry.toISOString(),
        created_at: new Date().toISOString(),
      })

    if (sessionError) {
      throw new Error(`Erreur lors de la création de session: ${sessionError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
        sessionToken,
        message: 'Utilisateur sauvegardé avec succès',
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Set-Cookie': `session_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`,
        } 
      }
    )

  } catch (error) {
    console.error('Google user save error:', error)
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