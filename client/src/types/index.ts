export interface User {
  id: string;
  name: string;
  age: number;
  email:string;
  bio: string;
  location: string;
  photos: string[];
  profileImage?: string;
  isPremium: boolean;
  isOnline: boolean;
  lastSeen?: Date;
  lastActive: number;
  isNew?: boolean;
  interests: string[];
  lookingFor: string;
  gender: 'male' | 'female' | "";
  occupation?: string;
  education?: string;
  country?: string;
  city?: string;
  interest?: string;
  hasPhoto?: boolean;
  isVerified?: boolean;
  
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Match {
  id: string;
  users: [string, string];
  timestamp: Date;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SearchFilters {
  gender: string;
  seeking: string;
  ageFrom: string;
  ageTo: string;
  connection: string;
  sortBy: string;
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