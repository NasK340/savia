import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { googleAuth } from '../../lib/google-auth';
import { useShopifyContext } from '../../contexts/ShopifyContext';
import toast from 'react-hot-toast';

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setShop } = useShopifyContext();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Traitement de l\'authentification Google...');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Erreur Google OAuth: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Paramètres OAuth manquants');
        }

        setMessage('Échange du code d\'autorisation...');

        // Échanger le code contre des tokens
        const tokens = await googleAuth.exchangeCodeForTokens(code, state);

        setMessage('Récupération des informations utilisateur...');

        // Récupérer les informations utilisateur
        const userInfo = await googleAuth.getUserInfo(tokens.access_token);

        if (!userInfo.verified_email) {
          throw new Error('Email Google non vérifié');
        }

        setMessage('Sauvegarde des informations...');

        // Sauvegarder les tokens et infos utilisateur via Edge Function
        const response = await fetch('/api/google/user/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userInfo,
            tokens: {
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expires_in: tokens.expires_in,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
        }

        const result = await response.json();

        setStatus('success');
        setMessage('Authentification Google réussie !');
        toast.success('Connexion Google réussie !');

        // Rediriger vers l'application
        setTimeout(() => {
          const returnUrl = sessionStorage.getItem('google_return_url') || '/app';
          sessionStorage.removeItem('google_return_url');
          navigate(returnUrl);
        }, 1500);

      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Erreur d\'authentification Google';
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, setShop]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          )}
          {status === 'success' && (
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          )}
          {status === 'error' && (
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          )}
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {status === 'loading' && 'Authentification Google'}
          {status === 'success' && 'Succès !'}
          {status === 'error' && 'Erreur'}
        </h1>

        <p className="text-gray-600 mb-4">{message}</p>

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retour à l'application
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}