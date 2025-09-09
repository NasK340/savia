import React, { useState } from 'react';
import { Search, User, Mail, Clock, Tag, MessageSquare, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  totalTickets: number;
  lastContact: Date;
  commonTopics: string[];
  satisfactionScore: number;
  orderHistory: Array<{
    orderNumber: string;
    date: Date;
    amount: number;
    status: string;
  }>;
  ticketHistory: Array<{
    id: string;
    subject: string;
    category: string;
    status: string;
    createdAt: Date;
    aiHandled: boolean;
  }>;
  notes: string;
}

const mockCustomers: CustomerProfile[] = [
  {
    id: '1',
    email: 'marie.dubois@email.com',
    name: 'Marie Dubois',
    totalTickets: 5,
    lastContact: new Date('2024-01-15T10:30:00'),
    commonTopics: ['livraison', 'retour'],
    satisfactionScore: 4.2,
    orderHistory: [
      { orderNumber: '12345', date: new Date('2024-01-10'), amount: 89.99, status: 'delivered' },
      { orderNumber: '12340', date: new Date('2023-12-15'), amount: 45.50, status: 'delivered' }
    ],
    ticketHistory: [
      {
        id: 't1',
        subject: 'Problème avec ma commande #12345',
        category: 'delivery',
        status: 'resolved',
        createdAt: new Date('2024-01-15T10:30:00'),
        aiHandled: true
      }
    ],
    notes: 'Cliente fidèle, préfère les échanges rapides'
  },
  {
    id: '2',
    email: 'pierre.martin@email.com',
    name: 'Pierre Martin',
    totalTickets: 3,
    lastContact: new Date('2024-01-14T15:20:00'),
    commonTopics: ['retour', 'remboursement'],
    satisfactionScore: 3.8,
    orderHistory: [
      { orderNumber: '12344', date: new Date('2024-01-08'), amount: 129.99, status: 'returned' }
    ],
    ticketHistory: [
      {
        id: 't2',
        subject: 'Demande de remboursement',
        category: 'return',
        status: 'pending',
        createdAt: new Date('2024-01-14T15:20:00'),
        aiHandled: false
      }
    ],
    notes: 'Attention particulière requise pour les retours'
  }
];

export function CustomerProfiles() {
  const [customers] = useState<CustomerProfile[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case 'delivered': return 'success';
      case 'returned': return 'warning';
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'open': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'returned': return 'Retourné';
      case 'pending': return 'En attente';
      case 'resolved': return 'Résolu';
      case 'open': return 'Ouvert';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profils clients</h2>
        <p className="text-gray-600">Historique et suivi personnalisé de vos clients</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCustomers.map(customer => (
              <Card 
                key={customer.id} 
                className={`cursor-pointer transition-all ${
                  selectedCustomer?.id === customer.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{customer.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="info" size="sm">{customer.totalTickets} tickets</Badge>
                        <span className="text-xs text-gray-400">
                          {formatDate(customer.lastContact)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="space-y-6">
              {/* Customer Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Mail size={16} />
                          {selectedCustomer.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={14} />
                          Dernier contact: {formatDate(selectedCustomer.lastContact)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare size={16} className="mr-2" />
                      Envoyer un email
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalTickets}</div>
                      <div className="text-sm text-gray-600">Tickets total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedCustomer.satisfactionScore}/5</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedCustomer.orderHistory.length}</div>
                      <div className="text-sm text-gray-600">Commandes</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sujets récurrents</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.commonTopics.map((topic, index) => (
                        <Badge key={index} variant="info" size="sm">
                          <Tag size={12} className="mr-1" />
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle>Historique des commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCustomer.orderHistory.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{order.amount}€</div>
                          <Badge variant={getStatusColor(order.status)} size="sm">
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ticket History */}
              <Card>
                <CardHeader>
                  <CardTitle>Historique des tickets SAV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCustomer.ticketHistory.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{ticket.subject}</div>
                          <div className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.aiHandled && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Traité par IA" />
                          )}
                          <Badge variant={getStatusColor(ticket.status)} size="sm">
                            {getStatusLabel(ticket.status)}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <ExternalLink size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes internes</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={selectedCustomer.notes}
                    readOnly
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button variant="outline" size="sm" className="mt-2">
                    Modifier les notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un client</h3>
                <p className="text-gray-600">Choisissez un client dans la liste pour voir son profil détaillé.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}