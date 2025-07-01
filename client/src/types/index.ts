export interface User {
  id: number;
  name: string;
  age: number;
  gender: 'Homme' | 'Femme';
  seeking: 'Homme' | 'Femme';
  country: string;
  photos: string[];
  state: string;
  city: string;
  profileImage?: string;
  isOnline: boolean;
  lastOnline?: string;
  isPremium: boolean;
  isVerified: boolean;
  hasPhoto: boolean;
  relationshipType: RelationshipType[];
  joinDate: string;
  popularityScore: number;
  bio?: string;
}

export type RelationshipType = 'noPreference' | 'penPal' | 'friendship' | 'romance' | 'longTerm';

export interface SearchFilters {
  gender: 'Homme' | 'Femme';
  seeking: 'Homme' | 'Femme';
  ageFrom: string;
  ageTo: string;
  connection: 'Pas de préférence' | 'En ligne maintenant' | 'Récemment en ligne';
  sortBy: 'Nouveaux' | 'Dernière connexion' | 'Populaires';
  withPhoto: boolean;
  verifiedOnly: boolean;
  subscribeNow: boolean;
  country: string;
  state: string;
  city: string;
  distance: string;
  relationshipType: {
    noPreference: boolean;
    penPal: boolean;
    friendship: boolean;
    romance: boolean;
    longTerm: boolean;
  };
}

export interface SavedSearch {
  id: number;
  name: string;
  lastUsed: string;
  filters: SearchFilters;
}

export interface PopularSearch {
  id: number;
  name: string;
  count: number;
  filters?: Partial<SearchFilters>;
}