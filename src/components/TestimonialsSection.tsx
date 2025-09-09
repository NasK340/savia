import React from 'react';
import { Star, Quote, TrendingUp, Clock, DollarSign } from 'lucide-react';

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

export function TestimonialsSection() {
  return (
    <section id="avis" className="py-20 bg-gradient-to-b from-white to-primary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star size={16} />
            <span>Témoignages clients</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-dark mb-6">
            500+ e-commerçants nous font confiance
          </h2>
          <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
            Découvrez comment Livia transforme le quotidien des équipes SAV et booste 
            la satisfaction client.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="text-primary mb-4">
                <Quote size={32} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={16} />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 font-inter leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-primary-light rounded-lg">
                {Object.entries(testimonial.metrics).map(([key, value], i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-bold text-primary">{value}</div>
                    <div className="text-xs text-gray-600 capitalize">{key}</div>
                  </div>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-poppins font-semibold text-gray-dark">
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

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-poppins font-bold text-gray-dark mb-2">
              Résultats moyens de nos clients
            </h3>
            <p className="text-gray-600 font-inter">
              Données basées sur 500+ boutiques utilisant Livia
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary" size={32} />
              </div>
              <div className="text-3xl font-poppins font-bold text-primary mb-2">+40%</div>
              <div className="text-gray-600 font-inter">Satisfaction client</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-success" size={32} />
              </div>
              <div className="text-3xl font-poppins font-bold text-success mb-2">15h</div>
              <div className="text-gray-600 font-inter">Économisées/semaine</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-purple-500" size={32} />
              </div>
              <div className="text-3xl font-poppins font-bold text-purple-500 mb-2">-70%</div>
              <div className="text-gray-600 font-inter">Coûts SAV</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-orange-500" size={32} />
              </div>
              <div className="text-3xl font-poppins font-bold text-orange-500 mb-2">4.9/5</div>
              <div className="text-gray-600 font-inter">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}