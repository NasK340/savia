import React from 'react';
import { Mail, Clock, CheckCircle, TrendingUp, Bot, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const stats = [
  {
    name: 'Tickets Total',
    value: '1,247',
    change: '+12%',
    changeType: 'positive',
    icon: Mail,
    color: 'blue',
    previousValue: '1,113'
  },
  {
    name: 'Résolus Automatiquement',
    value: '892',
    change: '+8%',
    changeType: 'positive',
    icon: Bot,
    color: 'green',
    previousValue: '826'
  },
  {
    name: 'Temps de Réponse Moyen',
    value: '2.4h',
    change: '-15%',
    changeType: 'positive',
    icon: Clock,
    color: 'orange',
    previousValue: '2.8h'
  },
  {
    name: 'Satisfaction Client',
    value: '4.8/5',
    change: '+0.2',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'purple',
    previousValue: '4.6/5'
  }
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-100 text-blue-600',
          green: 'bg-green-100 text-green-600',
          orange: 'bg-orange-100 text-orange-600',
          purple: 'bg-purple-100 text-purple-600'
        };

        return (
          <Card 
            key={stat.name} 
            className="hover:shadow-lg transition-all duration-300 animate-fade-in-up border-l-4 border-l-blue-500"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      )}
                      {stat.change}
                    </div>
                    <span className="text-xs text-gray-500">vs mois dernier</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Précédent: {stat.previousValue}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[stat.color]} transition-transform duration-300 hover:scale-110`}>
                  <Icon size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}