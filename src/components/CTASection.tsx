import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Zap, Clock, Shield } from 'lucide-react';
import { SignupModal } from './modals/SignupModal';
import { DemoModal } from './modals/DemoModal';

export function CTASection() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Content */}
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-6">
              Prêt à automatiser votre SAV ?
            </h2>
            <p className="text-xl text-blue-100 font-inter mb-8 max-w-2xl mx-auto">
              Rejoignez 500+ e-commerçants qui économisent 15h par semaine 
              et améliorent leur satisfaction client avec Livia.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-3 justify-center">
              <CheckCircle className="text-green-300" size={24} />
              <span className="font-inter">Essai gratuit 14 jours</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Zap className="text-yellow-300" size={24} />
              <span className="font-inter">Installation en 5 minutes</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="text-blue-300" size={24} />
              <span className="font-inter">Aucune carte requise</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-inter font-bold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-inter font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Clock size={20} />
              Réserver une démo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-blue-100 text-sm font-inter">
            <p className="mb-2">✓ Configuration guidée incluse</p>
            <p className="mb-2">✓ Support client réactif</p>
            <p>✓ Résultats garantis ou remboursé</p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
}