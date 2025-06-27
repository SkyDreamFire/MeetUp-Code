import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';

export const CorrespondancesView: React.FC<{ onMessageUser?: (user: User) => void }> = ({ onMessageUser }) => {
  const [sortBy, setSortBy] = useState<string>('Pertinence');
  const [activeTab, setActiveTab] = useState<string>('Mes Correspondances');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPhotos, setShowPhotos] = useState(false);

  const tabs = [
    { id: 'Mes Correspondances', label: 'Mes Correspondances' },
    { id: 'Correspondances Mutuelles', label: 'Correspondances Mutuelles' },
    { id: 'Correspondances Inversées', label: 'Correspondances Inversées' },
  ];

  // Simuler des données différentes pour chaque onglet
  const matchesByTab: { [key: string]: User[] } = {
    'Mes Correspondances': mockUsers,
    'Correspondances Mutuelles': mockUsers.slice(0, 2),
    'Correspondances Inversées': mockUsers.slice(2),
  };

  const matches = matchesByTab[activeTab] || [];

  return (
    <div className="flex-1 bg-white">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 relative ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">1 - {matches.length} correspondances</span>
          <div className="flex items-center gap-4">
            <span className="text-sm">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-none bg-transparent text-sm font-medium"
            >
              <option>Pertinence</option>
              <option>Nouveaux</option>
              <option>Photos d'abord</option>
              <option>Connexion</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden border hover:shadow transition-all duration-300"
            >
              <div className="relative aspect-[3/4]">
                <img src={match.photos[0]} alt={match.name} className="w-full h-full object-cover" />
                {match.isOnline && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                )}
                {(match as User & { isNew?: boolean }).isNew && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                    NOUVEAU!
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
              <h3 className="text-center text-lg font-semibold text-gray-800">{match.name}</h3>
              <p className="text-center text-sm text-gray-600">{match.age} • {match.city}, {match.country}</p>
              <p className="text-center text-sm text-gray-500 mt-1">Cherchant: {match.interest}</p>
              <p className="text-center text-xs text-gray-400">Reçu: Il y a 3 heures</p>
              <div className="mt-4 flex justify-center space-x-4 text-gray-500 text-sm">
                <button className="hover:text-red-500"><Heart className="w-4 h-4" /></button>
                <button className="hover:text-yellow-500" onClick={() => onMessageUser && onMessageUser(match)}><span>💌</span></button>
                <button
                  className="hover:text-gray-600"
                  onClick={() => {
                    setSelectedUser(match);
                    setShowPhotos(true);
                  }}
                >
                  📷
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {showPhotos && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Photos de {selectedUser.name}</h2>
                <button
                  onClick={() => setShowPhotos(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedUser.photos.map((photo, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1} de ${selectedUser.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune correspondance</h3>
            <p className="text-gray-500 mb-4">Commencez à découvrir des profils compatibles !</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-romantic text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Découvrir maintenant
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};
