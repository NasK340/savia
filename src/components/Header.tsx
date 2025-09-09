import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { useScrollTo } from '../hooks/useScrollTo';
import { SignupModal } from './modals/SignupModal';
import { LoginPage } from './auth/LoginPage';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const { scrollToSection } = useScrollTo();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setShowLoginPage(true);
  };

  const handleBackToHome = () => {
    setShowLoginPage(false);
  };

  const handleGoToSignup = () => {
    setShowLoginPage(false);
    setIsSignupOpen(true);
  };

  // Si on affiche la page de login, on cache le header normal
  if (showLoginPage) {
    return (
      <LoginPage 
        onBack={handleBackToHome}
        onSignUp={handleGoToSignup}
      />
    );
  }

  return (
    <>
      {/* Top Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Zap size={16} />
          <span>Made for Shopify & Gmail</span>
        </div>
      </div>

      {/* Main Header */}
      <header className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Livia</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavClick('fonctionnalites')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Fonctionnalités
              </button>
              <button 
                onClick={() => handleNavClick('demo')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Démo
              </button>
              <button 
                onClick={() => handleNavClick('avis')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Avis clients
              </button>
              <button 
                onClick={() => handleNavClick('faq')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                FAQ
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Se connecter
              </button>
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Essayer gratuitement
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <button 
                onClick={() => handleNavClick('fonctionnalites')}
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                Fonctionnalités
              </button>
              <button 
                onClick={() => handleNavClick('demo')}
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                Démo
              </button>
              <button 
                onClick={() => handleNavClick('avis')}
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                Avis clients
              </button>
              <button 
                onClick={() => handleNavClick('faq')}
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                FAQ
              </button>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button 
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Se connecter
                </button>
                <button 
                  onClick={() => {
                    setIsSignupOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                >
                  Essayer gratuitement
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <button 
          onClick={() => setIsSignupOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
        >
          Essayer gratuitement
        </button>
      </div>

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
}