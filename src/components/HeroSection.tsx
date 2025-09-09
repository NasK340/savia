import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle, Zap, Clock, TrendingUp } from 'lucide-react';
import { SignupModal } from './modals/SignupModal';
import { DemoModal } from './modals/DemoModal';

export function HeroSection() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-blue-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap size={16} />
                <span>IA entraînée sur +100k tickets SAV</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-gray-dark leading-tight mb-6">
                Automatisez{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  90% de votre SAV
                </span>{' '}
                avec l'IA
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 font-inter mb-8 max-w-2xl">
                Livia traite, catégorise et répond automatiquement aux emails de vos clients. 
                Zéro prise de tête, installation en 5 minutes.
              </p>

              {/* Benefits List */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={20} />
                  <span className="text-gray-600 font-inter">Réponses instantanées 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={20} />
                  <span className="text-gray-600 font-inter">Économisez 15h/semaine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={20} />
                  <span className="text-gray-600 font-inter">Satisfaction client +40%</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-inter font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  Essayer gratuitement
                  <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => setIsDemoOpen(true)}
                  className="border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-8 py-4 rounded-lg font-inter font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Voir la démo (2 min)
                </button>
              </div>

              {/* Social Proof */}
              <div className="text-sm text-gray-500 font-inter">
                <p className="mb-2">Déjà utilisé par 500+ e-commerçants</p>
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span>+500 boutiques connectées</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative animate-fade-in">
              {/* Main Dashboard Mockup */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded"></div>
                    <span className="font-semibold text-gray-dark">Dashboard Livia</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary-light p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">892</div>
                    <div className="text-sm text-gray-600">Tickets traités</div>
                  </div>
                  <div className="bg-success/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-success">90%</div>
                    <div className="text-sm text-gray-600">Automatisés</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.4h</div>
                    <div className="text-sm text-gray-600">Temps moyen</div>
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-dark">Tickets récents</h4>
                  {[
                    { status: 'resolved', text: 'Problème de livraison - Marie D.', time: '2 min' },
                    { status: 'auto', text: 'Demande de remboursement - Pierre M.', time: '5 min' },
                    { status: 'pending', text: 'Question produit - Sophie L.', time: '8 min' }
                  ].map((ticket, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          ticket.status === 'resolved' ? 'bg-success' :
                          ticket.status === 'auto' ? 'bg-primary' : 'bg-yellow-400'
                        }`}></div>
                        <span className="text-sm text-gray-700">{ticket.text}</span>
                      </div>
                      <span className="text-xs text-gray-500">{ticket.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white p-3 rounded-full shadow-lg animate-bounce-gentle">
                <CheckCircle size={24} />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white p-3 rounded-full shadow-lg animate-pulse-gentle">
                <Zap size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
}