import React from 'react';

export const SubscribeSettings: React.FC = () => {
  const features = [
    {
      icon: '💖',
      title: 'Likes illimités',
      description: 'Plus de limite quotidienne sur les likes'
    },
    {
      icon: '✨',
      title: 'Mode Premium',
      description: 'Apparaissez en premier dans les recherches'
    },
    {
      icon: '👀',
      title: 'Voir qui vous aime',
      description: 'Découvrez qui vous a liké avant de matcher'
    },
    {
      icon: '🎯',
      title: 'Filtres avancés',
      description: 'Affinez vos recherches avec des filtres supplémentaires'
    },
    {
      icon: '🔍',
      title: 'Mode incognito',
      description: 'Naviguez discrètement sur les profils'
    },
    {
      icon: '⭐',
      title: 'Super Likes',
      description: '5 Super Likes par jour pour vous démarquer'
    }
  ];

  const plans = [
    {
      duration: '1 mois',
      price: '29.99',
      savings: ''
    },
    {
      duration: '6 mois',
      price: '19.99',
      savings: 'Économisez 33%'
    },
    {
      duration: '12 mois',
      price: '14.99',
      savings: 'Économisez 50%'
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Passez à Premium</h2>
        <p className="text-gray-600">
          Profitez d'une expérience de rencontre optimale avec nos fonctionnalités premium
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-lg border-2 ${index === 2 ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{plan.duration}</h3>
              <p className="text-3xl font-bold text-pink-600 mb-1">{plan.price}€<span className="text-sm text-gray-500">/mois</span></p>
              {plan.savings && (
                <p className="text-green-600 font-semibold text-sm mb-4">{plan.savings}</p>
              )}
              <button
                className={`w-full py-2 px-4 rounded-md ${index === 2 
                  ? 'bg-pink-600 text-white hover:bg-pink-700' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-colors`}
              >
                Choisir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Moyens de paiement acceptés</h3>
        <div className="flex space-x-4">
          <div className="p-2 border border-gray-200 rounded">
            <img src="/visa.svg" alt="Visa" className="h-8" />
          </div>
          <div className="p-2 border border-gray-200 rounded">
            <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
          </div>
          <div className="p-2 border border-gray-200 rounded">
            <img src="/paypal.svg" alt="PayPal" className="h-8" />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Paiement 100% sécurisé 🔒</p>
        <p>Annulez à tout moment</p>
      </div>
    </div>
  );
};