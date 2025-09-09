import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, Clock, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

// Enhanced mock data
const mockTickets = [
  {
    id: '1',
    customerName: 'Marie Dubois',
    customerEmail: 'marie.dubois@email.com',
    subject: 'Problème avec ma commande #12345',
    content: 'Bonjour, je n\'ai pas reçu ma commande passée il y a une semaine. Pouvez-vous me donner des nouvelles ?',
    tag: 'delivery',
    status: 'open',
    priority: 'medium',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    orderNumber: '12345',
    aiHandled: false,
    responses: 0
  },
  {
    id: '2',
    customerName: 'Pierre Martin',
    customerEmail: 'p.martin@email.com',
    subject: 'Demande de remboursement pour article défectueux',
    content: 'L\'article reçu ne correspond pas à la description. Je souhaiterais un remboursement.',
    tag: 'return',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-01-14T15:20:00'),
    updatedAt: new Date('2024-01-15T09:15:00'),
    orderNumber: '12344',
    aiHandled: true,
    responses: 2
  },
  {
    id: '3',
    customerName: 'Sophie Laurent',
    customerEmail: 'sophie.l@email.com',
    subject: 'Question sur la disponibilité d\'un produit',
    content: 'Le produit XYZ est-il toujours disponible ? Je ne le trouve plus sur votre site.',
    tag: 'order',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date('2024-01-13T11:45:00'),
    updatedAt: new Date('2024-01-14T16:30:00'),
    aiHandled: true,
    responses: 1
  },
  {
    id: '4',
    customerName: 'Thomas Bernard',
    customerEmail: 'thomas.b@email.com',
    subject: 'Problème de paiement lors de la commande',  
    content: 'Ma carte a été débitée mais je n\'ai pas reçu de confirmation de commande.',
    tag: 'complaint',
    status: 'open',
    priority: 'urgent',
    createdAt: new Date('2024-01-15T08:15:00'),
    updatedAt: new Date('2024-01-15T08:15:00'),
    aiHandled: false,
    responses: 0
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

const statusLabels = {
  open: 'Ouvert',
  pending: 'En attente',
  resolved: 'Résolu',
  closed: 'Fermé'
};

const priorityLabels = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  urgent: 'Urgent'
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

export function TicketList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tickets</h1>
          <p className="text-gray-600">Gérez vos demandes clients et leur suivi</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Nouveau ticket
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Rechercher par sujet, client ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="open">Ouvert</option>
                <option value="pending">En attente</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Fermé</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes priorités</option>
                <option value="urgent">Urgent</option>
                <option value="high">Élevé</option>
                <option value="medium">Moyen</option>
                <option value="low">Faible</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                    {ticket.aiHandled && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        IA
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{ticket.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{ticket.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {ticket.content}
                  </p>

                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariants[ticket.status]}>
                      {statusLabels[ticket.status]}
                    </Badge>
                    <Badge variant={priorityVariants[ticket.priority]}>
                      {priorityLabels[ticket.priority]}
                    </Badge>
                    <Badge variant="info">
                      {tagLabels[ticket.tag]}
                    </Badge>
                    {ticket.orderNumber && (
                      <Badge variant="default">
                        #{ticket.orderNumber}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="text-sm text-gray-500">
                    {ticket.responses} réponse{ticket.responses !== 1 ? 's' : ''}
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ticket trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}