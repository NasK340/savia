import React, { useState } from 'react';
import { Settings, MessageSquare, Users, TrendingUp, Database, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BusinessConfiguration } from './BusinessConfiguration';
import { KnowledgeBase } from './KnowledgeBase';
import { CustomerProfiles } from './CustomerProfiles';
import { AIFeedback } from './AIFeedback';

const configSections = [
  {
    id: 'business',
    name: 'Configuration Boutique',
    description: 'Informations générales et politiques',
    icon: Settings,
    color: 'blue'
  },
  {
    id: 'knowledge',
    name: 'Base de Connaissances',
    description: 'Modèles de réponses et FAQ',
    icon: MessageSquare,
    color: 'green'
  },
  {
    id: 'customers',
    name: 'Profils Clients',
    description: 'Historique et suivi personnalisé',
    icon: Users,
    color: 'purple'
  },
  {
    id: 'feedback',
    name: 'Feedback IA',
    description: 'Amélioration continue',
    icon: TrendingUp,
    color: 'orange'
  }
];

export function ConfigurationDashboard() {
  const [activeSection, setActiveSection] = useState('business');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'business':
        return <BusinessConfiguration />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'customers':
        return <CustomerProfiles />;
      case 'feedback':
        return <AIFeedback />;
      default:
        return <BusinessConfiguration />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: {
        active: 'bg-blue-500 text-white',
        inactive: 'bg-blue-100 text-blue-600'
      },
      green: {
        active: 'bg-green-500 text-white',
        inactive: 'bg-green-100 text-green-600'
      },
      purple: {
        active: 'bg-purple-500 text-white',
        inactive: 'bg-purple-100 text-purple-600'
      },
      orange: {
        active: 'bg-orange-500 text-white',
        inactive: 'bg-orange-100 text-orange-600'
      }
    };
    
    return colorMap[color as keyof typeof colorMap]?.[isActive ? 'active' : 'inactive'] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration IA</h1>
        <p className="text-gray-600">Configurez et optimisez votre assistant SAV automatisé</p>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {configSections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="w-full text-left"
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                  isActive 
                    ? 'ring-2 ring-blue-500 shadow-lg border-blue-200' 
                    : 'hover:shadow-md border-gray-200'
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    getColorClasses(section.color, isActive)
                  }`}>
                    <Icon size={24} />
                  </div>
                  <h3 className={`font-semibold mb-2 transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {section.name}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {isActive && (
                    <div className="mt-3 w-8 h-1 bg-blue-500 rounded-full mx-auto"></div>
                  )}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
        {renderActiveSection()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">15</div>
              <div className="text-sm text-gray-600">Modèles de réponse</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">247</div>
              <div className="text-sm text-gray-600">Profils clients</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">92%</div>
              <div className="text-sm text-gray-600">Précision IA</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}