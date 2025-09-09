import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, CheckCircle, Zap, Clock, TrendingUp, Star, Users, DollarSign, Bot, MessageSquare, Shield, Target, BarChart3, Settings, Menu, X } from 'lucide-react';
import { SignupModal } from '../modals/SignupModal';
import { DemoModal } from '../modals/DemoModal';
import { LoginPage } from '../auth/LoginPage';

export function LandingPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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

  // Si on affiche la page de login, on cache le reste
  if (showLoginPage) {
    return (
      <LoginPage 
        onBack={handleBackToHome}
        onSignUp={handleGoToSignup}
      />
    );
  }

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

  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'Fondatrice',
      company: 'Belle Époque Cosmétiques',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Livia a révolutionné notre SAV ! Nous économisons 20h par semaine et nos clients sont plus satisfaits. L\'IA comprend parfaitement le contexte e-commerce.',
      rating: 5,
      metrics: { time: '20h/sem', satisfaction: '+45%', automation: '92%' }
    },
    {
      name: 'Thomas Dubois',
      role: 'CEO',
      company: 'TechStyle Store',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Installation en 5 minutes, résultats immédiats. Nos clients reçoivent des réponses instantanées même la nuit. Un game-changer pour notre croissance !',
      rating: 5,
      metrics: { time: '24/7', automation: '88%', growth: '+30%' }
    },
    {
      name: 'Marie Leroy',
      role: 'Responsable SAV',
      company: 'Mode & Tendances',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Fini les emails répétitifs ! Je peux enfin me concentrer sur les cas complexes. L\'IA gère parfaitement les retours, livraisons et questions produits.',
      rating: 5,
      metrics: { automation: '90%', focus: '100%', stress: '-60%' }
    }
  ];

  const demoSteps = [
    {
      title: 'Email reçu',
      description: 'Un client envoie un email concernant sa commande',
      content: {
        from: 'marie.dubois@email.com',
        subject: 'Problème avec ma commande #12345',
        body: 'Bonjour, je n\'ai pas reçu ma commande passée il y a une semaine. Pouvez-vous me donner des nouvelles ? Merci.'
      },
      icon: MessageSquare,
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

  const problems = [
    {
      icon: Clock,
      title: 'Surcharge de travail SAV',
      description: 'Vos équipes croulent sous les emails répétitifs et perdent un temps précieux.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: DollarSign,
      title: 'Coûts élevés',
      description: 'Embaucher et former du personnel SAV coûte cher, surtout pour les pics d\'activité.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: TrendingUp,
      title: 'Temps de réponse lents',
      description: 'Vos clients attendent des heures, voire des jours avant d\'avoir une réponse.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Satisfaction client en baisse',
      description: 'Les délais et erreurs de traitement frustrent vos clients et impactent vos ventes.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  const faqs = [
    {
      question: 'Comment Livia s\'intègre-t-elle à ma boutique existante ?',
      answer: 'L\'intégration est très simple : connectez votre Gmail et votre Shopify en quelques clics. Aucune compétence technique n\'est requise. Notre équipe vous accompagne si besoin.'
    },
    {
      question: 'L\'IA peut-elle vraiment comprendre tous types de demandes ?',
      answer: 'Livia est entraînée sur plus de 100 000 tickets SAV e-commerce. Elle comprend 95% des demandes courantes : livraisons, retours, échanges, questions produits. Pour les cas complexes, elle transfère automatiquement à votre équipe.'
    },
    {
      question: 'Que se passe-t-il si l\'IA ne sait pas répondre ?',
      answer: 'Si Livia ne peut pas traiter une demande, elle envoie automatiquement un accusé de réception au client et vous notifie pour une prise en charge manuelle. Aucun client n\'est laissé sans réponse.'
    },
    {
      question: 'Mes données client sont-elles sécurisées ?',
      answer: 'Absolument. Nous respectons le RGPD et utilisons un chiffrement de niveau bancaire. Vos données ne sont jamais partagées et restent en Europe. Vous gardez le contrôle total de vos informations.'
    }
  ];

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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap size={16} />
                <span>IA entraînée sur +100k tickets SAV</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Automatisez{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  90% de votre SAV
                </span>{' '}
                avec l'IA
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Livia traite, catégorise et répond automatiquement aux emails de vos clients. 
                Zéro prise de tête, installation en 5 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-600">Réponses instantanées 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-600">Économisez 15h/semaine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-600">Satisfaction client +40%</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  Essayer gratuitement
                  <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => setIsDemoOpen(true)}
                  className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Voir la démo (2 min)
                </button>
              </div>

              <div className="text-sm text-gray-500">
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

            <div className="relative animate-fade-in">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                    <span className="font-semibold text-gray-900">Dashboard Livia</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">892</div>
                    <div className="text-sm text-gray-600">Tickets traités</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">90%</div>
                    <div className="text-sm text-gray-600">Automatisés</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.4h</div>
                    <div className="text-sm text-gray-600">Temps moyen</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Tickets récents</h4>
                  {[
                    { status: 'resolved', text: 'Problème de livraison - Marie D.', time: '2 min' },
                    { status: 'auto', text: 'Demande de remboursement - Pierre M.', time: '5 min' },
                    { status: 'pending', text: 'Question produit - Sophie L.', time: '8 min' }
                  ].map((ticket, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          ticket.status === 'resolved' ? 'bg-green-500' :
                          ticket.status === 'auto' ? 'bg-blue-500' : 'bg-yellow-400'
                        }`}></div>
                        <span className="text-sm text-gray-700">{ticket.text}</span>
                      </div>
                      <span className="text-xs text-gray-500">{ticket.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                <CheckCircle size={24} />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg animate-pulse">
                <Zap size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="problemes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Votre SAV vous fait perdre du temps et de l'argent ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comme 80% des e-commerçants, vous faites face à ces défis quotidiens qui impactent 
              votre croissance et la satisfaction de vos clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div 
                  key={index}
                  className="group p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${problem.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`${problem.color}`} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap size={16} />
              <span>Fonctionnalités clés</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Une IA qui révolutionne votre{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                service client
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment Livia transforme votre SAV en avantage concurrentiel 
              grâce à l'intelligence artificielle.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
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

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                <div className="text-gray-600">Tickets automatisés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">15h</div>
                <div className="text-gray-600">Économisées/semaine</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Disponibilité</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">5min</div>
                <div className="text-gray-600">Installation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Play size={16} />
              <span>Démo interactive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Voyez Livia en action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment Livia traite un ticket SAV de A à Z en moins de 30 secondes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {demoSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeDemo === index;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive ? 'bg-blue-50 border-2 border-blue-500' : 
                      'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => setActiveDemo(index)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-200'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        isActive ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {demoSteps[activeDemo].title}
                  </h4>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {activeDemo === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MessageSquare size={16} />
                      <span>De: {demoSteps[0].content.from}</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {demoSteps[0].content.subject}
                    </div>
                    <div className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {demoSteps[0].content.body}
                    </div>
                  </div>
                )}

                {activeDemo === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                        <Bot className="text-white" size={32} />
                      </div>
                      <p className="text-gray-600">Analyse en cours...</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Catégorie</div>
                        <div className="font-semibold text-blue-600">{demoSteps[1].content.category}</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Priorité</div>
                        <div className="font-semibold text-orange-600">{demoSteps[1].content.priority}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Sentiment</div>
                        <div className="font-semibold text-green-600">{demoSteps[1].content.sentiment}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Commande</div>
                        <div className="font-semibold text-purple-600">{demoSteps[1].content.orderFound}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDemo === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MessageSquare size={16} />
                      <span>À: {demoSteps[2].content.to}</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {demoSteps[2].content.subject}
                    </div>
                    <div className="text-gray-600 leading-relaxed bg-green-50 p-4 rounded-lg whitespace-pre-line">
                      {demoSteps[2].content.body}
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle size={16} />
                      <span>Email envoyé automatiquement</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Tester gratuitement
              <ArrowRight size={20} />
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Aucune carte de crédit requise • Configuration en 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="avis" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star size={16} />
              <span>Témoignages clients</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              500+ e-commerçants nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment Livia transforme le quotidien des équipes SAV et booste 
              la satisfaction client.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-blue-600 mb-4">
                  <MessageSquare size={32} />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-blue-50 rounded-lg">
                  {Object.entries(testimonial.metrics).map(([key, value], i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-bold text-blue-600">{value}</div>
                      <div className="text-xs text-gray-600 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Résultats moyens de nos clients
              </h3>
              <p className="text-gray-600">
                Données basées sur 500+ boutiques utilisant Livia
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-blue-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">+40%</div>
                <div className="text-gray-600">Satisfaction client</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-green-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">15h</div>
                <div className="text-gray-600">Économisées/semaine</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-purple-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">-70%</div>
                <div className="text-gray-600">Coûts SAV</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-orange-500" size={32} />
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-2">4.9/5</div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageSquare size={16} />
              <span>Questions fréquentes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Tout ce que vous devez savoir
            </h2>
            <p className="text-xl text-gray-600">
              Réponses aux questions les plus fréquentes sur Livia
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Prêt à automatiser votre SAV ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez 500+ e-commerçants qui économisent 15h par semaine 
              et améliorent leur satisfaction client avec Livia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-3 justify-center">
              <CheckCircle className="text-green-300" size={24} />
              <span>Essai gratuit 14 jours</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Zap className="text-yellow-300" size={24} />
              <span>Installation en 5 minutes</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="text-blue-300" size={24} />
              <span>Aucune carte requise</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Clock size={20} />
              Réserver une démo
            </button>
          </div>

          <div className="text-blue-100 text-sm">
            <p className="mb-2">✓ Configuration guidée incluse</p>
            <p className="mb-2">✓ Support client réactif</p>
            <p>✓ Résultats garantis ou remboursé</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-bold">Livia</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                L'IA qui révolutionne le service client e-commerce. 
                Automatisez 90% de votre SAV et concentrez-vous sur votre croissance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Produit</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Démo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Entreprise</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partenaires</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400 mb-6">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut système</a></li>
              </ul>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquare size={16} />
                  <span>contact@livia.ai</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © 2024 Livia. Tous droits réservés.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  RGPD
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <button 
          onClick={() => setIsSignupOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
        >
          Essayer gratuitement
        </button>
      </div>

      {/* Modals */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
}