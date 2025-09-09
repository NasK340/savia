import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface FeedbackItem {
  id: string;
  ticketId: string;
  customerEmail: string;
  aiResponse: string;
  userFeedback: 'positive' | 'negative';
  userComment: string;
  category: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'implemented';
  improvement: string;
}

const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    ticketId: 'T001',
    customerEmail: 'marie@example.com',
    aiResponse: 'Votre commande sera livrée sous 2-3 jours ouvrés.',
    userFeedback: 'negative',
    userComment: 'La réponse était trop générique, il fallait mentionner le retard spécifique.',
    category: 'delivery',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'pending',
    improvement: 'Ajouter la vérification du statut de livraison avant de répondre'
  },
  {
    id: '2',
    ticketId: 'T002',
    customerEmail: 'pierre@example.com',
    aiResponse: 'Nous avons bien reçu votre demande de retour. Voici la procédure...',
    userFeedback: 'positive',
    userComment: 'Parfait, réponse complète et précise.',
    category: 'return',
    timestamp: new Date('2024-01-14T15:20:00'),
    status: 'reviewed',
    improvement: ''
  }
];

export function AIFeedback() {
  const [feedback] = useState<FeedbackItem[]>(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'pending'>('all');

  const filteredFeedback = feedback.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.status === 'pending';
    return item.userFeedback === filter;
  });

  const stats = {
    total: feedback.length,
    positive: feedback.filter(f => f.userFeedback === 'positive').length,
    negative: feedback.filter(f => f.userFeedback === 'negative').length,
    pending: feedback.filter(f => f.status === 'pending').length
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'implemented': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'reviewed': return 'Examiné';
      case 'implemented': return 'Implémenté';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Feedback et amélioration IA</h2>
        <p className="text-gray-600">Analysez les retours pour améliorer les performances de l'IA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total feedback</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
            <div className="text-sm text-gray-600">Positifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
            <div className="text-sm text-gray-600">Négatifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('positive')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Positifs
            </button>
            <button
              onClick={() => setFilter('negative')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Négatifs
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.map(item => (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-all ${
                selectedFeedback?.id === item.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedFeedback(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {item.userFeedback === 'positive' ? (
                      <ThumbsUp className="text-green-500" size={16} />
                    ) : (
                      <ThumbsDown className="text-red-500" size={16} />
                    )}
                    <span className="font-medium text-gray-900">Ticket {item.ticketId}</span>
                  </div>
                  <Badge variant={getStatusColor(item.status)} size="sm">
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{item.customerEmail}</p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{item.userComment}</p>
                <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feedback Details */}
        <div>
          {selectedFeedback ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedFeedback.userFeedback === 'positive' ? (
                    <ThumbsUp className="text-green-500" size={20} />
                  ) : (
                    <ThumbsDown className="text-red-500" size={20} />
                  )}
                  Détails du feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Réponse IA originale</h4>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">{selectedFeedback.aiResponse}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Commentaire utilisateur</h4>
                  <div className={`p-3 border rounded-lg ${
                    selectedFeedback.userFeedback === 'positive' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      selectedFeedback.userFeedback === 'positive' 
                        ? 'text-green-900' 
                        : 'text-red-900'
                    }`}>
                      {selectedFeedback.userComment}
                    </p>
                  </div>
                </div>

                {selectedFeedback.improvement && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Amélioration suggérée</h4>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-900">{selectedFeedback.improvement}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Catégorie: {selectedFeedback.category}</p>
                    <p className="text-sm text-gray-600">Date: {formatDate(selectedFeedback.timestamp)}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedFeedback.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm">
                          <AlertCircle size={16} className="mr-1" />
                          Marquer comme examiné
                        </Button>
                        <Button size="sm">
                          <CheckCircle size={16} className="mr-1" />
                          Implémenter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un feedback</h3>
                <p className="text-gray-600">Choisissez un feedback dans la liste pour voir les détails.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Suggestions d'amélioration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Améliorer la détection des retards de livraison</h4>
              <p className="text-sm text-purple-700">
                L'IA devrait vérifier le statut de livraison avant de donner des délais génériques.
              </p>
              <div className="flex justify-between items-center mt-3">
                <Badge variant="warning" size="sm">Priorité élevée</Badge>
                <Button variant="outline" size="sm">Implémenter</Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Personnaliser les réponses de retour</h4>
              <p className="text-sm text-blue-700">
                Adapter les modèles de réponse selon l'historique client et le type de produit.
              </p>
              <div className="flex justify-between items-center mt-3">
                <Badge variant="info" size="sm">Priorité moyenne</Badge>
                <Button variant="outline" size="sm">Planifier</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}