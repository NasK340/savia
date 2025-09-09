import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, AlertCircle, ExternalLink, Settings, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShopifyConnect } from '../shopify/ShopifyConnect';
import { useApp } from '../../contexts/AppContext';

interface ShopifyStore {
  id: string;
  name: string;
  domain: string;
  email: string;
  currency: string;
  connectedAt: Date;
  lastSync?: Date;
  status: 'connected' | 'error' | 'syncing';
}

export function ShopifyIntegration() {
  const { user, integrations, setIntegrations } = useApp();
  const [connectedStore, setConnectedStore] = useState<ShopifyStore | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si Shopify est déjà connecté
  useEffect(() => {
    const shopifyIntegration = integrations.find(i => i.type === 'shopify');
    if (shopifyIntegration?.connected) {
      // Simuler les données de la boutique connectée
      setConnectedStore({
        id: '1',
        name: 'Ma Belle Boutique',
        domain: 'ma-belle-boutique.myshopify.com',
        email: 'contact@ma-belle-boutique.com',
        currency: 'EUR',
        connectedAt: new Date(),
        lastSync: new Date(),
        status: 'connected'
      });
    }
  }, [integrations]);

  const handleConnect = () => {
    setShowConnect(true);
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    
    // Simuler la déconnexion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setConnectedStore(null);
    setIntegrations(integrations.map(integration => 
      integration.type === 'shopify' 
        ? { ...integration, connected: false, status: 'disconnected' as const }
        : integration
    ));
    
    setIsLoading(false);
  };

  const handleSync = async () => {
    if (!connectedStore) return;
    
    setConnectedStore({ ...connectedStore, status: 'syncing' });
    
    // Simuler la synchronisation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectedStore({ 
      ...connectedStore, 
      status: 'connected',
      lastSync: new Date()
    });
  };

  const handleConnectionSuccess = () => {
    setShowConnect(false);
    
    // Mettre à jour l'état des intégrations
    setIntegrations(integrations.map(integration => 
      integration.type === 'shopify' 
        ? { ...integration, connected: true, status: 'connected' as const, lastSync: new Date() }
        : integration
    ));

    // Simuler les données de la boutique
    setConnectedStore({
      id: '1',
      name: 'Ma Belle Boutique',
      domain: 'ma-belle-boutique.myshopify.com',
      email: 'contact@ma-belle-boutique.com',
      currency: 'EUR',
      connectedAt: new Date(),
      lastSync: new Date(),
      status: 'connected'
    });
  };

  if (showConnect) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Connecter Shopify</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowConnect(false)}
          >
            Retour
          </Button>
        </div>
        <ShopifyConnect onSuccess={handleConnectionSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Intégration Shopify</h2>
        <p className="text-gray-600">
          Connectez votre boutique Shopify pour accéder aux commandes, clients et automatiser votre SAV
        </p>
      </div>

      {connectedStore ? (
        // Boutique connectée
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{connectedStore.name}</h3>
                  <p className="text-sm text-gray-500">{connectedStore.domain}</p>
                </div>
              </CardTitle>
              <Badge variant={connectedStore.status === 'connected' ? 'success' : 'warning'}>
                {connectedStore.status === 'connected' ? (
                  <>
                    <CheckCircle size={14} className="mr-1" />
                    Connecté
                  </>
                ) : connectedStore.status === 'syncing' ? (
                  <>
                    <Loader2 size={14} className="mr-1 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="mr-1" />
                    Erreur
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email de contact</label>
                <p className="text-sm text-gray-900">{connectedStore.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Devise</label>
                <p className="text-sm text-gray-900">{connectedStore.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Connecté le</label>
                <p className="text-sm text-gray-900">
                  {connectedStore.connectedAt.toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Dernière sync</label>
                <p className="text-sm text-gray-900">
                  {connectedStore.lastSync 
                    ? connectedStore.lastSync.toLocaleString('fr-FR')
                    : 'Jamais'
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                onClick={handleSync}
                disabled={connectedStore.status === 'syncing'}
                variant="outline"
                className="flex items-center gap-2"
              >
                {connectedStore.status === 'syncing' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Settings size={16} />
                )}
                Synchroniser
              </Button>
              
              <Button
                onClick={() => window.open(`https://${connectedStore.domain}/admin`, '_blank')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Ouvrir Shopify
              </Button>
              
              <Button
                onClick={handleDisconnect}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Déconnecter'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Pas de boutique connectée
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune boutique Shopify connectée
            </h3>
            <p className="text-gray-600 mb-6">
              Connectez votre boutique Shopify pour commencer à automatiser votre service client
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Accès aux données</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Commandes et statuts</li>
                  <li>• Informations clients</li>
                  <li>• Produits et inventaire</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Automatisation</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Réponses contextualisées</li>
                  <li>• Suivi des livraisons</li>
                  <li>• Gestion des retours</li>
                </ul>
              </div>
            </div>
            
            <Button onClick={handleConnect} className="flex items-center gap-2">
              <ShoppingBag size={20} />
              Connecter ma boutique Shopify
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informations sur l'intégration */}
      <Card>
        <CardHeader>
          <CardTitle>À propos de l'intégration Shopify</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Données accessibles</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Commandes et leur statut de livraison</li>
                <li>• Informations clients (nom, email, historique)</li>
                <li>• Produits et leurs détails</li>
                <li>• Données de facturation et expédition</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sécurité et confidentialité</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connexion sécurisée via OAuth 2.0</li>
                <li>• Accès en lecture seule aux données sensibles</li>
                <li>• Conformité RGPD et standards Shopify</li>
                <li>• Possibilité de déconnexion à tout moment</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}