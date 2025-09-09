import React, { useState } from 'react';
import { Mail, User, Building, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { signUp, loading } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nom requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Nom de la boutique requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      
      await signUp(formData.email, formData.password, {
        name: formData.name,
        company: formData.company,
      });
      
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ name: '', email: '', password: '', company: '', website: '' });
      }, 3000);
    } catch (error: any) {
      console.error('Erreur inscription:', error);
      setErrors({ general: error.message || 'Erreur lors de l\'inscription' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Inscription réussie !">
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bienvenue chez Livia !
          </h3>
          <p className="text-gray-600 mb-4">
            Votre compte a été créé avec succès. Vous allez être redirigé vers l'application.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">
              ✓ Essai gratuit de 14 jours activé<br />
              ✓ Aucune carte de crédit requise<br />
              ✓ Support client inclus
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Commencer gratuitement">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Créez votre compte et automatisez votre SAV en 5 minutes
          </p>
        </div>

        {/* Error message */}
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700 text-sm">{errors.general}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: undefined});
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Votre nom"
                disabled={isSubmitting || loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email professionnel *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: undefined});
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
                disabled={isSubmitting || loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if (errors.password) setErrors({...errors, password: undefined});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Minimum 6 caractères"
              disabled={isSubmitting || loading}
              minLength={6}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de votre boutique *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => {
                  setFormData({...formData, company: e.target.value});
                  if (errors.company) setErrors({...errors, company: undefined});
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.company ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ma Belle Boutique"
                disabled={isSubmitting || loading}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site web (optionnel)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ma-boutique.com"
              disabled={isSubmitting || loading}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Essai gratuit 14 jours</p>
              <p>Aucune carte de crédit requise. Annulation possible à tout moment.</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Création du compte...
            </>
          ) : (
            <>
              Créer mon compte gratuit
              <ArrowRight size={20} />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>.
        </p>
      </form>
    </Modal>
  );
}