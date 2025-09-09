import React from 'react';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-poppins font-bold">Livia</span>
            </div>
            <p className="text-gray-400 font-inter mb-6 leading-relaxed">
              L'IA qui révolutionne le service client e-commerce. 
              Automatisez 90% de votre SAV et concentrez-vous sur votre croissance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Produit</h4>
            <ul className="space-y-3 font-inter">
              <li><a href="#fonctionnalites" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Démo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Intégrations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sécurité</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Entreprise</h4>
            <ul className="space-y-3 font-inter">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Presse</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partenaires</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3 font-inter mb-6">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Statut système</a></li>
            </ul>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>contact@livia.ai</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={16} />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 font-inter text-sm">
              © 2024 Livia. Tous droits réservés.
            </div>
            <div className="flex gap-6 text-sm font-inter">
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
  );
}