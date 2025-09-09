import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SHOPIFY_CONFIG } from '../../lib/app-bridge';
import toast from 'react-hot-toast';

interface ShopifyConnectProps {
  onSuccess?: () => void;
}

export function ShopifyConnect({ onSuccess }: ShopifyConnectProps) {
  const [shopDomain, setShopDomain] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!shopDomain.trim()) {
      setError('Veuillez entrer le nom de votre boutique');
      return;
    }

    // Nettoyer et valider le domaine
    let cleanDomain = shopDomain.trim().toLowerCase();
    
    // Supprimer les protocoles et chemins
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.replace(/\/.*$/, '');
    
    // Ajouter .myshopify.com si nécessaire
    if (!cleanDomain.includes('.')) {
      cleanDomain = `${cleanDomain}.myshopify.com`;
    }
    
    // Validation du format
    if (!cleanDomain.match(/^[a-z0-9-]+\.myshopify\.com$/)) {
      setError('Format de boutique invalide. Utilisez: ma-boutique.myshopify.com ou ma-boutique');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Générer un state aléatoire pour la sécurité
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('shopify_oauth_state', state);
      sessionStorage.setItem('shopify_shop_domain', cleanDomain); 

      // Construire l'URL d'installation Shopify avec les vraies clés
      const installUrl = new URL(`https://${cleanDomain}/admin/oauth/authorize`);
      installUrl.searchParams.set('client_id', SHOPIFY_CONFIG.apiKey);
      installUrl.searchParams.set('scope', SHOPIFY_CONFIG.scopes.replace(/,/g, ' '));
      // Utiliser l'URL complète pour la redirection
      installUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
      installUrl.searchParams.set('state', state);
      installUrl.searchParams.set('grant_options[]', 'per-user');

      console.log('🔄 Redirecting to Shopify OAuth:', installUrl.toString());
      console.log('🔗 Redirect URI:', `${window.location.origin}/auth/callback`);
      console.log('🔑 API Key:', SHOPIFY_CONFIG.apiKey);
      console.log('🔒 Scopes:', SHOPIFY_CONFIG.scopes.replace(/,/g, ' '));

      // Rediriger vers Shopify pour l'installation
      window.location.href = installUrl.toString();

    } catch (error) {
      console.error('Erreur lors de la connexion Shopify:', error);
      setError('Erreur lors de la connexion. Veuillez réessayer.');
      setIsConnecting(false);
      toast.error('Erreur lors de la connexion à Shopify');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-green-600" size={32} />
        </div>
        <CardTitle>Connecter votre boutique Shopify</CardTitle>
        <p className="text-gray-600 text-sm">
          Connectez votre boutique Shopify pour commencer à automatiser votre SAV
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de votre boutique Shopify
          </label>
          <div className="relative">
            <Input
              type="text"
              value={shopDomain}
              onChange={(e) => {
                setShopDomain(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="ma-boutique ou ma-boutique.myshopify.com"
              disabled={isConnecting}
              className={error ? 'border-red-300' : ''}
            />
            {shopDomain && !shopDomain.includes('.') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                .myshopify.com
              </div>
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {error}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Exemple: ma-boutique.myshopify.com ou simplement ma-boutique
          </p>
        </div>

        <Button
          onClick={handleConnect}
          disabled={isConnecting || !shopDomain.trim()}
          className="w-full flex items-center justify-center gap-2"
        >
          {isConnecting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
              Connecter ma boutique
              <ArrowRight size={20} />
            </>
          )}
        </Button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <CheckCircle size={16} />
            Que va-t-il se passer ?
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Vous serez redirigé vers Shopify</li>
            <li>• Autorisez l'accès à votre boutique</li>
            <li>• Retour automatique vers Livia</li>
            <li>• Configuration automatique du SAV</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Sécurisé et conforme aux standards Shopify
          </p>
        </div>
      </CardContent>
    </Card>
  );
}