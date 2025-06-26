import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';

export const LikesView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeTab, setActiveTab] = useState('M’a liké');

  return (
    <div className="flex-1 bg-white p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 🔔 Alerte e-mail non vérifiée (facultatif) */}
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded mb-4 text-sm">
          ⚠️ Votre adresse email <strong>signalgamer87@gmail.com</strong> n’a pas été vérifiée.
          <a href="#" className="text-blue-600 underline ml-2">Veuillez cliquer ici pour vérifier.</a>
        </div>

        {/* 🟧 Tabs Onglets */}
        <div className="flex border-b border-gray-300 mb-6 space-x-6 text-sm font-medium text-gray-600">
          {['M’a liké', 'Mes Likes', 'Likes mutuels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 border-b-2 ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 👤 Grille de profils */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 relative"
            >
              {/* ✅ Photo */}
              <img
                src={user.photos?.[0] || '/placeholder.jpg'}
                alt={user.name}
                className="w-28 h-28 object-cover rounded-full mx-auto mb-3"
              />

              {/* 📋 Infos */}
              <h3 className="text-center text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-center text-sm text-gray-600">{user.age} • {user.city}, {user.country}</p>
              <p className="text-center text-sm text-gray-500 mt-1">Cherchant: {user.interest}</p>
              <p className="text-center text-xs text-gray-400">Reçu: Il y a 3 heures</p>

              {/* ❤️ Actions */}
              <div className="mt-4 flex justify-center space-x-4 text-gray-500 text-sm">
                <button className="hover:text-red-500"><Heart className="w-4 h-4" /></button>
                <button className="hover:text-yellow-500">★</button>
                <button className="hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3a2 2 0 0 0-2 2v13.5A2.5 2.5 0 0 0 5.5 21H18a1 1 0 0 0 .97-.757l2-8A1 1 0 0 0 20 11h-5.382l1.724-6.447A1 1 0 0 0 15.382 3H5z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 📄 Pagination (optionnel) */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          1 - {users.length} de 4053
        </div>
      </div>
    </div>
  );
};
