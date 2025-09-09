import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle, Clock, Mail, Bot } from 'lucide-react';
import { SignupModal } from './modals/SignupModal';

export function DemoSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const steps = [
    {
      title: 'Email reçu',
      description: 'Un client envoie un email concernant sa commande',
      content: {
        from: 'marie.dubois@email.com',
        subject: 'Problème avec ma commande #12345',
        body: 'Bonjour, je n\'ai pas reçu ma commande passée il y a une semaine. Pouvez-vous me donner des nouvelles ? Merci.'
      },
      icon: Mail,
      color: 'text-blue-500'
    },
    {
      title: 'Analyse IA',
      description: 'Livia analyse et catégorise automatiquement',
      content: {
        category: 'Livraison',
        priority: 'Moyenne',
        sentiment: 'Neutre',
        orderFound: 'Commande #12345 trouvée'
      },
      icon: Bot,
      color: 'text-purple-500'
    },
    {
      title: 'Réponse générée',
      description: 'Réponse personnalisée envoyée automatiquement',
      content: {
        to: 'marie.dubois@email.com',
        subject: 'Re: Problème avec ma commande #12345',
        body: 'Bonjour Marie,\n\nMerci pour votre message. Je comprends votre inquiétude concernant votre commande #12345.\n\nJ\'ai vérifié le statut de votre commande et elle est actuellement en transit. Vous devriez la recevoir d\'ici 2-3 jours ouvrés.\n\nVoici votre numéro de suivi : FR123456789\n\nN\'hésitez pas si vous avez d\'autres questions.\n\nCordialement,\nL\'équipe SAV'
      },
      icon: CheckCircle,
      color: 'text-green-500'
    }
  ];

  return (
    <>
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Play size={16} />
              <span>Démo interactive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-dark mb-6">
              Voyez Livia en action
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
              Découvrez comment Livia traite un ticket SAV de A à Z en moins de 30 secondes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;
                const isCompleted = activeStep > index;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive ? 'bg-primary-light border-2 border-primary' : 
                      isCompleted ? 'bg-green-50 border-2 border-green-200' : 
                      'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' :
                      isCompleted ? 'bg-success text-white' :
                      'bg-white border-2 border-gray-200'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-poppins font-semibold mb-1 ${
                        isActive ? 'text-primary' : 
                        isCompleted ? 'text-success' : 
                        'text-gray-dark'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 font-inter text-sm">
                        {step.description}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="text-success" size={20} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right - Content Display */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-poppins font-semibold text-gray-dark">
                    {steps[activeStep].title}
                  </h4>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={16} />
                      <span>De: {steps[0].content.from}</span>
                    </div>
                    <div className="font-semibold text-gray-dark">
                      {steps[0].content.subject}
                    </div>
                    <div className="text-gray-600 font-inter leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {steps[0].content.body}
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-gentle">
                        <Bot className="text-white" size={32} />
                      </div>
                      <p className="text-gray-600 font-inter">Analyse en cours...</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Catégorie</div>
                        <div className="font-semibold text-blue-600">{steps[1].content.category}</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Priorité</div>
                        <div className="font-semibold text-orange-600">{steps[1].content.priority}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Sentiment</div>
                        <div className="font-semibold text-green-600">{steps[1].content.sentiment}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Commande</div>
                        <div className="font-semibold text-purple-600">{steps[1].content.orderFound}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={16} />
                      <span>À: {steps[2].content.to}</span>
                    </div>
                    <div className="font-semibold text-gray-dark">
                      {steps[2].content.subject}
                    </div>
                    <div className="text-gray-600 font-inter leading-relaxed bg-green-50 p-4 rounded-lg whitespace-pre-line">
                      {steps[2].content.body}
                    </div>
                    <div className="flex items-center gap-2 text-success text-sm">
                      <CheckCircle size={16} />
                      <span>Email envoyé automatiquement</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-inter font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Tester gratuitement
              <ArrowRight size={20} />
            </button>
            <p className="text-gray-500 font-inter text-sm mt-3">
              Aucune carte de crédit requise • Configuration en 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
}