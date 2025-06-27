import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { User } from '../../types';

export const LikesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('M’a liké');
  const [users, setUsers] = useState<User[]>([]);

  // 👤 Données simulées respectant l'interface User
  const mockLikesMe: User[] = [
    {
      id: '1',
      name: 'Alice',
      age: 25,
      bio: 'Aime la lecture et les voyages.',
      location: 'Paris',
      city: 'Paris',
      country: 'France',
       photos: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
      isPremium: true,
      isOnline: true,
      lastActive: 2,
      lookingFor: 'Relation sérieuse',
      interests: ['Lecture', 'Voyage'],
      gender: 'female'
    },
    {
      id: '2',
      name: 'Fatou',
      age: 28,
      bio: 'Passionnée par la musique africaine.',
      location: 'Dakar',
      city: 'Dakar',
      country: 'Sénégal',
      photos: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
      isPremium: false,
      isOnline: false,
      lastActive: 5,
      lookingFor: 'Amitié',
      interests: ['Musique', 'Danse'],
      gender: 'female'
    }
  ];

  const mockMyLikes: User[] = [
    {
      id: '3',
      name: 'Nina',
      age: 30,
      bio: 'Professionnelle ambitieuse et douce.',
      location: 'Abidjan',
      city: 'Abidjan',
      country: 'Côte d’Ivoire',
     photos: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
      isPremium: false,
      isOnline: true,
      lastActive: 1,
      lookingFor: 'Mariage',
      interests: ['Entrepreneuriat', 'Sport'],
      gender: 'female'
    }
  ];

  const mockMutualLikes: User[] = [
    {
      id: '4',
      name: 'Awa',
      age: 26,
      bio: 'Curieuse, drôle et gentille.',
      location: 'Bamako',
      city: 'Bamako',
      country: 'Mali',
       photos: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
      isPremium: true,
      isOnline: false,
      lastActive: 12,
      lookingFor: 'Relation sérieuse',
      interests: ['Lecture', 'Cuisine'],
      gender: 'female'
    }
  ];

  // 🔁 Met à jour users selon le tab
  useEffect(() => {
    switch (activeTab) {
      case 'M’a liké':
        setUsers(mockLikesMe);
        break;
      case 'Mes Likes':
        setUsers(mockMyLikes);
        break;
      case 'Likes mutuels':
        setUsers(mockMutualLikes);
        break;
      default:
        setUsers([]);
    }
  }, [activeTab]);

  return (
    <div className="flex-1 bg-white p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Alerte email */}
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded mb-4 text-sm">
          ⚠️ Votre adresse email <strong>signalgamer87@gmail.com</strong> n’a pas été vérifiée.
          <a href="#" className="text-blue-600 underline ml-2">Veuillez cliquer ici pour vérifier.</a>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6 space-x-6 text-sm font-medium text-gray-600">
          {['M’a liké', 'Mes Likes', 'Likes mutuels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grille utilisateurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 relative"
            >
              <img
                src={user.photos?.[0] || '/placeholder.jpg'}
                alt={user.name}
                className="w-28 h-28 object-cover rounded-full mx-auto mb-3"
              />
              <h3 className="text-center text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-center text-sm text-gray-600">
                {user.age} • {user.city}, {user.country}
              </p>
              <p className="text-center text-sm text-gray-500 mt-1">
                {user.lookingFor}
              </p>
              <p className="text-center text-xs text-gray-400">
                {user.isOnline ? 'En ligne' : `Actif il y a ${user.lastActive}h`}
              </p>

              <div className="mt-2 text-xs text-center text-gray-500 italic px-2">
                {user.bio}
              </div>

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

        {/* Pagination */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          1 - {users.length} affichés
        </div>
      </div>
    </div>
  );
};
