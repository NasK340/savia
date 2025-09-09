import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Mail, Clock, User, Bot, AlertTriangle, CheckCircle, MessageSquare, Tag, Eye, Archive, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useApp } from '../../contexts/AppContext';

interface AdvancedTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  tag: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  orderNumber?: string;
  aiHandled: boolean;
  aiConfidence?: number;
  responses: number;
  lastResponse?: Date;
  assignedTo?: string;
  estimatedResolutionTime?: string;
  customerSatisfaction?: number;
  isUrgent: boolean;
  hasAttachments: boolean;
  source: 'email' | 'chat' | 'phone' | 'form';
}

const mockAdvancedTickets: AdvancedTicket[] = [
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
    responses: 0,
    isUrgent: false,
    hasAttachments: false,
    source: 'email',
    estimatedResolutionTime: '2h'
  },
  {
    id: '2',
    customerName: 'Pierre Martin',
    customerEmail: 'p.martin@email.com',
    subject: 'Demande de remboursement URGENT',
    content: 'L\'article reçu ne correspond pas à la description. Je souhaiterais un remboursement immédiat.',
    tag: 'return',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-01-14T15:20:00'),
    updatedAt: new Date('2024-01-15T09:15:00'),
    orderNumber: '12344',
    aiHandled: true,
    aiConfidence: 0.85,
    responses: 2,
    lastResponse: new Date('2024-01-15T09:15:00'),
    assignedTo: 'IA Assistant',
    isUrgent: true,
    hasAttachments: true,
    source: 'email',
    estimatedResolutionTime: '1h',
    customerSatisfaction: 4
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
    aiConfidence: 0.95,
    responses: 1,
    lastResponse: new Date('2024-01-14T16:30:00'),
    assignedTo: 'IA Assistant',
    isUrgent: false,
    hasAttachments: false,
    source: 'chat',
    estimatedResolutionTime: '30min',
    customerSatisfaction: 5
  }
];

export function AdvancedTicketManagement() {
  const [tickets, setTickets] = useState<AdvancedTicket[]>(mockAdvancedTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    const matchesTag = selectedTag === 'all' || ticket.tag === selectedTag;
    const matchesSource = selectedSource === 'all' || ticket.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTag && matchesSource;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue = a[sortBy as keyof AdvancedTicket];
    let bValue = b[sortBy as keyof AdvancedTicket];
    
    if (aValue instanceof Date) aValue = aValue.getTime();
    if (bValue instanceof Date) bValue = bValue.getTime();
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'danger';
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'danger';
      default: return 'default';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email': return <Mail size={14} />;
      case 'chat': return <MessageSquare size={14} />;
      case 'phone': return <Clock size={14} />;
      case 'form': return <User size={14} />;
      default: return <Mail size={14} />;
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on tickets:`, selectedTickets);
    // Implémentation des actions en lot
    setSelectedTickets([]);
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.isUrgent).length,
    aiHandled: tickets.filter(t => t.aiHandled).length,
    avgResponseTime: '2.4h',
    satisfactionScore: 4.6
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Avancée des Tickets</h1>
          <p className="text-gray-600">Gérez vos demandes clients avec des outils avancés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={20} />
            Filtres avancés
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Nouveau ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          <div className="text-xs text-gray-600">Ouverts</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-gray-600">En attente</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-xs text-gray-600">Résolus</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
          <div className="text-xs text-gray-600">Urgents</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.aiHandled}</div>
          <div className="text-xs text-gray-600">IA</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.avgResponseTime}</div>
          <div className="text-xs text-gray-600">Temps moy.</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-pink-600">{stats.satisfactionScore}</div>
          <div className="text-xs text-gray-600">Satisfaction</div>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
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

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="delivery">Livraison</option>
              <option value="return">Retour</option>
              <option value="order">Commande</option>
              <option value="complaint">Réclamation</option>
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes sources</option>
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="phone">Téléphone</option>
              <option value="form">Formulaire</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Plus récent</option>
              <option value="createdAt-asc">Plus ancien</option>
              <option value="priority-desc">Priorité ↓</option>
              <option value="priority-asc">Priorité ↑</option>
              <option value="status-asc">Statut A-Z</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedTickets.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedTickets.length} ticket(s) sélectionné(s)
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction('assign')}>
                    Assigner
                  </Button>
                  <Button size="sm" onClick={() => handleBulkAction('close')}>
                    Fermer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                    <Archive size={16} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedTickets([])}>
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {sortedTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTickets([...selectedTickets, ticket.id]);
                      } else {
                        setSelectedTickets(selectedTickets.filter(id => id !== ticket.id));
                      }
                    }}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                      {ticket.isUrgent && (
                        <AlertTriangle className="text-red-500 animate-pulse" size={16} />
                      )}
                      {ticket.aiHandled && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <Bot size={12} />
                          IA {ticket.aiConfidence && `(${Math.round(ticket.aiConfidence * 100)}%)`}
                        </div>
                      )}
                      {ticket.hasAttachments && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="Pièces jointes"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{ticket.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getSourceIcon(ticket.source)}
                        <span className="capitalize">{ticket.source}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                      {ticket.estimatedResolutionTime && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>ETA: {ticket.estimatedResolutionTime}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {ticket.content}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status === 'open' ? 'Ouvert' :
                         ticket.status === 'pending' ? 'En attente' :
                         ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                      </Badge>
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority === 'low' ? 'Faible' :
                         ticket.priority === 'medium' ? 'Moyen' :
                         ticket.priority === 'high' ? 'Élevé' : 'Urgent'}
                      </Badge>
                      <Badge variant="info">
                        {ticket.tag === 'delivery' ? 'Livraison' :
                         ticket.tag === 'return' ? 'Retour' :
                         ticket.tag === 'order' ? 'Commande' : 'Réclamation'}
                      </Badge>
                      {ticket.orderNumber && (
                        <Badge variant="default">#{ticket.orderNumber}</Badge>
                      )}
                      {ticket.assignedTo && (
                        <Badge variant="default">
                          <User size={12} className="mr-1" />
                          {ticket.assignedTo}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="text-sm text-gray-500">
                    {ticket.responses} réponse{ticket.responses !== 1 ? 's' : ''}
                  </div>
                  {ticket.customerSatisfaction && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Satisfaction:</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {ticket.customerSatisfaction}/5
                      </span>
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye size={16} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare size={16} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedTickets.length === 0 && (
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