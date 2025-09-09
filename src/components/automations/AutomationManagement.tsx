import React, { useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, Zap, Clock, Filter, Target, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'keyword' | 'category' | 'priority' | 'time' | 'customer';
    conditions: string[];
  };
  actions: {
    type: 'auto_reply' | 'assign' | 'tag' | 'escalate' | 'notify';
    parameters: Record<string, any>;
  }[];
  active: boolean;
  executionCount: number;
  successRate: number;
  lastExecuted?: Date;
  createdAt: Date;
}

const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Réponse automatique - Retard livraison',
    description: 'Répond automatiquement aux demandes concernant les retards de livraison',
    trigger: {
      type: 'keyword',
      conditions: ['retard', 'livraison', 'délai', 'colis']
    },
    actions: [
      {
        type: 'auto_reply',
        parameters: { templateId: 'delivery-delay', priority: 'medium' }
      },
      {
        type: 'tag',
        parameters: { tags: ['livraison', 'automatique'] }
      }
    ],
    active: true,
    executionCount: 156,
    successRate: 94,
    lastExecuted: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2023-12-01')
  },
  {
    id: '2',
    name: 'Escalade - Réclamations urgentes',
    description: 'Transfère automatiquement les réclamations urgentes vers un agent humain',
    trigger: {
      type: 'keyword',
      conditions: ['inacceptable', 'scandaleux', 'avocat', 'remboursement immédiat']
    },
    actions: [
      {
        type: 'escalate',
        parameters: { assignTo: 'manager', priority: 'urgent' }
      },
      {
        type: 'notify',
        parameters: { recipients: ['manager@boutique.com'], message: 'Réclamation urgente détectée' }
      }
    ],
    active: true,
    executionCount: 23,
    successRate: 100,
    lastExecuted: new Date('2024-01-14T15:20:00'),
    createdAt: new Date('2023-12-05')
  },
  {
    id: '3',
    name: 'Suivi automatique - Commandes VIP',
    description: 'Envoie un suivi personnalisé pour les clients VIP',
    trigger: {
      type: 'customer',
      conditions: ['vip', 'premium']
    },
    actions: [
      {
        type: 'auto_reply',
        parameters: { templateId: 'vip-followup', delay: '24h' }
      },
      {
        type: 'assign',
        parameters: { agent: 'senior-agent' }
      }
    ],
    active: false,
    executionCount: 45,
    successRate: 89,
    lastExecuted: new Date('2024-01-12T09:15:00'),
    createdAt: new Date('2023-12-10')
  }
];

const triggerTypes = [
  { id: 'keyword', name: 'Mots-clés', icon: Target },
  { id: 'category', name: 'Catégorie', icon: Filter },
  { id: 'priority', name: 'Priorité', icon: Zap },
  { id: 'time', name: 'Temps', icon: Clock },
  { id: 'customer', name: 'Type de client', icon: Target }
];

const actionTypes = [
  { id: 'auto_reply', name: 'Réponse automatique', color: 'blue' },
  { id: 'assign', name: 'Assigner', color: 'green' },
  { id: 'tag', name: 'Ajouter tag', color: 'purple' },
  { id: 'escalate', name: 'Escalader', color: 'orange' },
  { id: 'notify', name: 'Notifier', color: 'red' }
];

export function AutomationManagement() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && rule.active) ||
                         (statusFilter === 'inactive' && !rule.active);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTriggerTypeName = (type: string) => {
    const triggerType = triggerTypes.find(t => t.id === type);
    return triggerType?.name || type;
  };

  const getActionTypeName = (type: string) => {
    const actionType = actionTypes.find(a => a.id === type);
    return actionType?.name || type;
  };

  const getActionTypeColor = (type: string) => {
    const actionType = actionTypes.find(a => a.id === type);
    return actionType?.color || 'gray';
  };

  const toggleRuleActive = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const stats = {
    total: rules.length,
    active: rules.filter(r => r.active).length,
    totalExecutions: rules.reduce((sum, r) => sum + r.executionCount, 0),
    avgSuccessRate: Math.round(rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automatisations</h1>
          <p className="text-gray-600">Configurez des règles d'automatisation pour votre SAV</p>
        </div>
        <Button 
          onClick={() => {
            setIsCreating(true);
            setEditingRule({
              id: '',
              name: '',
              description: '',
              trigger: { type: 'keyword', conditions: [] },
              actions: [],
              active: true,
              executionCount: 0,
              successRate: 0,
              createdAt: new Date()
            });
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle règle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Règles total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Règles actives</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalExecutions}</div>
            <div className="text-sm text-gray-600">Exécutions total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.avgSuccessRate}%</div>
            <div className="text-sm text-gray-600">Taux de succès</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Rechercher une règle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les règles</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map(rule => (
          <Card key={rule.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <button
                      onClick={() => toggleRuleActive(rule.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {rule.active ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{rule.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Déclencheur:</span>
                      <Badge variant="info" size="sm">
                        {getTriggerTypeName(rule.trigger.type)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {rule.trigger.conditions.slice(0, 3).join(', ')}
                        {rule.trigger.conditions.length > 3 && '...'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Actions:</span>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions.map((action, index) => (
                          <Badge 
                            key={index} 
                            variant={getActionTypeColor(action.type) as any}
                            size="sm"
                          >
                            {getActionTypeName(action.type)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Exécuté {rule.executionCount} fois</span>
                    <span>Succès: {rule.successRate}%</span>
                    {rule.lastExecuted && (
                      <span>Dernière exécution: {formatDate(rule.lastExecuted)}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRuleActive(rule.id)}
                    title={rule.active ? 'Désactiver' : 'Activer'}
                  >
                    {rule.active ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingRule(rule)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Setup Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Modèles de règles rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">Réponse automatique FAQ</h4>
              <p className="text-sm text-gray-600 mb-3">
                Répond automatiquement aux questions fréquentes avec des modèles prédéfinis.
              </p>
              <Button variant="outline" size="sm">Utiliser ce modèle</Button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">Escalade priorité haute</h4>
              <p className="text-sm text-gray-600 mb-3">
                Transfère automatiquement les tickets urgents vers un agent senior.
              </p>
              <Button variant="outline" size="sm">Utiliser ce modèle</Button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">Suivi commande automatique</h4>
              <p className="text-sm text-gray-600 mb-3">
                Envoie automatiquement les informations de suivi de commande.
              </p>
              <Button variant="outline" size="sm">Utiliser ce modèle</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            Insights de performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🎯 Règle la plus efficace</h4>
              <p className="text-sm text-green-700 mb-2">
                "Escalade - Réclamations urgentes" avec 100% de taux de succès
              </p>
              <p className="text-xs text-green-600">23 exécutions cette semaine</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📈 Opportunité d'optimisation</h4>
              <p className="text-sm text-blue-700 mb-2">
                Créer une règle pour les demandes de retour pourrait automatiser 15% de tickets supplémentaires
              </p>
              <Button variant="outline" size="sm" className="mt-2">Créer la règle</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}