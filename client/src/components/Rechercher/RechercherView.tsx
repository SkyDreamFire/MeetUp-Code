import React, { useState } from 'react';
import { Search, Lock, ChevronDown, Filter, X } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User, SearchFilters } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export const RechercherView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('advanced');
  const [activeLocationTab, setActiveLocationTab] = useState('single');
  const [users] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    gender: 'Homme',
    seeking: 'Femme',
    ageFrom: '19',
    ageTo: '22',
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
    // Simulate search
    setTimeout(() => {
      setIsLoading(false);
      setShowMobileFilters(false);
    }, 2000);
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
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres avancés</span>
          </button>
        </div>

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

          {/* Desktop Search Form */}
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

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Résultats de recherche
                </h1>
                <span className="text-sm text-gray-500">
                  {users.length} profil{users.length > 1 ? 's' : ''} trouvé{users.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {users.map((user) => (
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
                        {user.isPremium && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
                      Voir le profil
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
  isMobile
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
              <option>Homme</option>
              <option>Femme</option>
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
              <option>Femme</option>
              <option>Homme</option>
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
                <option>18</option>
                <option>19</option>
                <option>20</option>
                <option>21</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <select
                value={searchFilters.ageTo}
                onChange={(e) => updateFilter('ageTo', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option>22</option>
                <option>25</option>
                <option>30</option>
                <option>35</option>
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
              <option>Pas de préférence</option>
              <option>En ligne maintenant</option>
              <option>Récemment en ligne</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Résultats par:</label>
          <div className="relative">
            <select
              value={searchFilters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
            >
              <option>Nouveaux</option>
              <option>Dernière connexion</option>
              <option>Populaires</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Vivant en</h3>
        
        {/* Location Tabs */}
        <div className="flex space-x-0 mb-4">
          <button
            onClick={() => setActiveLocationTab('single')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-l-lg border transition-colors ${
              activeLocationTab === 'single'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Pays Unique
          </button>
          <button
            onClick={() => setActiveLocationTab('multiple')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-r-lg border-t border-r border-b transition-colors ${
              activeLocationTab === 'multiple'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Pays Multiples
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <div className="relative">
              <select
                value={searchFilters.country}
                onChange={(e) => updateFilter('country', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option>Cameroun</option>
                <option>Nigeria</option>
                <option>Ghana</option>
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
                <option>West</option>
                <option>Centre</option>
                <option>Littoral</option>
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
                <option>Dschang</option>
                <option>Bafoussam</option>
                <option>Bamenda</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">entre</label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <select
                  value={searchFilters.distance}
                  onChange={(e) => updateFilter('distance', e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                >
                  <option>250</option>
                  <option>500</option>
                  <option>1000</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-sm text-gray-500">miles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Relationship Type */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Recherchant</h3>
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
              Amour / Rencontres
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
              Afficher uniquement les utilisateurs vérifiés ?
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
              Avec photo:
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
              <span>S'abonner Maintenant !</span>
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