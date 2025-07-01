import React, { useState } from 'react';
import { Heart, MessageSquare, Camera } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';
import MessageList from '../shared/MessageList';
import PopUpMessage from '../shared/PopUpMessage';

export const EnligneView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [showMessageList, setShowMessageList] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [hasClickedMessage, setHasClickedMessage] = useState(false);

  const handleRemoveConversation = (conversationId: string) => {
    setConversations(conversations.filter(conv => conv.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };
  const [filters, setFilters] = useState({
    gender: 'Je suis un/une',
    lookingFor: 'Je recherche un',
    location: 'Tous Pays',
    ageRange: [18, 80],
    hasPhoto: false
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredUsers = users.filter(user => {
    return true; // À implémenter selon les filtres
  });



  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-pink-200 bg-[#5a1d8c] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <select 
                value={filters.gender} 
                onChange={(e) => handleFilterChange({ gender: e.target.value })}
                className="bg-transparent border border-white rounded px-3 py-1"
              >
                <option value="" className="text-black">Je suis un(e)</option>
                <option value="Homme" className="text-black">Homme</option>
                <option value="Femme" className="text-black">Femme</option>
              </select>

              <select
                value={filters.lookingFor}
                onChange={(e) => handleFilterChange({ lookingFor: e.target.value })}
                className="bg-transparent border border-white rounded px-3 py-1"
              >
                <option value="" className="text-black">Je recherche un(e)</option>
                <option value="Homme" className="text-black">Homme</option>
                <option value="Femme" className="text-black">Femme</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => handleFilterChange({ location: e.target.value })}
                className="bg-transparent border border-white rounded px-3 py-1"
              >
                <option value="Tous Pays" className="text-black">Tous Pays</option>
              </select>

              <div className="flex items-center space-x-2">
                <span>Age</span>
                <input
                  type="number"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange({ ageRange: [parseInt(e.target.value), filters.ageRange[1]] })}
                  className="w-16 bg-transparent border border-white rounded px-2 py-1"
                  min="18"
                  max="80"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange({ ageRange: [filters.ageRange[0], parseInt(e.target.value)] })}
                  className="w-16 bg-transparent border border-white rounded px-2 py-1"
                  min="18"
                  max="80"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasPhoto}
                  onChange={(e) => handleFilterChange({ hasPhoto: e.target.checked })}
                  className="rounded border-white"
                />
                <span>Photo</span>
              </div>
            </div>

            <button className="bg-transparent text-white px-4 py-1 rounded hover:bg-[#3D1E06] transition-colors border:black">
              ENVOYER
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative pb-[100%]">
                <img
                  src={user.photos?.[0] || `https://i.pravatar.cc/150?img=${user.id}`}
                  alt={user.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {user.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    NOUVEAU!
                  </span>
                  )}
                 {user.isOnline && (
                   <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                 )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{user.name}</h3>
                  <span className="text-sm text-gray-500">{user.age}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{user.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button>
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        const newConversation = {
                          id: user.id,
                          name: user.name,
                          age: user.age,
                          avatar: user.photos?.[0],
                          location: user.location,
                          isOnline: user.isOnline
                        };
                        if (!conversations.find(conv => conv.id === user.id)) {
                          setConversations([...conversations, newConversation]);
                        }
                        
                        if (!hasClickedMessage) {
                          // Premier clic : ouvrir directement le PopupMessage
                          setActiveConversation(newConversation);
                          setHasClickedMessage(true);
                        } else {
                          // Clics suivants : afficher la liste des messages
                          setShowMessageList(true);
                        }
                      }}
                    >
                      <MessageSquare className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                    </button>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Camera className="w-5 h-5 text-gray-400 hover:text-purple-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Trier par:</span>
            <select className="border rounded px-3 py-1">
              <option value="pertinence">Pertinence</option>
              <option value="recent">Plus récent</option>
              <option value="age">Âge</option>
            </select>
          </div>
          <span className="text-gray-600">1 - 35 de 3993</span>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">&lt; Précédent</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#8B4513] text-white">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">3</button>
              <span className="w-8 h-8 flex items-center justify-center">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">114</button>
            </div>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Suivant &gt;</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-row items-start space-x-4">
        {activeConversation && (
          <div className="flex-shrink-0">
            <PopUpMessage
              isOpen={true}
              onClose={() => setActiveConversation(null)}
              recipientName={activeConversation.name}
              recipientAge={activeConversation.age}
              recipientPhoto={activeConversation.avatar || 'https://i.pravatar.cc/150?img=' + activeConversation.id}
              recipientLocation={activeConversation.location}
              isOnline={activeConversation.isOnline}
            />
          </div>
        )}

        {showMessageList && (
          <div className="flex-shrink-0">
            <MessageList
              conversations={conversations.map(conv => ({
                ...conv,
                avatar: conv.avatar || `https://i.pravatar.cc/150?img=${conv.id}`
              }))}
              onSelect={(conversation) => {
                setActiveConversation(conversation);
              }}
              onClose={() => setShowMessageList(false)}
              onRemove={handleRemoveConversation}
            />
          </div>
        )}
      </div>
    </div>
  );
};