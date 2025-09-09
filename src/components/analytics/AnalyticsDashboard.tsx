import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Mail, Clock, Target, Calendar, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('tickets');

  const timeRanges = [
    { value: '24h', label: 'Dernières 24h' },
    { value: '7d', label: '7 derniers jours' },
    { value: '30d', label: '30 derniers jours' },
    { value: '90d', label: '90 derniers jours' }
  ];

  const metrics = [
    { id: 'tickets', name: 'Tickets', icon: Mail, color: 'blue' },
    { id: 'response-time', name: 'Temps de réponse', icon: Clock, color: 'green' },
    { id: 'satisfaction', name: 'Satisfaction', icon: Target, color: 'purple' },
    { id: 'automation', name: 'Automatisation', icon: TrendingUp, color: 'orange' }
  ];

  // Mock data for charts
  const chartData = {
    tickets: [
      { date: '15/01', value: 45, aiHandled: 38 },
      { date: '16/01', value: 52, aiHandled: 44 },
      { date: '17/01', value: 38, aiHandled: 35 },
      { date: '18/01', value: 61, aiHandled: 52 },
      { date: '19/01', value: 73, aiHandled: 61 },
      { date: '20/01', value: 29, aiHandled: 25 },
      { date: '21/01', value: 18, aiHandled: 16 }
    ],
    'response-time': [
      { date: '15/01', value: 2.4 },
      { date: '16/01', value: 2.1 },
      { date: '17/01', value: 2.8 },
      { date: '18/01', value: 1.9 },
      { date: '19/01', value: 2.2 },
      { date: '20/01', value: 1.8 },
      { date: '21/01', value: 2.0 }
    ],
    satisfaction: [
      { date: '15/01', value: 4.2 },
      { date: '16/01', value: 4.5 },
      { date: '17/01', value: 4.1 },
      { date: '18/01', value: 4.7 },
      { date: '19/01', value: 4.8 },
      { date: '20/01', value: 4.6 },
      { date: '21/01', value: 4.9 }
    ],
    automation: [
      { date: '15/01', value: 84 },
      { date: '16/01', value: 85 },
      { date: '17/01', value: 92 },
      { date: '18/01', value: 85 },
      { date: '19/01', value: 84 },
      { date: '20/01', value: 86 },
      { date: '21/01', value: 89 }
    ]
  };

  const kpis = [
    {
      name: 'Tickets Total',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Mail,
      color: 'blue'
    },
    {
      name: 'Taux d\'Automatisation',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green'
    },
    {
      name: 'Temps Moyen de Réponse',
      value: '2.1h',
      change: '-15%',
      changeType: 'positive',
      icon: Clock,
      color: 'orange'
    },
    {
      name: 'Satisfaction Client',
      value: '4.6/5',
      change: '+0.3',
      changeType: 'positive',
      icon: Target,
      color: 'purple'
    }
  ];

  const topCategories = [
    { name: 'Livraison', count: 156, percentage: 35, trend: '+8%' },
    { name: 'Retours', count: 89, percentage: 20, trend: '-3%' },
    { name: 'Produits', count: 67, percentage: 15, trend: '+12%' },
    { name: 'Paiement', count: 45, percentage: 10, trend: '+5%' },
    { name: 'Autre', count: 89, percentage: 20, trend: '+2%' }
  ];

  const agentPerformance = [
    { name: 'IA Assistant', tickets: 892, avgTime: '< 1min', satisfaction: 4.7, type: 'ai' },
    { name: 'Marie Dubois', tickets: 156, avgTime: '2.4h', satisfaction: 4.5, type: 'human' },
    { name: 'Pierre Martin', tickets: 134, avgTime: '3.1h', satisfaction: 4.3, type: 'human' },
    { name: 'Sophie Laurent', tickets: 98, avgTime: '2.8h', satisfaction: 4.6, type: 'human' }
  ];

  const currentData = chartData[selectedMetric as keyof typeof chartData];
  const maxValue = Math.max(...currentData.map(d => d.value));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Analysez les performances de votre SAV</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={20} />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.name} className="hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${
                      kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>{kpi.change}</span>
                      <span className="text-gray-500 ml-1">vs période précédente</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    kpi.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    kpi.color === 'green' ? 'bg-green-100 text-green-600' :
                    kpi.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Évolution des métriques</CardTitle>
                <div className="flex gap-2">
                  {metrics.map(metric => {
                    const Icon = metric.icon;
                    return (
                      <button
                        key={metric.id}
                        onClick={() => setSelectedMetric(metric.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedMetric === metric.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={16} />
                        {metric.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.map((item, index) => (
                  <div key={item.date} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {item.date}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(item.value / maxValue) * 100}%` }}
                        />
                        {selectedMetric === 'tickets' && item.aiHandled && (
                          <div 
                            className="bg-green-500 h-full rounded-full absolute top-0 left-0 transition-all duration-500"
                            style={{ width: `${(item.aiHandled / maxValue) * 100}%` }}
                          />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right font-medium">
                        {selectedMetric === 'response-time' ? `${item.value}h` :
                         selectedMetric === 'satisfaction' ? `${item.value}/5` :
                         selectedMetric === 'automation' ? `${item.value}%` :
                         item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedMetric === 'tickets' && (
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Total tickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Traités par IA</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Catégories principales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        <span className="text-sm text-gray-600">{category.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{category.percentage}%</span>
                        <span className={`text-xs ${
                          category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Performance par agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Agent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tickets traités</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Temps moyen</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent, index) => (
                  <tr key={agent.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          agent.type === 'ai' ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'bg-gradient-to-r from-blue-500 to-green-500'
                        }`}>
                          {agent.type === 'ai' ? '🤖' : agent.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{agent.tickets}</td>
                    <td className="py-3 px-4 text-gray-600">{agent.avgTime}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{agent.satisfaction}/5</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${(agent.satisfaction / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={agent.type === 'ai' ? 'info' : 'default'} size="sm">
                        {agent.type === 'ai' ? 'IA' : 'Humain'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Insights et recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📈 Performance excellente</h4>
              <p className="text-sm text-green-700">
                Votre taux d'automatisation de 87% est supérieur à la moyenne du secteur (65%). 
                L'IA traite efficacement la majorité des demandes.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Opportunité d'amélioration</h4>
              <p className="text-sm text-blue-700">
                Les tickets de livraison représentent 35% du volume. Créer des modèles plus spécifiques 
                pourrait améliorer encore l'automatisation.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Point d'attention</h4>
              <p className="text-sm text-yellow-700">
                Le temps de réponse moyen a légèrement augmenté cette semaine. 
                Vérifiez la charge de travail de vos agents.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Objectif recommandé</h4>
              <p className="text-sm text-purple-700">
                Visez un taux d'automatisation de 90% d'ici la fin du mois en optimisant 
                les modèles de réponse existants.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}