import React from 'react';
import { Clock, DollarSign, AlertTriangle, Users, TrendingDown, Headphones } from 'lucide-react';

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
    icon: AlertTriangle,
    title: 'Erreurs humaines',
    description: 'Réponses incohérentes, oublis, informations erronées qui nuisent à votre image.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: TrendingDown,
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
  },
  {
    icon: Headphones,
    title: 'Disponibilité limitée',
    description: 'Votre SAV n\'est disponible qu\'aux heures de bureau, mais vos clients ont besoin d\'aide 24/7.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50'
  }
];

export function ProblemsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-dark mb-6">
            Votre SAV vous fait perdre du temps et de l'argent ?
          </h2>
          <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
            Comme 80% des e-commerçants, vous faites face à ces défis quotidiens qui impactent 
            votre croissance et la satisfaction de vos clients.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div 
                key={index}
                className="group p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${problem.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`${problem.color}`} size={24} />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600 font-inter leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-light to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-poppins font-bold text-gray-dark mb-4">
              Il est temps de passer à l'automatisation intelligente
            </h3>
            <p className="text-gray-600 font-inter mb-6 max-w-2xl mx-auto">
              Livia résout tous ces problèmes en automatisant 90% de votre SAV avec une IA 
              spécialement entraînée pour l'e-commerce.
            </p>
            <button className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-inter font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105">
              Découvrir la solution
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}