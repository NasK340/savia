import React from 'react';
import { Plus, Settings, FileText, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

const actions = [
  {
    id: 'create-template',
    name: 'Créer un modèle',
    description: 'Nouveau modèle de réponse',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'setup-automation',
    name: 'Automatisation',
    description: 'Configurer une règle',
    icon: Zap,
    color: 'purple'
  },
  {
    id: 'settings',
    name: 'Paramètres',
    description: 'Configuration système',
    icon: Settings,
    color: 'gray'
  }
];

export function QuickActions() {
  const { setCurrentView } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === 'settings') {
                  setCurrentView('settings');
                } else if (action.id === 'setup-automation') {
                  setCurrentView('automations');
                } else if (action.id === 'create-template') {
                  setCurrentView('templates');
                }
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${action.color === 'blue' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' : ''}
                ${action.color === 'purple' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' : ''}
                ${action.color === 'gray' ? 'bg-gray-100 text-gray-600 group-hover:bg-gray-200' : ''}
              `}>
                <Icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{action.name}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}