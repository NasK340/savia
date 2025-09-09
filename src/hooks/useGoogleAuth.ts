import { useState, useEffect } from 'react';
import { googleAuth, GoogleUserInfo } from '../lib/google-auth';

interface GoogleAuthState {
  isAuthenticated: boolean;
  user: GoogleUserInfo | null;
  loading: boolean;
  error: string | null;
}

export function useGoogleAuth() {
  const [state, setState] = useState<GoogleAuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Vérifier l'état de l'authentification au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/google/auth/status', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          isAuthenticated: data.authenticated,
          user: data.user || null,
          loading: false,
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut auth:', error);
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  };

  const signIn = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Sauvegarder l'URL de retour
      sessionStorage.setItem('google_return_url', window.location.pathname);
      
      await googleAuth.initiateAuth();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/google/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      } else {
        throw new Error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de déconnexion';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  return {
    ...state,
    signIn,
    signOut,
    refreshAuth,
  };
}