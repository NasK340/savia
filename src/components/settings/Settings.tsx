import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { Settings as SettingsIcon, Mail, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import { ShopifyConnect } from '../shopify/ShopifyConnect';

const toneOptions = [
  { value: 'formal', label: 'Formel et professionnel' },
  { value: 'friendly', label: 'Amical et chaleureux' },
  { value: 'neutral', label: 'Neutre et factuel' }
];

export function Settings() {
  const { businessInfo, setBusinessInfo, integrations, setIntegrations } = useApp();
  const [saving, setSaving] = useState(false);
  const [showShopifyConnect, setShowShopifyConnect] = useState(false);
  const [formData, setFormData] = useState({
    shopName: businessInfo?.shopName || '',
    shopUrl: businessInfo?.shopUrl || '',
    sector: businessInfo?.sector || 'fashion',
    tonePreference: businessInfo?.tonePreference || 'friendly',
    returnPolicy: businessInfo?.returnPolicy || '',
    shippingPolicy: businessInfo?.shippingPolicy || ''
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBusinessInfo({
      ...formData,
      responseTimePreference: businessInfo?.responseTimePreference || '24'
    });
    
    setSaving(false);
  };

  const handleReconnectIntegration = async (type: 'email' | 'shopify') => {
    if (type === 'shopify') {
      setShowShopifyConnect(true);
      return;
    }
    
    // Pour les autres intégrations
    const updatedIntegrations = integrations.map(integration => 
      integration.type === type 
        ? { ...integration, status: 'connected' as const, lastSync: new Date() }
        : integration
    );
    setIntegrations(updatedIntegrations);
  };

  const handleShopifyConnectionSuccess = () => {
    setShowShopifyConnect(false);
    
    // Mettre à jour l'état de l'intégration Shopify
    const updatedIntegrations = integrations.map(integration => 
      integration.type === 'shopify' 
        ? { ...integration, connected: true, status: 'connected' as const, lastSync: new Date() }
        : integration
    );
    setIntegrations(updatedIntegrations);
  };

  // Afficher l'interface de connexion Shopify
  if (showShopifyConnect) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowShopifyConnect(false)}
          >
            ← Retour aux paramètres
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Reconnecter Shopify</h1>
        </div>
        
        <div className="max-w-md mx-auto">
          <ShopifyConnect onSuccess={handleShopifyConnectionSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configurez votre SAV automatisé</p>
      </div>

      {/* Integrations Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            État des intégrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {integration.type === 'email' ? (
                  <Mail className="h-6 w-6 text-blue-500" />
                ) : (
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {integration.type === 'email' ? 'Email' : 'Shopify'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {integration.lastSync 
                      ? `Dernière sync: ${new Intl.DateTimeFormat('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(integration.lastSync)}`
                      : 'Jamais synchronisé'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={integration.connected ? 'success' : 'danger'}>
                  {integration.connected ? (
                    <><CheckCircle size={14} className="mr-1" /> Connecté</>
                  ) : (
                    <><AlertCircle size={14} className="mr-1" /> Déconnecté</>
                  )}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReconnectIntegration(integration.type)}
                >
                  {integration.connected ? 'Reconnecter' : 'Connecter'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Business Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration de la boutique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom de votre boutique"
              value={formData.shopName}
              onChange={(e) => setFormData({...formData, shopName: e.target.value})}
              placeholder="Ma Belle Boutique"
            />
            <Input
              label="URL de votre site web"
              value={formData.shopUrl}
              onChange={(e) => setFormData({...formData, shopUrl: e.target.value})}
              placeholder="https://ma-boutique.com"
            />
          </div>

          <Select
            label="Ton de réponse préféré"
            value={formData.tonePreference}
            onChange={(e) => setFormData({...formData, tonePreference: e.target.value as any})}
            options={toneOptions}
          />

          <Input
            label="Politique de retour"
            value={formData.returnPolicy}
            onChange={(e) => setFormData({...formData, returnPolicy: e.target.value})}
            placeholder="Ex: Retours acceptés sous 30 jours..."
          />

          <Input
            label="Informations de livraison"
            value={formData.shippingPolicy}
            onChange={(e) => setFormData({...formData, shippingPolicy: e.target.value})}
            placeholder="Ex: Livraison sous 2-3 jours ouvrés..."
          />

          <Button
            onClick={handleSave}
            loading={saving}
            className="w-full md:w-auto"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Automatisation des réponses</h4>
            <p className="text-sm text-blue-700 mb-3">
              L'IA traite automatiquement les demandes simples et courantes selon vos paramètres.
            </p>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="auto-responses" className="rounded" defaultChecked />
              <label htmlFor="auto-responses" className="text-sm text-blue-700">
                Activer les réponses automatiques
              </label>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Escalade manuelle</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Les cas complexes sont automatiquement transférés pour traitement manuel.
            </p>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="manual-escalation" className="rounded" defaultChecked />
              <label htmlFor="manual-escalation" className="text-sm text-yellow-700">
                Activer l'escalade automatique
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}