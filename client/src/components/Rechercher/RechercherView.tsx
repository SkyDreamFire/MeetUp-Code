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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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




  // Mock data for saved searches
  const [savedSearches, setSavedSearches] = useState(
    [
      {
        id: 1,
        name: "Recherche Cameroun",
        lastUsed: "il y a 2 jours",
        filters: {
          gender: 'Homme',
          seeking: 'Femme',
          ageFrom: '19',
          ageTo: '22',
          connection: 'En ligne maintenant',
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
            romance: true,
            longTerm: false
          }
        }
      },
      {
        id: 2,
        name: "Recherche Nigeria",
        lastUsed: "hier",
        filters: {
          gender: 'Femme',
          seeking: 'Homme',
          ageFrom: '25',
          ageTo: '30',
          connection: 'Récemment en ligne',
          sortBy: 'Populaires',
          withPhoto: false,
          verifiedOnly: true,
          subscribeNow: false,
          country: 'Nigeria',
          state: 'Centre',
          city: 'Bamenda',
          distance: '500',
          relationshipType: {
            noPreference: true,
            penPal: false,
            friendship: true,
            romance: false,
            longTerm: true
          }
        }
      }
    ]
  );



  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-purple-50"></div>
    );
};