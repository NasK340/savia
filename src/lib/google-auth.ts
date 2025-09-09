// Google OAuth2 sécurisé pour l'authentification
// Utilise PKCE (Proof Key for Code Exchange) pour la sécurité

interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

class GoogleAuthManager {
  private config: GoogleAuthConfig;
  private codeVerifier: string | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/google/callback`,
      scopes: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send'
      ]
    };
  }

  // Générer un code verifier PKCE pour la sécurité
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Générer le code challenge PKCE
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Générer un state aléatoire pour la sécurité CSRF
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  }

  // Initier la connexion Google OAuth2
  async initiateAuth(): Promise<void> {
    if (!this.config.clientId) {
      throw new Error('Google Client ID non configuré');
    }

    try {
      // Générer PKCE et state pour la sécurité
      this.codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
      const state = this.generateState();

      // Stocker temporairement pour la vérification
      sessionStorage.setItem('google_code_verifier', this.codeVerifier);
      sessionStorage.setItem('google_state', state);

      // Construire l'URL d'autorisation
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', this.config.clientId);
      authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', this.config.scopes.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');

      // Rediriger vers Google
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Erreur lors de l\'initiation de l\'auth Google:', error);
      throw error;
    }
  }

  // Échanger le code d'autorisation contre des tokens
  async exchangeCodeForTokens(code: string, state: string): Promise<GoogleTokenResponse> {
    try {
      // Vérifier le state pour la sécurité CSRF
      const storedState = sessionStorage.getItem('google_state');
      if (!storedState || storedState !== state) {
        throw new Error('State invalide - possible attaque CSRF');
      }

      // Récupérer le code verifier
      const codeVerifier = sessionStorage.getItem('google_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier manquant');
      }

      // Nettoyer le storage
      sessionStorage.removeItem('google_code_verifier');
      sessionStorage.removeItem('google_state');

      // Échanger le code via notre Edge Function sécurisée
      const response = await fetch('/api/google/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          codeVerifier,
          redirectUri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'échange du token');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
      throw error;
    }
  }

  // Récupérer les informations utilisateur
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des infos utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des infos utilisateur:', error);
      throw error;
    }
  }

  // Rafraîchir le token d'accès
  async refreshToken(refreshToken: string): Promise<GoogleTokenResponse> {
    try {
      const response = await fetch('/api/google/oauth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du rafraîchissement du token');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  // Révoquer l'accès
  async revokeAccess(token: string): Promise<void> {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la révocation du token');
      }
    } catch (error) {
      console.error('Erreur lors de la révocation:', error);
      throw error;
    }
  }
}

// Instance singleton
export const googleAuth = new GoogleAuthManager();

// Types pour TypeScript
export type { GoogleTokenResponse, GoogleUserInfo };