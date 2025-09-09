import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { SignupModal } from './modals/SignupModal';
import { ContactModal } from './modals/ContactModal';

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
  },
  {
    question: 'Combien de temps faut-il pour voir les résultats ?',
    answer: 'Les résultats sont immédiats ! Dès l\'installation, Livia commence à traiter vos emails. La plupart de nos clients voient une réduction de 70% de leur charge SAV dès la première semaine.'
  },
  {
    question: 'Puis-je personnaliser le ton des réponses ?',
    answer: 'Oui, vous pouvez choisir entre 3 tons : formel, amical ou neutre. Vous pouvez aussi personnaliser les modèles de réponses pour qu\'ils correspondent parfaitement à votre marque.'
  },
  {
    question: 'Y a-t-il une limite au nombre d\'emails traités ?',
    answer: 'Non, Livia peut traiter un nombre illimité d\'emails. Que vous receviez 10 ou 1000 emails par jour, l\'IA s\'adapte automatiquement à votre volume.'
  },
  {
    question: 'Que comprend l\'essai gratuit ?',
    answer: 'L\'essai gratuit de 14 jours inclut toutes les fonctionnalités : IA complète, intégrations, reporting, support. Aucune carte de crédit requise pour commencer.'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle size={16} />
              <span>Questions fréquentes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-dark mb-6">
              Tout ce que vous devez savoir
            </h2>
            <p className="text-xl text-gray-600 font-inter">
              Réponses aux questions les plus fréquentes sur Livia
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-poppins font-semibold text-gray-dark pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="text-primary flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 font-inter leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary-light to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-poppins font-bold text-gray-dark mb-4">
                Une autre question ?
              </h3>
              <p className="text-gray-600 font-inter mb-6">
                Notre équipe est là pour vous aider. Contactez-nous ou essayez gratuitement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setIsContactOpen(true)}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-inter font-medium border border-gray-200 transition-all duration-200"
                >
                  Nous contacter
                </button>
                <button 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-inter font-medium transition-all duration-200 hover:shadow-lg"
                >
                  Essayer gratuitement
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
}