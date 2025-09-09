import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, MessageSquare, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface ResponseTemplate {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  active: boolean;
}

const defaultTemplates: ResponseTemplate[] = [
  {
    id: '1',
    category: 'delivery',
    title: 'Retard de livraison',
    content: 'Bonjour {customerName},\n\nNous comprenons votre inquiétude concernant votre commande #{orderNumber}.\n\nVotre colis est actuellement en transit et devrait arriver d\'ici 2-3 jours ouvrés. Voici votre numéro de suivi : {trackingNumber}\n\nNous nous excusons pour ce retard et restons à votre disposition.\n\nCordialement,\nL\'équipe SAV',
    keywords: ['retard', 'livraison', 'colis', 'délai'],
    active: true
  },
  {
    id: '2',
    category: 'return',
    title: 'Demande de retour',
    content: 'Bonjour {customerName},\n\nNous avons bien reçu votre demande de retour pour la commande #{orderNumber}.\n\nSelon notre politique, les retours sont acceptés sous 30 jours. Voici la procédure :\n\n1. Imprimez l\'étiquette de retour ci-jointe\n2. Emballez l\'article dans son emballage d\'origine\n3. Déposez le colis en point relais\n\nVotre remboursement sera traité sous 5-7 jours ouvrés.\n\nCordialement,\nL\'équipe SAV',
    keywords: ['retour', 'remboursement', 'échange', 'renvoi'],
    active: true
  },
  {
    id: '3',
    category: 'product',
    title: 'Question produit',
    content: 'Bonjour {customerName},\n\nMerci pour votre question concernant {productName}.\n\n{productDetails}\n\nSi vous avez d\'autres questions, n\'hésitez pas à nous contacter.\n\nCordialement,\nL\'équipe SAV',
    keywords: ['produit', 'caractéristiques', 'taille', 'couleur', 'disponibilité'],
    active: true
  }
];

const categories = [
  { id: 'delivery', name: 'Livraison', color: 'blue' },
  { id: 'return', name: 'Retours', color: 'orange' },
  { id: 'exchange', name: 'Échanges', color: 'purple' },
  { id: 'product', name: 'Produits', color: 'green' },
  { id: 'payment', name: 'Paiement', color: 'red' },
  { id: 'complaint', name: 'Réclamations', color: 'yellow' },
  { id: 'other', name: 'Autre', color: 'gray' }
];

export function KnowledgeBase() {
  const [templates, setTemplates] = useState<ResponseTemplate[]>(defaultTemplates);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSaveTemplate = (template: ResponseTemplate) => {
    if (isCreating) {
      setTemplates([...templates, { ...template, id: Date.now().toString() }]);
      setIsCreating(false);
    } else {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    }
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const toggleTemplateActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    ));
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Base de connaissances</h2>
          <p className="text-gray-600">Gérez les modèles de réponses automatiques de votre IA</p>
        </div>
        <Button 
          onClick={() => {
            setIsCreating(true);
            setEditingTemplate({
              id: '',
              category: 'other',
              title: '',
              content: '',
              keywords: [],
              active: true
            });
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau modèle
        </Button>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes les catégories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id 
                    ? `bg-${category.color}-100 text-${category.color}-700` 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="grid gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{template.title}</h3>
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
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {template.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
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
  template: ResponseTemplate;
  categories: Array<{ id: string; name: string; color: string }>;
  onSave: (template: ResponseTemplate) => void;
  onCancel: () => void;
  isCreating: boolean;
}

function TemplateEditor({ template, categories, onSave, onCancel, isCreating }: TemplateEditorProps) {
  const [formData, setFormData] = useState(template);
  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {isCreating ? 'Créer un modèle' : 'Modifier le modèle'}
            </h3>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Titre du modèle"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Retard de livraison"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu du modèle
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Utilisez {customerName}, {orderNumber}, etc. pour la personnalisation"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{customerName}'}, {'{orderNumber}'}, {'{trackingNumber}'}, {'{productName}'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés de détection
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Ajouter un mot-clé"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword} size="sm">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:bg-blue-200 rounded"
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
              disabled={!formData.title || !formData.content}
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