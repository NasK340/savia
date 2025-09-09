import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, ShoppingBag, MessageSquare, Phone, Zap, CheckCircle, AlertCircle, Settings, RefreshCw as Refresh } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ShopifyIntegration } from './ShopifyIntegration';
import { useApp } from '../../contexts/AppContext';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'email' | 'ecommerce' | 'communication' | 'analytics';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: Date;
  features: string[];
  setupComplexity: 'easy' | 'medium' | 'advanced';
  isPopular?: boolean;
  isNew?: boolean;
}

const availableIntegrations: Integration[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Synchronisez vos commandes, clients et produits Shopify pour un SAV contextualisé',
    icon: ShoppingBag,
    category: 'ecommerce',
    status: 'connected',
    lastSync: new Date(Date.now() - 300000),
    features: ['Données commandes', 'Informations clients', 'Statuts de livraison'],
    setupComplexity: 'medium',
    isPopular: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Connectez votre boîte Gmail pour recevoir et traiter automatiquement les emails SAV',
    icon: Mail,
    category: 'email',
    status: 'connected',
    lastSync: new Date(),
    features: ['Réception automatique', 'Envoi de réponses', 'Synchronisation temps réel'],
    setupComplexity: 'easy',
    isPopular: true
  },
  {
    id: 'outlook',
    name: 'Outlook',
    description: 'Intégration avec Microsoft Outlook pour la gestion des emails professionnels',
    icon: Mail,
    category: 'email',
    status: 'disconnected',
    features: ['Réception automatique', 'Envoi de réponses', 'Calendrier intégré'],
    setupComplexity: 'easy',
    isPopular: true
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Connectez votre boutique WooCommerce pour accéder aux données de commandes',
    icon: ShoppingBag,
    category: 'ecommerce',
    status: 'disconnected',
    features: ['Données commandes', 'Gestion des retours', 'Suivi des livraisons'],
    setupComplexity: 'medium'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Gérez vos conversations WhatsApp Business directement depuis Livia',
    icon: MessageSquare,
    category: 'communication',
    status: 'disconnected',
    features: ['Messages automatiques', 'Chatbot intégré', 'Médias supportés'],
    setupComplexity: 'advanced',
    isNew: true
  },
  {
    id: 'messenger',
    name: 'Facebook Messenger',
    description: 'Intégrez Facebook Messenger pour un support client omnicanal',
    icon: MessageSquare,
    category: 'communication',
    status: 'disconnected',
    features: ['Réponses automatiques', 'Transfert vers agents', 'Historique unifié'],
    setupComplexity: 'medium'
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Synchronisez vos tickets Zendesk avec Livia pour une gestion unifiée',
    icon: Settings,
    category: 'communication',
    status: 'disconnected',
    features: ['Import de tickets', 'Synchronisation bidirectionnelle', 'Métriques unifiées'],
    setupComplexity: 'advanced'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Recevez des notifications et gérez les escalades directement dans Slack',
    icon: MessageSquare,
    category: 'communication',
    status: 'disconnected',
    features: ['Notifications temps réel', 'Commandes slash', 'Escalade rapide'],
    setupComplexity: 'easy',
    isNew: true
  }
];

export function IntegrationHub() {
  const { integrations, setIntegrations } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Toutes', count: availableIntegrations.length },
    { id: 'email', name: 'Email', count: availableIntegrations.filter(i => i.category === 'email').length },
    { id: 'ecommerce', name: 'E-commerce', count: availableIntegrations.filter(i => i.category === 'ecommerce').length },
    { id: 'communication', name: 'Communication', count: availableIntegrations.filter(i => i.category === 'communication').length },
    { id: 'analytics', name: 'Analytics', count: availableIntegrations.filter(i => i.category === 'analytics').length }
  ];

  const filteredIntegrations = availableIntegrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = async (integrationId: string) => {
    if (integrationId === 'shopify') {
      setSelectedIntegration('shopify');
      return;
    }
    
    // Simulation de connexion pour les autres intégrations
    console.log(`Connecting to ${integrationId}...`);
    
    // Mise à jour du statut
    const updatedIntegrations = integrations.map(integration =>
      (integration.type === 'email' && integrationId === 'gmail') ||
      (integration.type === 'shopify' && integrationId === 'shopify')
        ? { ...integration, connected: true, status: 'connected' as const, lastSync: new Date() }
        : integration
    );
    setIntegrations(updatedIntegrations);
  };

  const handleDisconnect = async (integrationId: string) => {
    console.log(`Disconnecting from ${integrationId}...`);
    // Logique de déconnexion
  };

  const handleSync = async (integrationId: string) => {
    console.log(`Syncing ${integrationId}...`);
    // Logique de synchronisation
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'error': return 'danger';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Connecté';
      case 'error': return 'Erreur';
      case 'pending': return 'En cours';
      default: return 'Déconnecté';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'advanced': return 'Avancé';
      default: return complexity;
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  // Afficher l'intégration Shopify spécifique
  if (selectedIntegration === 'shopify') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedIntegration(null)}
          >
            ← Retour aux intégrations
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Intégration Shopify</h1>
        </div>
        <ShopifyIntegration />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hub d'Intégrations</h1>
          <p className="text-gray-600">Connectez vos outils favoris pour un SAV unifié</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Demander une intégration
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher une intégration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intégrations connectées */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Intégrations actives</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations
            .filter(integration => integration.status === 'connected')
            .map(integration => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icon className="text-green-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <Badge variant={getStatusColor(integration.status)} size="sm">
                            <CheckCircle size={12} className="mr-1" />
                            {getStatusLabel(integration.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {integration.description}
                    </p>

                    {integration.lastSync && (
                      <div className="text-xs text-gray-500 mb-4">
                        Dernière sync: {formatLastSync(integration.lastSync)}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        className="flex-1"
                      >
                        <Refresh size={14} className="mr-1" />
                        Synchroniser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (integration.id === 'shopify') {
                            setSelectedIntegration('shopify');
                          }
                        }}
                      >
                        <Settings size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Intégrations disponibles */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Intégrations disponibles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations
            .filter(integration => integration.status !== 'connected')
            .map(integration => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="text-gray-600" size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            {integration.isPopular && (
                              <Badge variant="warning" size="sm">Populaire</Badge>
                            )}
                            {integration.isNew && (
                              <Badge variant="info" size="sm">Nouveau</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getStatusColor(integration.status)} size="sm">
                              {getStatusLabel(integration.status)}
                            </Badge>
                            <span className={`text-xs ${getComplexityColor(integration.setupComplexity)}`}>
                              {getComplexityLabel(integration.setupComplexity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {integration.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">Fonctionnalités:</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {integration.features.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{integration.features.length - 2} autres
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleConnect(integration.id)}
                      disabled={integration.status === 'pending'}
                      className="w-full"
                      size="sm"
                    >
                      {integration.status === 'pending' ? (
                        <>
                          <Zap size={14} className="mr-2 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        <>
                          <Plus size={14} className="mr-2" />
                          Connecter
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {filteredIntegrations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune intégration trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}