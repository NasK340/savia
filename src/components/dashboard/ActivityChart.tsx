import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, Calendar, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

export function ActivityChart() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [channelFilter, setChannelFilter] = useState('all');

  // Mock data for the chart
  const data = [
    { day: 'Lun', tickets: 45, resolved: 38, aiHandled: 32 },
    { day: 'Mar', tickets: 52, resolved: 44, aiHandled: 38 },
    { day: 'Mer', tickets: 38, resolved: 35, aiHandled: 30 },
    { day: 'Jeu', tickets: 61, resolved: 52, aiHandled: 45 },
    { day: 'Ven', tickets: 73, resolved: 61, aiHandled: 52 },
    { day: 'Sam', tickets: 29, resolved: 25, aiHandled: 22 },
    { day: 'Dim', tickets: 18, resolved: 16, aiHandled: 14 }
  ];

  const maxValue = Math.max(...data.map(d => d.tickets));
  const totalTickets = data.reduce((sum, d) => sum + d.tickets, 0);
  const totalResolved = data.reduce((sum, d) => sum + d.resolved, 0);
  const resolutionRate = Math.round((totalResolved / totalTickets) * 100);

  const timeFilters = [
    { value: 'day', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  const channelFilters = [
    { value: 'all', label: 'Tous les canaux' },
    { value: 'email', label: 'Email' },
    { value: 'shopify', label: 'Shopify' },
    { value: 'manual', label: 'Manuel' }
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <CardTitle>Activité de la semaine</CardTitle>
            <div className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {resolutionRate}% de taux de résolution
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {channelFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div 
              key={item.day} 
              className="flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-8 text-sm font-medium text-gray-600">
                {item.day}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  {/* Total tickets bar */}
                  <div 
                    className="bg-blue-200 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(item.tickets / maxValue) * 100}%` }}
                  />
                  {/* Resolved tickets bar */}
                  <div 
                    className="bg-green-500 h-full rounded-full absolute top-0 left-0 transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(item.resolved / maxValue) * 100}%`,
                      animationDelay: `${index * 0.1 + 0.2}s`
                    }}
                  />
                  {/* AI handled tickets bar */}
                  <div 
                    className="bg-blue-600 h-full rounded-full absolute top-0 left-0 transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(item.aiHandled / maxValue) * 100}%`,
                      animationDelay: `${index * 0.1 + 0.4}s`
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-20 text-right font-medium">
                  {item.resolved}/{item.tickets}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Legend */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
              <span className="text-sm text-gray-600">Tickets reçus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Tickets résolus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Traités par IA</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Performance: <span className="font-medium text-green-600">{resolutionRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}