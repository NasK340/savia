import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AlertTriangle, Package, CreditCard, Truck } from 'lucide-react';
import { Badge } from '../ui/Badge';

const topProblems = [
  {
    category: 'Retard de livraison',
    count: 23,
    percentage: 35,
    trend: '+12%',
    icon: Truck,
    color: 'orange'
  },
  {
    category: 'Demande de remboursement',
    count: 18,
    percentage: 27,
    trend: '-5%',
    icon: CreditCard,
    color: 'red'
  },
  {
    category: 'Produit défectueux',
    count: 12,
    percentage: 18,
    trend: '+8%',
    icon: Package,
    color: 'yellow'
  }
];

export function TopProblems() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Top 3 problèmes clients cette semaine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProblems.map((problem, index) => {
            const Icon = problem.icon;
            
            return (
              <div 
                key={problem.category}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  problem.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  problem.color === 'red' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{problem.category}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm">{problem.count} tickets</Badge>
                      <span className={`text-sm font-medium ${
                        problem.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {problem.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        problem.color === 'orange' ? 'bg-orange-500' :
                        problem.color === 'red' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${problem.percentage}%`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{problem.percentage}% du total</span>
                    <span className="text-xs text-gray-500">vs semaine dernière</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900">Suggestion IA</span>
          </div>
          <p className="text-sm text-blue-700">
            Créer un modèle de réponse automatique pour les retards de livraison pourrait réduire de 40% les tickets manuels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}