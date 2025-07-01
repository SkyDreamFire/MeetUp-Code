import React from 'react';

import { useViewTransition } from '../../hooks/useViewTransition';

export const BillingSettings: React.FC = () => {
  const { currentView, navigateToView } = useViewTransition('settings/billing');
  const subscriptionPlans = [
    {
      name: 'Gratuit',
      price: '0€',
      features: [
        '10 likes par jour',
        'Messages limités',
        'Fonctionnalités de base'
      ],
      current: true
    },
    {
      Nom : 'Premium',
      Prix: '19.99€',
      features: [
        'Likes illimités',
        'Messages illimités',
        'Voir qui vous a liké',
        'Mode incognito',
        'Boost de profil mensuel'
      ],
      current: false
    },
    {
      name: 'VIP',
      price: '29.99€',
      features: [
        'Tous les avantages Premium',
        'Priorité dans les recherches',
        'Badge VIP exclusif',
        'Support prioritaire',
        'Boost de profil hebdomadaire'
      ],
      current: false
    }
  ];

  return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Facturation et abonnement</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg border-2 ${plan.current ? 'border-pink-500' : 'border-gray-200'}`}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-pink-600 mb-4">{plan.price}<span className="text-sm text-gray-500">/mois</span></p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 px-4 rounded-md ${plan.current 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700 transition-colors'}`}
              disabled={plan.current}
            >
              {plan.current ? 'Abonnement actuel' : 'Choisir ce plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Historique des paiements</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/01/2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Abonnement Premium</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19.99€</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Payé
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
  
  );
};