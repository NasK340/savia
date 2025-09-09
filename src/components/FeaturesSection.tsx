import React from 'react';
import { Bot, Zap, MessageSquare, BarChart3, Settings, Shield, Clock, Target } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'IA Spécialisée E-commerce',
    description: 'Notre IA comprend le contexte e-commerce : commandes, livraisons, retours, SAV.',
    benefits: ['Entraînée sur +100k tickets', 'Comprend 15+ langues', 'Mise à jour continue']
  },
  {
    icon: Zap,
    title: 'Réponses Automatiques Instantanées',
    description: 'Réponses en moins de 30 secondes, 24h/24 et 7j/7, même pendant vos vacances.',
    benefits: ['Réponse en <30 secondes', 'Disponible 24/7', 'Aucune interruption']
  },
  {
    icon: MessageSquare,
    title: 'Ton Personnalisé',
    description: 'L\'IA s\'adapte au ton de votre marque : formel, amical ou neutre selon vos préférences.',
    benefits: ['3 tons disponibles', 'Personnalisation avancée', 'Cohérence garantie']
  },
  {
    icon: Target,
    title: 'Catégorisation Intelligente',
    description: 'Chaque email est automatiquement classé : retour, livraison, commande, réclamation.',
    benefits: ['Classification automatique', '15+ catégories', 'Précision 95%+']
  },
  {
    icon: BarChart3,
    title: 'Reporting Avancé',
    description: 'Tableaux de bord complets pour suivre vos performances SAV et identifier les tendances.',
    benefits: ['Analytics en temps réel', 'Rapports personnalisés', 'Insights actionables']
  },
  {
    icon: Settings,
    title: 'Installation Plug & Play',
    description: 'Connectez Gmail et Shopify en 5 minutes. Aucune compétence technique requise.',
    benefits: ['Setup en 5 minutes', 'Intégration native', 'Support inclus']
  }
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 bg-gradient-to-b from-primary-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={16} />
            <span>Fonctionnalités clés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-dark mb-6">
            Une IA qui révolutionne votre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              service client
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
            Découvrez comment Livia transforme votre SAV en avantage concurrentiel 
            grâce à l'intelligence artificielle.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-inter mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-poppins font-bold text-primary mb-2">90%</div>
              <div className="text-gray-600 font-inter">Tickets automatisés</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-bold text-success mb-2">15h</div>
              <div className="text-gray-600 font-inter">Économisées/semaine</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 font-inter">Disponibilité</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-bold text-orange-500 mb-2">5min</div>
              <div className="text-gray-600 font-inter">Installation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}