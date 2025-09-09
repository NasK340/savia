import React, { useState } from 'react';
import { Play, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({ name: '', email: '', company: '' });
      setSelectedTime('');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Démo programmée !">
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Rendez-vous confirmé !
          </h3>
          <p className="text-gray-600 mb-4">
            Votre démo est programmée pour demain à {selectedTime}. Vous recevrez un email de confirmation avec le lien de la réunion.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              ✓ Lien Zoom envoyé par email<br />
              ✓ Rappel 1h avant la démo<br />
              ✓ Durée : 30 minutes maximum
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réserver une démo personnalisée" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Play className="text-primary" size={24} />
            <span className="text-lg font-semibold text-gray-900">Démo en direct - 30 minutes</span>
          </div>
          <p className="text-gray-600">
            Découvrez comment Livia peut automatiser votre SAV et économiser 15h par semaine
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Vos informations</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boutique
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ma Belle Boutique"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Choisir un créneau</h4>
            <p className="text-sm text-gray-600">Demain - {new Date(Date.now() + 86400000).toLocaleDateString('fr-FR')}</p>
            
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-blue-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-2">Ce que vous verrez :</h5>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✓ Configuration en 5 minutes chrono</li>
            <li>✓ IA traitant vos vrais emails SAV</li>
            <li>✓ Dashboard avec vos métriques</li>
            <li>✓ ROI calculé pour votre boutique</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedTime}
          className="w-full bg-primary hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Programmation...
            </>
          ) : (
            <>
              <Calendar size={20} />
              Réserver ma démo gratuite
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}