import React, { useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Calendar, ShoppingBag, MessageSquare, Plus, Filter, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  registrationDate: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  ticketCount: number;
  satisfactionScore: number;
  status: 'active' | 'inactive' | 'vip';
  tags: string[];
  notes: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    registrationDate: new Date('2023-06-15'),
    lastOrderDate: new Date('2024-01-10'),
    totalOrders: 8,
    totalSpent: 567.89,
    averageOrderValue: 70.99,
    ticketCount: 3,
    satisfactionScore: 4.5,
    status: 'vip',
    tags: ['fidèle', 'mode'],
    notes: 'Cliente très satisfaite, commandes régulières'
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '+33 6 98 76 54 32',
    location: 'Lyon, France',
    registrationDate: new Date('2023-09-22'),
    lastOrderDate: new Date('2024-01-08'),
    totalOrders: 3,
    totalSpent: 234.50,
    averageOrderValue: 78.17,
    ticketCount: 2,
    satisfactionScore: 3.8,
    status: 'active',
    tags: ['électronique'],
    notes: 'Sensible aux prix, attend les promotions'
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    location: 'Marseille, France',
    registrationDate: new Date('2023-11-05'),
    lastOrderDate: new Date('2023-12-20'),
    totalOrders: 1,
    totalSpent: 45.99,
    averageOrderValue: 45.99,
    ticketCount: 1,
    satisfactionScore: 4.2,
    status: 'inactive',
    tags: ['nouveau'],
    notes: 'Premier achat, à suivre'
  }
];

export function CustomerManagement() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'vip'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'warning';
      case 'active': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'vip': return 'VIP';
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600">Gérez vos clients et leur historique</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={20} />
            Exporter
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Ajouter un client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total clients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Clients actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.vip}</div>
            <div className="text-sm text-gray-600">Clients VIP</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalRevenue.toFixed(0)}€</div>
            <div className="text-sm text-gray-600">CA total</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="vip">VIP</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Customer List */}
          <div className="space-y-4">
            {filteredCustomers.map(customer => (
              <Card 
                key={customer.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCustomer?.id === customer.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Mail size={14} />
                          {customer.email}
                        </p>
                        {customer.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {customer.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(customer.status)} size="sm">
                        {getStatusLabel(customer.status)}
                      </Badge>
                      <div className="mt-2 text-sm text-gray-600">
                        {customer.totalOrders} commandes
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.totalSpent.toFixed(2)}€
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {customer.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div>
          {selectedCustomer ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Détails du client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                  </div>

                  <div className="space-y-3">
                    {selectedCustomer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-sm">{selectedCustomer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">Inscrit le {formatDate(selectedCustomer.registrationDate)}</span>
                    </div>
                    {selectedCustomer.lastOrderDate && (
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span className="text-sm">Dernière commande: {formatDate(selectedCustomer.lastOrderDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                      <div className="text-xs text-gray-600">Commandes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{selectedCustomer.averageOrderValue.toFixed(0)}€</div>
                      <div className="text-xs text-gray-600">Panier moyen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{selectedCustomer.ticketCount}</div>
                      <div className="text-xs text-gray-600">Tickets SAV</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{selectedCustomer.satisfactionScore}/5</div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedCustomer.notes}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <MessageSquare size={16} className="mr-1" />
                      Contacter
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un client</h3>
                <p className="text-gray-600">Choisissez un client pour voir ses détails.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}