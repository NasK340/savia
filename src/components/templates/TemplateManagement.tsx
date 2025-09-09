import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Search, Filter, MessageSquare, Tag, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  tags: string[];
  usageCount: number;
  lastUsed?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Confirmation de commande',
    category: 'order',
    subject: 'Confirmation de votre commande #{orderNumber}',
    content: 'Bonjour {customerName},\n\nNous avons bien reçu votre commande #{orderNumber} d\'un montant de {orderAmount}€.\n\nVotre commande sera expédiée sous 24-48h à l\'adresse suivante :\n{shippingAddress}\n\nVous recevrez un email de suivi dès l\'expédition.\n\nMerci pour votre confiance !\n\nL\'équipe {shopName}',
    variables: ['customerName', 'orderNumber', 'orderAmount', 'shippingAddress', 'shopName'],
    tags: ['automatique', 'commande'],
    usageCount: 156,
    lastUsed: new Date('2024-01-15T10:30:00'),
    active: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Retard de livraison',
    category: 'delivery',
    subject: 'Mise à jour sur votre livraison - Commande #{orderNumber}',
    content: 'Bonjour {customerName},\n\nNous vous informons que votre commande #{orderNumber} subit un léger retard.\n\nNouvelle date de livraison estimée : {newDeliveryDate}\nNuméro de suivi : {trackingNumber}\n\nNous nous excusons pour ce désagrément et restons à votre disposition.\n\nCordialement,\nL\'équipe SAV',
    variables: ['customerName', 'orderNumber', 'newDeliveryDate', 'trackingNumber'],
    tags: ['livraison', 'retard'],
    usageCount: 89,
    lastUsed: new Date('2024-01-14T15:20:00'),
    active: true,
    createdAt: new Date('2023-12-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: 'Demande de retour approuvée',
    category: 'return',
    subject: 'Votre demande de retour a été approuvée',
    content: 'Bonjour {customerName},\n\nVotre demande de retour pour la commande #{orderNumber} a été approuvée.\n\nProcédure :\n1. Imprimez l\'étiquette de retour ci-jointe\n2. Emballez l\'article dans son emballage d\'origine\n3. Déposez le colis en point relais\n\nRemboursement sous 5-7 jours ouvrés après réception.\n\nCordialement,\nL\'équipe SAV',
    variables: ['customerName', 'orderNumber'],
    tags: ['retour', 'remboursement'],
    usageCount: 45,
    lastUsed: new Date('2024-01-12T09:15:00'),
    active: true,
    createdAt: new Date('2023-12-10'),
    updatedAt: new Date('2023-12-20')
  }
];

const categories = [
  { id: 'order', name: 'Commandes', color: 'blue' },
  { id: 'delivery', name: 'Livraison', color: 'green' },
  { id: 'return', name: 'Retours', color: 'orange' },
  { id: 'support', name: 'Support', color: 'purple' },
  { id: 'marketing', name: 'Marketing', color: 'pink' },
  { id: 'other', name: 'Autre', color: 'gray' }
];

export function TemplateManagement() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  const handleSaveTemplate = (template: Template) => {
    if (isCreating) {
      setTemplates([...templates, { 
        ...template, 
        id: Date.now().toString(),
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      setIsCreating(false);
    } else {
      setTemplates(templates.map(t => 
        t.id === template.id ? { ...template, updatedAt: new Date() } : t
      ));
    }
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copie)`,
      usageCount: 0,
      lastUsed: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates([...templates, newTemplate]);
  };

  const toggleTemplateActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, active: !t.active, updatedAt: new Date() } : t
    ));
  };

  const stats = {
    total: templates.length,
    active: templates.filter(t => t.active).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Modèles</h1>
          <p className="text-gray-600">Créez et gérez vos modèles d'emails</p>
        </div>
        <Button 
          onClick={() => {
            setIsCreating(true);
            setEditingTemplate({
              id: '',
              name: '',
              category: 'other',
              subject: '',
              content: '',
              variables: [],
              tags: [],
              usageCount: 0,
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau modèle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Modèles total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Modèles actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsage}</div>
            <div className="text-sm text-gray-600">Utilisations total</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Badge variant="info">
                      {getCategoryName(template.category)}
                    </Badge>
                    <button
                      onClick={() => toggleTemplateActive(template.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {template.active ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Objet: {template.subject}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {template.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.variables.map((variable, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {`{${variable}}`}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        <Tag size={10} className="inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Utilisé {template.usageCount} fois</span>
                    {template.lastUsed && (
                      <span>Dernière utilisation: {formatDate(template.lastUsed)}</span>
                    )}
                    <span>Créé le {formatDate(template.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                    title="Dupliquer"
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Editor Modal */}
      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          categories={categories}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setEditingTemplate(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </div>
  );
}

interface TemplateEditorProps {
  template: Template;
  categories: Array<{ id: string; name: string; color: string }>;
  onSave: (template: Template) => void;
  onCancel: () => void;
  isCreating: boolean;
}

function TemplateEditor({ template, categories, onSave, onCancel, isCreating }: TemplateEditorProps) {
  const [formData, setFormData] = useState(template);
  const [variableInput, setVariableInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleAddVariable = () => {
    if (variableInput.trim() && !formData.variables.includes(variableInput.trim())) {
      setFormData({
        ...formData,
        variables: [...formData.variables, variableInput.trim()]
      });
      setVariableInput('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter(v => v !== variable)
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {isCreating ? 'Créer un modèle' : 'Modifier le modèle'}
            </h3>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom du modèle"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Confirmation de commande"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Objet de l'email"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Ex: Confirmation de votre commande #{orderNumber}"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu du modèle
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contenu de votre email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variables disponibles
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={variableInput}
                  onChange={(e) => setVariableInput(e.target.value)}
                  placeholder="Nom de la variable"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVariable()}
                />
                <Button onClick={handleAddVariable} size="sm">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.variables.map((variable, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                  >
                    {`{${variable}}`}
                    <button
                      onClick={() => handleRemoveVariable(variable)}
                      className="hover:bg-blue-200 rounded"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-gray-200 rounded"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button 
              onClick={() => onSave(formData)}
              disabled={!formData.name || !formData.subject || !formData.content}
            >
              <Save size={16} className="mr-2" />
              {isCreating ? 'Créer' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}