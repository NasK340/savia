import React from 'react';
import { Clock, User, Tag, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

// Mock recent tickets data
const recentTickets = [
  {
    id: '1',
    customerName: 'Marie Dubois',
    customerEmail: 'marie@example.com',
    subject: 'Problème de livraison',
    tag: 'delivery',
    status: 'open',
    priority: 'medium',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    aiHandled: false
  },
  {
    id: '2',
    customerName: 'Pierre Martin',
    customerEmail: 'pierre@example.com',
    subject: 'Demande de remboursement',
    tag: 'return',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
    aiHandled: true
  },
  {
    id: '3',
    customerName: 'Sophie Laurent',
    customerEmail: 'sophie@example.com',
    subject: 'Question sur produit',
    tag: 'order',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
    aiHandled: true
  }
];

const tagLabels = {
  delivery: 'Livraison',
  return: 'Retour',
  exchange: 'Échange',
  order: 'Commande',
  complaint: 'Réclamation',
  other: 'Autre'
};

const statusVariants = {
  open: 'danger',
  pending: 'warning',
  resolved: 'success',
  closed: 'default'
} as const;

const priorityVariants = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'danger'
} as const;

const statusIcons = {
  open: AlertCircle,
  pending: Loader,
  resolved: CheckCircle,
  closed: CheckCircle
};

export function RecentTickets() {
  const { setCurrentView } = useApp();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours === 1) return 'Il y a 1h';
    return `Il y a ${diffInHours}h`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'pending': return 'En attente';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      case 'urgent': return 'Urgent';
      default: return priority;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tickets récents</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentView('tickets')}
          className="hover:shadow-md transition-shadow"
        >
          Voir tous
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.map((ticket, index) => {
            const StatusIcon = statusIcons[ticket.status];
            
            return (
              <div 
                key={ticket.id} 
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <StatusIcon 
                    size={20} 
                    className={`${
                      ticket.status === 'resolved' ? 'text-green-500' :
                      ticket.status === 'pending' ? 'text-yellow-500' :
                      ticket.status === 'open' ? 'text-red-500' : 'text-gray-500'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{ticket.subject}</h4>
                    {ticket.aiHandled && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-gentle"></div>
                        IA
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    <span>{ticket.customerName}</span>
                    <span>•</span>
                    <Clock size={14} />
                    <span>{formatTimeAgo(ticket.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[ticket.status]} size="sm">
                    {getStatusLabel(ticket.status)}
                  </Badge>
                  <Badge variant={priorityVariants[ticket.priority]} size="sm">
                    {getPriorityLabel(ticket.priority)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">3</span> tickets nécessitent votre attention
            </div>
            <Button 
              size="sm" 
              onClick={() => setCurrentView('tickets')}
              className="hover:shadow-md transition-shadow"
            >
              Traiter les tickets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}