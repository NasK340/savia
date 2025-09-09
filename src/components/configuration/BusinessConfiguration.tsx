import React, { useState } from 'react';
import { Save, Clock, Shield, Globe, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useApp } from '../../contexts/AppContext';

const sectors = [
  { value: 'fashion', label: 'Mode et Accessoires' },
  { value: 'beauty', label: 'Beauté et Cosmétiques' },
  { value: 'electronics', label: 'Électronique' },
  { value: 'home', label: 'Maison et Jardin' },
  { value: 'sports', label: 'Sport et Loisirs' },
  { value: 'food', label: 'Alimentation' },
  { value: 'books', label: 'Livres et Médias' },
  { value: 'toys', label: 'Jouets et Enfants' },
  { value: 'automotive', label: 'Automobile' },
  { value: 'other', label: 'Autre' }
];

const tones = [
  { value: 'formal', label: 'Formel et professionnel' },
  { value: 'friendly', label: 'Amical et chaleureux' },
  { value: 'neutral', label: 'Neutre et factuel' }
];

const businessHours = [
  { value: '24/7', label: '24h/24 - 7j/7' },
  { value: '9-18', label: '9h - 18h (Lun-Ven)' },
  { value: '9-17', label: '9h - 17h (Lun-Ven)' },
  { value: '10-19', label: '10h - 19h (Lun-Sam)' },
  { value: 'custom', label: 'Horaires personnalisés' }
];

export function BusinessConfiguration() {
  const { businessInfo, setBusinessInfo } = useApp();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    shopName: businessInfo?.shopName || '',
    shopUrl: businessInfo?.shopUrl || '',
    sector: businessInfo?.sector || 'fashion',
    tonePreference: businessInfo?.tonePreference || 'friendly',
    deliveryTime: '',
    returnPolicy: businessInfo?.returnPolicy || '',
    shippingPolicy: businessInfo?.shippingPolicy || '',
    warrantyPolicy: '',
    businessHours: '9-18',
    customHours: '',
    faqUrl: '',
    termsUrl: '',
    supportEmail: '',
    supportPhone: ''
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBusinessInfo({
      ...formData,
      responseTimePreference: businessInfo?.responseTimePreference || '24'
    });
    
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuration de la boutique</h2>
        <p className="text-gray-600">Configurez les informations de votre boutique pour personnaliser les réponses IA</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom de votre boutique"
              value={formData.shopName}
              onChange={(e) => setFormData({...formData, shopName: e.target.value})}
              placeholder="Ma Belle Boutique"
              required
            />
            <Input
              label="URL de votre site web"
              value={formData.shopUrl}
              onChange={(e) => setFormData({...formData, shopUrl: e.target.value})}
              placeholder="https://ma-boutique.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Secteur d'activité"
              value={formData.sector}
              onChange={(e) => setFormData({...formData, sector: e.target.value})}
              options={sectors}
            />
            <Select
              label="Ton de réponse préféré"
              value={formData.tonePreference}
              onChange={(e) => setFormData({...formData, tonePreference: e.target.value as any})}
              options={tones}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email de support"
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
              placeholder="support@ma-boutique.com"
            />
            <Input
              label="Téléphone de support (optionnel)"
              value={formData.supportPhone}
              onChange={(e) => setFormData({...formData, supportPhone: e.target.value})}
              placeholder="+33 1 23 45 67 89"
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Politiques et conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Délai de livraison standard"
            value={formData.deliveryTime}
            onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
            placeholder="Ex: 2-3 jours ouvrés"
            helper="Délai moyen de livraison pour vos produits"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Politique de retour et remboursement
            </label>
            <textarea
              value={formData.returnPolicy}
              onChange={(e) => setFormData({...formData, returnPolicy: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Retours acceptés sous 30 jours, produit dans son état d'origine..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informations de livraison
            </label>
            <textarea
              value={formData.shippingPolicy}
              onChange={(e) => setFormData({...formData, shippingPolicy: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Livraison gratuite dès 50€, expédition sous 24h..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Politique de garantie
            </label>
            <textarea
              value={formData.warrantyPolicy}
              onChange={(e) => setFormData({...formData, warrantyPolicy: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Garantie 2 ans sur tous nos produits électroniques..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Horaires de support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Horaires d'ouverture du SAV"
            value={formData.businessHours}
            onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
            options={businessHours}
          />

          {formData.businessHours === 'custom' && (
            <Input
              label="Horaires personnalisés"
              value={formData.customHours}
              onChange={(e) => setFormData({...formData, customHours: e.target.value})}
              placeholder="Ex: Lun-Ven 8h-20h, Sam 9h-17h"
              helper="Décrivez vos horaires d'ouverture"
            />
          )}
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            Ressources externes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="URL de votre FAQ (optionnel)"
            value={formData.faqUrl}
            onChange={(e) => setFormData({...formData, faqUrl: e.target.value})}
            placeholder="https://ma-boutique.com/faq"
            helper="L'IA pourra extraire des informations de votre FAQ existante"
          />

          <Input
            label="URL de vos CGV (optionnel)"
            value={formData.termsUrl}
            onChange={(e) => setFormData({...formData, termsUrl: e.target.value})}
            placeholder="https://ma-boutique.com/cgv"
            helper="Conditions générales de vente pour référence"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={saving}
          className="flex items-center gap-2"
          size="lg"
        >
          <Save size={20} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
        </Button>
      </div>
    </div>
  );
}