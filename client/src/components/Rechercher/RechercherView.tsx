import React, { useState } from 'react';
import { Search, Lock, ChevronDown } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';
import { motion } from 'framer-motion';

export const RechercherView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('advanced');
  const [activeLocationTab, setActiveLocationTab] = useState('single');
  const [] = useState('single');
  const [] = useState<User[]>(mockUsers);
  const [] = useState(0);
  const [] = useState(false);
  const [isLoading] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
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

  const updateFilter = (key: string, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateRelationshipType = (type: string, checked: boolean) => {
    setSearchFilters(prev => ({
      ...prev,
      relationshipType: { ...prev.relationshipType, [type]: checked }
    }));
  };
  return (
    <div className=" w-full  flex-1 bg-gradient-to-br from-pink-25 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-0">
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'advanced'
                  ? 'text-white border-white bg-gradient-to-r from-pink-600 to-purple-600'
                  : 'text-pink-100 border-transparent hover:text-white hover:border-pink-300 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                Recherche avancée
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'saved'
                  ? 'text-white border-white bg-gradient-to-r from-pink-600 to-purple-600'
                  : 'text-pink-100 border-transparent hover:text-white hover:border-pink-300 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                Recherches sauvegardées
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'popular'
                  ? 'text-white border-white bg-gradient-to-r from-pink-600 to-purple-600'
                  : 'text-pink-100 border-transparent hover:text-white hover:border-pink-300 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                Recherches populaires
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Search Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Recherche avancée</h1>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {/* Basic Search Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Je suis un(e)</label>
                    <div className="relative">
                      <select
                        value={searchFilters.gender}
                        onChange={(e) => updateFilter('gender', e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Homme</option>
                        <option>Femme</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cherchant</label>
                    <div className="relative">
                      <select
                        value={searchFilters.seeking}
                        onChange={(e) => updateFilter('seeking', e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Femme</option>
                        <option>Homme</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <select
                          value={searchFilters.ageFrom}
                          onChange={(e) => updateFilter('ageFrom', e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option>19</option>
                          <option>20</option>
                          <option>21</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      <div className="relative flex-1">
                        <select
                          value={searchFilters.ageTo}
                          onChange={(e) => updateFilter('ageTo', e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option>22</option>
                          <option>23</option>
                          <option>24</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Additional Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Connexion</label>
                    <div className="relative">
                      <select
                        value={searchFilters.connection}
                        onChange={(e) => updateFilter('connection', e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Pas de préférence</option>
                        <option>En ligne maintenant</option>
                        <option>Récemment en ligne</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Résultats par:</label>
                    <div className="relative">
                      <select
                        value={searchFilters.sortBy}
                        onChange={(e) => updateFilter('sortBy', e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Nouveaux</option>
                        <option>Dernière connexion</option>
                        <option>Populaires</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avec photo:</label>
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Checkboxes */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={searchFilters.verifiedOnly}
                        onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="verified" className="text-sm text-gray-700">
                        Afficher uniquement les utilisateurs vérifiés ?
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="subscribe"
                        checked={searchFilters.subscribeNow}
                        onChange={(e) => updateFilter('subscribeNow', e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="subscribe" className="text-sm text-gray-700 flex items-center space-x-1">
                        <span>S'abonner Maintenant !</span>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </label>
                    </div>
                  </div>
                  {/* Location Section */}
                  <div className="border-t pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Vivant en</h2>

                    {/* Location Tabs */}
                    <div className="flex space-x-0 mb-6">
                      <button
                        onClick={() => setActiveLocationTab('single')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${activeLocationTab === 'single'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                      >
                        Pays Unique
                      </button>
                      <button
                        onClick={() => setActiveLocationTab('multiple')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${activeLocationTab === 'multiple'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                      >
                        Pays Multiples
                      </button>
                    </div>
                    {/* Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                        <div className="relative">
                          <select
                            value={searchFilters.country}
                            onChange={(e) => updateFilter('country', e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option>Cameroun</option>
                            <option>Nigeria</option>
                            <option>Ghana</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">État/Province</label>
                        <div className="relative">
                          <select
                            value={searchFilters.state}
                            onChange={(e) => updateFilter('state', e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option>West</option>
                            <option>Centre</option>
                            <option>Littoral</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                        <div className="relative">
                          <select
                            value={searchFilters.city}
                            onChange={(e) => updateFilter('city', e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option>Dschang</option>
                            <option>Bafoussam</option>
                            <option>Bamenda</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">entre</label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <select
                              value={searchFilters.distance}
                              onChange={(e) => updateFilter('distance', e.target.value)}
                              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option>250</option>
                              <option>500</option>
                              <option>1000</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-500">miles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Relationship Type Section */}
                  <div className="border-t pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recherchant</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="no-preference"
                          checked={searchFilters.relationshipType.noPreference}
                          onChange={(e) => updateRelationshipType('noPreference', e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="long-term" className="text-sm text-gray-700">
                          Relation à long terme
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Appearance Section */}
                  <div className="border-t pt-8">
                    
                  </div>
                </div>
                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-romantic text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Rechercher'
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};