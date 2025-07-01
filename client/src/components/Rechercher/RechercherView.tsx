import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, ChevronDown, Filter, X } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { mockSavedSearches, mockPopularSearches } from '../../data/savedSearches';
import { User, SearchFilters } from '../../types';
import { searchUsers } from '../../utils/searchUtils';

export const RechercherView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('advanced');
  const [activeLocationTab, setActiveLocationTab] = useState('single');
  const [allUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    gender: 'Homme',
    seeking: 'Femme',
    ageFrom: '19',
    ageTo: '35',
    connection: 'Pas de préférence',
    sortBy: 'Nouveaux',
    withPhoto: true,
    verifiedOnly: false,
    subscribeNow: false,
    country: 'Cameroun',
    state: 'West',
    city: 'Dschang',
    distance: '250',
    relationshipType: {
      noPreference: false,
      penPal: false,
      friendship: false,
      romance: false,
      longTerm: true
    }
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateRelationshipType = (type: keyof SearchFilters['relationshipType'], checked: boolean) => {
    setSearchFilters(prev => ({
      ...prev,
      relationshipType: { ...prev.relationshipType, [type]: checked }
    }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = searchUsers(allUsers, searchFilters);
      setFilteredUsers(results);
      setIsLoading(false);
      setShowMobileFilters(false);
    }, 1000);
  };

  // Auto-search when filters change
  useEffect(() => {
    const results = searchUsers(allUsers, searchFilters);
    setFilteredUsers(results);
  }, [searchFilters, allUsers]);

  const applySavedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setActiveTab('advanced');
    handleSearch();
  };

  const applyPopularSearch = (partialFilters: any) => {
    const mergedFilters = { ...searchFilters, ...partialFilters };
    setSearchFilters(mergedFilters);
    setActiveTab('advanced');
    handleSearch();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Recherches sauvegardées
              </h1>
              <span className="text-sm text-gray-500">
                {mockSavedSearches.length} recherche{mockSavedSearches.length > 1 ? 's' : ''} sauvegardée{mockSavedSearches.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-4">
              {mockSavedSearches.map(search => (
                <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{search.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Dernière utilisation: {search.lastUsed}</p>
                    </div>
                    <button 
                      onClick={() => applySavedSearch(search.filters)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:from-pink-600 hover:to-purple-700 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'popular':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Recherches populaires
              </h1>
              <span className="text-sm text-gray-500">
                Tendances actuelles
              </span>
            </div>
            <div className="space-y-4">
              {mockPopularSearches.map(search => (
                <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{search.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{search.count} recherches cette semaine</p>
                    </div>
                    <button 
                      onClick={() => applyPopularSearch(search.filters)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:from-pink-600 hover:to-purple-700 transition-colors"
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Résultats de recherche
              </h1>
              <span className="text-sm text-gray-500">
                {filteredUsers.length} profil{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Recherche en cours...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ y: -4 }}
                    className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-pink-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <img
                          src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={`Photo de profil de ${user.name}`}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                        />
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {user.age} ans • {user.city}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {user.isVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Vérifié
                            </span>
                          )}
                          {user.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {user.bio && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
                    )}
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Voir le profil
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-shrink-0 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'advanced'
                  ? 'text-white border-white bg-black bg-opacity-10'
                  : 'text-pink-100 border-transparent hover:text-white hover:border-pink-200'
              }`}
            >
              Recherche avancée
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-shrink-0 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'saved'
                  ? 'text-white border-white bg-black bg-opacity-10'
                  : 'text-pink-100 border-transparent hover:text-white hover:border-pink-200'
              }`}
            >
              Recherches sauvegardées
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex-shrink-0 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'popular'
                  ? 'text-white border-white bg-black bg-opacity-10'
                  : 'text-pink-100 border-transparent hover:text-white hover:border-pink-200'
              }`}
            >
              Recherches populaires
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Mobile Filter Toggle - Only show for advanced search */}
        {activeTab === 'advanced' && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres avancés</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Search Filters - Mobile Overlay */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="w-full max-w-sm h-full bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Recherche avancée</h2>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <SearchForm
                      searchFilters={searchFilters}
                      updateFilter={updateFilter}
                      updateRelationshipType={updateRelationshipType}
                      activeLocationTab={activeLocationTab}
                      setActiveLocationTab={setActiveLocationTab}
                      isLoading={isLoading}
                      onSearch={handleSearch}
                      isMobile={true}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Search Form - Only show for advanced search */}
          {activeTab === 'advanced' && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Search className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Recherche avancée</h2>
                </div>
                <SearchForm
                  searchFilters={searchFilters}
                  updateFilter={updateFilter}
                  updateRelationshipType={updateRelationshipType}
                  activeLocationTab={activeLocationTab}
                  setActiveLocationTab={setActiveLocationTab}
                  isLoading={isLoading}
                  onSearch={handleSearch}
                  isMobile={false}
                />
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className={`${activeTab === 'advanced' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md w-full bg-white rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedUser.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                    alt={`Photo de profil de ${selectedUser.name}`}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedUser.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedUser.age} ans • {selectedUser.city}, {selectedUser.country}</p>
                  {selectedUser.bio && (
                    <p className="text-gray-700 mb-4">{selectedUser.bio}</p>
                  )}
                  <div className="flex items-center space-x-2 mb-4">
                    {selectedUser.isVerified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Vérifié
                      </span>
                    )}
                    {selectedUser.isPremium && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Premium
                      </span>
                    )}
                    {selectedUser.isOnline ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        En ligne
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {selectedUser.lastOnline}
                      </span>
                    )}
                  </div>
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors">
                    Envoyer un message
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Search Form Component
interface SearchFormProps {
  searchFilters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  updateRelationshipType: (type: keyof SearchFilters['relationshipType'], checked: boolean) => void;
  activeLocationTab: string;
  setActiveLocationTab: (tab: string) => void;
  isLoading: boolean;
  onSearch: () => void;
  isMobile: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchFilters,
  updateFilter,
  updateRelationshipType,
  activeLocationTab,
  setActiveLocationTab,
  isLoading,
  onSearch,
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Filters */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Je suis un(e)</label>
          <div className="relative">
            <select
              value={searchFilters.gender}
              onChange={(e) => updateFilter('gender', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
            >
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cherchant</label>
          <div className="relative">
            <select
              value={searchFilters.seeking}
              onChange={(e) => updateFilter('seeking', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
            >
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <select
                value={searchFilters.ageFrom}
                onChange={(e) => updateFilter('ageFrom', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <select
                value={searchFilters.ageTo}
                onChange={(e) => updateFilter('ageTo', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="22">22</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Connexion</label>
          <div className="relative">
            <select
              value={searchFilters.connection}
              onChange={(e) => updateFilter('connection', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
            >
              <option value="Pas de préférence">Pas de préférence</option>
              <option value="En ligne maintenant">En ligne maintenant</option>
              <option value="Récemment en ligne">Récemment en ligne</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trier par:</label>
          <div className="relative">
            <select
              value={searchFilters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
            >
              <option value="Nouveaux">Nouveaux</option>
              <option value="Dernière connexion">Dernière connexion</option>
              <option value="Populaires">Populaires</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Localisation</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <div className="relative">
              <select
                value={searchFilters.country}
                onChange={(e) => updateFilter('country', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="Cameroun">Cameroun</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">État/Province</label>
            <div className="relative">
              <select
                value={searchFilters.state}
                onChange={(e) => updateFilter('state', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="West">West</option>
                <option value="Centre">Centre</option>
                <option value="Littoral">Littoral</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti">Ashanti</option>
                <option value="Western">Western</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <div className="relative">
              <select
                value={searchFilters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="Dschang">Dschang</option>
                <option value="Bafoussam">Bafoussam</option>
                <option value="Bamenda">Bamenda</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Douala">Douala</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Accra">Accra</option>
                <option value="Kumasi">Kumasi</option>
                <option value="Takoradi">Takoradi</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Relationship Type */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Type de relation</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="no-preference"
              checked={searchFilters.relationshipType.noPreference}
              onChange={(e) => updateRelationshipType('noPreference', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="no-preference" className="text-sm text-gray-700">
              Pas de préférence
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="penpal"
              checked={searchFilters.relationshipType.penPal}
              onChange={(e) => updateRelationshipType('penPal', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="penpal" className="text-sm text-gray-700">
              Correspondant
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="friendship"
              checked={searchFilters.relationshipType.friendship}
              onChange={(e) => updateRelationshipType('friendship', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="friendship" className="text-sm text-gray-700">
              Amitié
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="romance"
              checked={searchFilters.relationshipType.romance}
              onChange={(e) => updateRelationshipType('romance', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="romance" className="text-sm text-gray-700">
              Amour / Romance
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="long-term"
              checked={searchFilters.relationshipType.longTerm}
              onChange={(e) => updateRelationshipType('longTerm', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="long-term" className="text-sm text-gray-700">
              Relation à long terme
            </label>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="border-t pt-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="verified"
              checked={searchFilters.verifiedOnly}
              onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="verified" className="text-sm text-gray-700">
              Utilisateurs vérifiés uniquement
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="photo"
              checked={searchFilters.withPhoto}
              onChange={(e) => updateFilter('withPhoto', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="photo" className="text-sm text-gray-700">
              Avec photo
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="subscribe"
              checked={searchFilters.subscribeNow}
              onChange={(e) => updateFilter('subscribeNow', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="subscribe" className="text-sm text-gray-700 flex items-center space-x-1">
              <span>Membres Premium</span>
              <Lock className="w-4 h-4 text-gray-400" />
            </label>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSearch}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:from-pink-600 hover:to-purple-700 hover:shadow-lg disabled:opacity-70 text-sm"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Recherche...</span>
          </div>
        ) : (
          'Rechercher'
        )}
      </motion.button>
    </div>
  );
};