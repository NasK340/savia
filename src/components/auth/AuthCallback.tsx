import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setIntegrations, integrations } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authentification en cours...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('🔄 Shopify OAuth Callback Started');
        console.log('📌 URL:', window.location.href);
        
        // Extraire tous les paramètres de l'URL
        const urlParams = new URLSearchParams(location.search);

        // Vérifier si c'est un callback Shopify
        const code = searchParams.get('code');
        const shop = searchParams.get('shop');
        const hmac = searchParams.get('hmac') || '';
        const timestamp = searchParams.get('timestamp');
        const state = searchParams.get('state');
        const host = searchParams.get('host');

        console.log('📦 OAuth Params:', { 
          code: code ? '✓' : '✗', 
          shop: shop ? '✓' : '✗', 
          hmac: hmac ? '✓' : '✗', 
          timestamp: timestamp ? '✓' : '✗',
          state: state ? '✓' : '✗',
          host: host ? '✓' : '✗'
        });

        // Vérifier les paramètres minimum requis
        if (!code) {
          console.error('❌ Code OAuth manquant');
          throw new Error('Code d\'autorisation manquant');
        }

        if (!shop) {
          console.error('❌ Shop domain manquant');
          throw new Error('Domaine de boutique manquant');
        }

        console.log('✅ Paramètres OAuth de base présents');
        setMessage('Échange du code d\'autorisation...');

        // Vérifier le state pour la sécurité CSRF
        const storedState = sessionStorage.getItem('shopify_oauth_state');
        const storedShop = sessionStorage.getItem('shopify_shop_domain');
        
        console.log('🔐 Vérification CSRF:', { 
          receivedState: state, 
          storedState, 
          receivedShop: shop, 
          storedShop 
        });
        
        if (storedState && state !== storedState) {
          throw new Error('État de sécurité invalide - possible attaque CSRF');
        }
        
        if (storedShop && shop !== storedShop) {
          throw new Error('Domaine de boutique ne correspond pas à la demande initiale');
        }

        // Appeler l'Edge Function pour l'échange du code
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const callbackUrl = `${supabaseUrl}/functions/v1/shopify-oauth`;
        
        console.log('🔄 Appel de l\'Edge Function:', callbackUrl);
        
        const response = await fetch(callbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            shop,
            hmac,
            timestamp,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de l\'échange du code');
        }
        
        const result = await response.json();
        console.log('✅ Résultat de l\'échange:', result);

        setMessage('Finalisation de la connexion...');

        // Nettoyer le storage si nécessaire
        sessionStorage.removeItem('shopify_oauth_state');
        sessionStorage.removeItem('shopify_shop_domain');

        // Mettre à jour l'état des intégrations
        const updatedIntegrations = integrations.map(integration => 
          integration.type === 'shopify' 
            ? { ...integration, connected: true, status: 'connected' as const, lastSync: new Date() }
            : integration
        );
        setIntegrations(updatedIntegrations);

        setStatus('success');
        setMessage('Connexion Shopify réussie !');
        toast.success(`Boutique ${shop} connectée avec succès !`);
        console.log('✅ Authentification Shopify réussie');

        // Redirection vers l'app avec le paramètre shop
        setTimeout(() => {
          // Construire l'URL de redirection avec shop et host si disponible
          const params = new URLSearchParams();
          if (shop) params.set('shop', shop);
          if (host) params.set('host', host);
          
          const redirectUrl = user 
            ? `/app?${params.toString()}` 
            : `/?${params.toString()}`;
            
          console.log('🔄 Redirection vers:', redirectUrl);
          
          // Sauvegarder le shop dans localStorage pour le conserver
          if (shop) {
            localStorage.setItem('shopify_shop', shop);
          }
          
          navigate(redirectUrl, { replace: true });
        }, 1500);

      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Erreur d\'authentification inconnue';
        setMessage(errorMessage);
        toast.error(errorMessage);

        // Redirection vers la landing page après erreur
        setTimeout(() => {
          console.log('🔄 Redirection vers la landing page après erreur');
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    // Délai pour s'assurer que tous les paramètres sont chargés
    const timer = setTimeout(handleOAuthCallback, 200);
    return () => clearTimeout(timer);
  }, [searchParams, navigate, location, user, setIntegrations, integrations]);

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
          {status === 'loading' && 'Connexion Shopify'}
          {status === 'success' && 'Succès !'}
          {status === 'error' && 'Erreur'}
        </h1>

        <p className="text-gray-600 mb-4">{message}</p>

        {status === 'loading' && (
          <div className="text-sm text-gray-500 space-y-2 max-w-full overflow-hidden">
            <p>Veuillez patienter pendant que nous configurons votre connexion...</p>
            <div className="text-xs text-gray-400 break-all bg-gray-50 p-2 rounded overflow-x-auto">
              <code>{window.location.href}</code>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
            <div className="text-xs text-gray-400 break-all bg-gray-50 p-2 rounded overflow-x-auto">
              <code>{window.location.href}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}