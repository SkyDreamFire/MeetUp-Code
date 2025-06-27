import React, { useState } from 'react';

export const HelpSettings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqItems = [
    {
      question: 'Comment modifier mon profil ?',
      answer: 'Pour modifier votre profil, accédez aux paramètres du profil depuis le menu principal. Vous pourrez y modifier vos photos, votre bio et vos préférences.'
    },
    {
      question: 'Comment fonctionne le système de matching ?',
      answer: 'Lorsque vous aimez le profil de quelqu\'un et que cette personne vous aime en retour, c\'est un match ! Vous pourrez alors commencer à discuter ensemble.'
    },
    {
      question: 'Comment annuler mon abonnement ?',
      answer: 'Pour annuler votre abonnement, rendez-vous dans les paramètres de facturation. Vous y trouverez l\'option pour gérer votre abonnement.'
    },
    {
      question: 'Comment bloquer un utilisateur ?',
      answer: 'Vous pouvez bloquer un utilisateur depuis son profil en cliquant sur les trois points (...) puis sur "Bloquer". L\'utilisateur ne pourra plus voir votre profil ni vous contacter.'
    },
    {
      question: 'Comment récupérer mon compte ?',
      answer: 'Si vous avez perdu l\'accès à votre compte, utilisez l\'option "Mot de passe oublié" sur la page de connexion. Un email vous sera envoyé avec les instructions.'
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Centre d'aide</h2>

      {/* Barre de recherche */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        {filteredFaq.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-8 p-4 bg-pink-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Besoin d'aide supplémentaire ?</h3>
        <p className="text-gray-600 mb-4">
          Notre équipe de support est disponible 24/7 pour vous aider.
        </p>
        <div className="space-y-2">
          <a
            href="mailto:support@meetup.com"
            className="flex items-center text-pink-600 hover:text-pink-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            support@meetup.com
          </a>
          <a
            href="tel:+33123456789"
            className="flex items-center text-pink-600 hover:text-pink-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            +33 1 23 45 67 89
          </a>
        </div>
      </div>
    </div>
  );
};