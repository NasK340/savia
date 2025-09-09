import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Brain, ThumbsUp, Zap, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

export function AIPerformance() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Performance IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="text-white animate-pulse-gentle" size={32} />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">4.7/5</div>
          <div className="text-sm text-gray-600">Note moyenne des réponses IA</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500" size={16} />
              <span className="text-sm text-gray-600">Vitesse de réponse</span>
            </div>
            <span className="text-sm font-medium text-gray-900">&lt; 30 sec</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="text-green-500" size={16} />
              <span className="text-sm text-gray-600">Taux d'approbation</span>
            </div>
            <span className="text-sm font-medium text-gray-900">94%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={16} />
              <span className="text-sm text-gray-600">Amélioration</span>
            </div>
            <span className="text-sm font-medium text-green-600">+12% ce mois</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:shadow-md transition-shadow"
          >
            💬 Donner votre avis
          </Button>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-sm font-medium text-green-900">Système actif</span>
          </div>
          <p className="text-xs text-green-700">
            L'IA traite automatiquement les nouveaux tickets
          </p>
        </div>
      </CardContent>
    </Card>
  );
}