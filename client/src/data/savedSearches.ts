import { SavedSearch, PopularSearch } from '../types';

export const mockSavedSearches: SavedSearch[] = [
  {
    id: 1,
    name: "Recherche Cameroun",
    lastUsed: "il y a 2 jours",
    filters: {
      gender: 'Homme',
      seeking: 'Femme',
      ageFrom: '19',
      ageTo: '28',
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
      ageFrom: '22',
      ageTo: '30',
      connection: 'Récemment en ligne',
      sortBy: 'Populaires',
      withPhoto: false,
      verifiedOnly: true,
      subscribeNow: false,
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Lagos',
      distance: '500',
      relationshipType: {
        noPreference: true,
        penPal: false,
        friendship: true,
        romance: false,
        longTerm: true
      }
    }
  },
  {
    id: 3,
    name: "Relations sérieuses",
    lastUsed: "il y a 3 jours",
    filters: {
      gender: 'Homme',
      seeking: 'Femme',
      ageFrom: '25',
      ageTo: '35',
      connection: 'Pas de préférence',
      sortBy: 'Populaires',
      withPhoto: true,
      verifiedOnly: true,
      subscribeNow: false,
      country: 'Ghana',
      state: 'Greater Accra',
      city: 'Accra',
      distance: '1000',
      relationshipType: {
        noPreference: false,
        penPal: false,
        friendship: false,
        romance: false,
        longTerm: true
      }
    }
  }
];

export const mockPopularSearches: PopularSearch[] = [
  { 
    id: 1, 
    name: "Femmes 20-25 ans Cameroun", 
    count: 1250,
    filters: {
      seeking: 'Femme',
      ageFrom: '20',
      ageTo: '25',
      country: 'Cameroun'
    }
  },
  { 
    id: 2, 
    name: "Hommes vérifiés Nigeria", 
    count: 890,
    filters: {
      seeking: 'Homme',
      verifiedOnly: true,
      country: 'Nigeria'
    }
  },
  { 
    id: 3, 
    name: "Relations sérieuses Ghana", 
    count: 675,
    filters: {
      country: 'Ghana',
      relationshipType: {
        noPreference: false,
        penPal: false,
        friendship: false,
        romance: false,
        longTerm: true
      }
    }
  },
  { 
    id: 4, 
    name: "Correspondants Afrique", 
    count: 432,
    filters: {
      relationshipType: {
        noPreference: false,
        penPal: true,
        friendship: false,
        romance: false,
        longTerm: false
      }
    }
  }
];