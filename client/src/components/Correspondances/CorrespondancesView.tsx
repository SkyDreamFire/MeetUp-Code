import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Camera, Clock, MoreVertical, Globe, User as UserIcon } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';

export const CorrespondancesView: React.FC = () => {
  const [matches] = useState<User[]>(mockUsers);
  const [sortBy, setSortBy] = useState<string>('Pertinence');
  const [activeTab, setActiveTab] = useState<string>('Mes Correspondances');

  const tabs = [
    { id: 'mes-correspondances', label: 'Mes Correspondances' },
    { id: 'correspondances-mutuelles', label: 'Correspondances Mutuelles' },
    { id: 'correspondances-inversees', label: 'Correspondances Inversées' },
  ];

  return (
    <div className="flex-1 bg-white">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/heart.svg" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-semibold">AfroIntroductions</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="bg-green-500 text-white px-4 py-2 rounded font-medium hover:bg-green-600 transition-colors">
                Recevez de Meilleures Correspondances
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Globe className="w-6 h-6" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <UserIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.label)}
                className={`py-4 relative ${activeTab === tab.label ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
                {activeTab === tab.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">1 - 35 de 1000+</span>
          </div>
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

        {/* Matches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden border hover:shadow transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative aspect-[3/4]">
                <img
                  src={match.photos[0]}
                  alt={match.name}
                  className="w-full h-full object-cover"
                />
                
                {match.isOnline && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 rounded-full bg-green-500">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                    </div>
                  </div>
                )}
                
                {(match as User & { isNew?: boolean }).isNew && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                    NOUVEAU!
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              {/* User Info */}
              <div className="p-2 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                  <span className="font-medium">{match.name}</span>
                  <span className="text-gray-600">{match.age}</span>
                  {match.location && (
                    <span className="text-gray-600 text-xs">• {match.location}</span>
                  )}
</div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>{match.photos.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Il y a {(match as User & { lastActive?: number })?.lastActive || 0} minutes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches yet</h3>
            <p className="text-gray-500 mb-4">Start swiping to find your perfect match!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-romantic text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Start discovering
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};