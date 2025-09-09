import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ShoppingBag, Mail, Settings, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShopifyConnect } from '../shopify/ShopifyConnect';
import { useApp } from '../../contexts/AppContext';

const steps = [
  {
    id: 'shopify',
    title: 'Connecter Shopify',
    description: 'Connectez votre boutique Shopify pour accéder aux commandes et clients',
    icon: ShoppingBag,
    color: 'green'
  },
  {
    id: 'email',
    title: 'Configurer Email',
    description: 'Connectez votre email pour recevoir et envoyer des réponses automatiques',
    icon: Mail,
    color: 'blue'
  },
  {
    id: 'settings',
    title: 'Paramètres SAV',
    description: 'Configurez le ton et les politiques de votre service client',
    icon: Settings,
    color: 'purple'
  },
  {
    id: 'complete',
    title: 'Prêt !',
    description: 'Votre SAV automatisé est configuré et prêt à fonctionner',
    icon: Zap,
    color: 'orange'
  }
];

export function OnboardingFlow() {
  const { user, setCurrentView } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    // Passer à l'étape suivante
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkipOnboarding = () => {
    setCurrentView('dashboard');
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Configuration de votre SAV automatisé
            </h1>
            <button
              onClick={handleSkipOnboarding}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Passer pour l'instant
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                  ${completedSteps.includes(step.id) 
                    ? 'bg-green-600' 
                    : ''
                  }
                `}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle size={20} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Step Info */}
          <Card>
            <CardHeader>
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4
                ${currentStepData.color === 'green' ? 'bg-green-100 text-green-600' :
                  currentStepData.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  currentStepData.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }
              `}>
                <Icon size={32} />
              </div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <p className="text-gray-600">{currentStepData.description}</p>
            </CardHeader>
            
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Pourquoi connecter Shopify ?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Accès aux informations de commandes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Données clients pour personnaliser les réponses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Suivi automatique des livraisons
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Gestion des retours et remboursements
                    </li>
                  </ul>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Configuration Email</h4>
                  <p className="text-sm text-gray-600">
                    Connectez votre email professionnel pour que Livia puisse recevoir 
                    et répondre automatiquement aux demandes de vos clients.
                  </p>
                  <Button 
                    onClick={() => handleStepComplete('email')}
                    className="w-full"
                  >
                    Configurer plus tard
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Paramètres SAV</h4>
                  <p className="text-sm text-gray-600">
                    Configurez le ton de vos réponses et vos politiques de retour 
                    pour que l'IA réponde dans l'esprit de votre marque.
                  </p>
                  <Button 
                    onClick={() => handleStepComplete('settings')}
                    className="w-full"
                  >
                    Configurer plus tard
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Félicitations ! 🎉</h4>
                  <p className="text-sm text-gray-600">
                    Votre SAV automatisé est maintenant configuré. Vous pouvez commencer 
                    à recevoir et traiter automatiquement les demandes de vos clients.
                  </p>
                  <Button 
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full"
                  >
                    Accéder au Dashboard
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step Action */}
          <div>
            {currentStep === 0 && (
              <ShopifyConnect 
                onSuccess={() => handleStepComplete('shopify')}
              />
            )}

            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Cette étape sera disponible prochainement. Vous pourrez configurer 
                    votre email plus tard depuis les paramètres.
                  </p>
                  <Button 
                    onClick={() => handleStepComplete('email')}
                    variant="outline"
                    className="w-full"
                  >
                    Passer cette étape
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres SAV</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Vous pourrez configurer le ton de vos réponses et vos politiques 
                    plus tard depuis la section Configuration.
                  </p>
                  <Button 
                    onClick={() => handleStepComplete('settings')}
                    variant="outline"
                    className="w-full"
                  >
                    Passer cette étape
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-green-600" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Votre SAV est prêt !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Livia va maintenant traiter automatiquement les demandes de vos clients 
                    et vous faire gagner un temps précieux.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-blue-600">90%</div>
                      <div className="text-gray-600">Automatisation</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-green-600">15h</div>
                      <div className="text-gray-600">Économisées/sem</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}