import { User, SearchFilters } from '../types';

export const filterUsers = (users: User[], filters: SearchFilters): User[] => {
  return users.filter(user => {
    // Gender and seeking filters
    if (user.gender !== filters.seeking) return false;
    
    // Age filter
    const ageFrom = parseInt(filters.ageFrom);
    const ageTo = parseInt(filters.ageTo);
    if (user.age < ageFrom || user.age > ageTo) return false;
    
    // Connection status filter
    if (filters.connection === 'En ligne maintenant' && !user.isOnline) return false;
    if (filters.connection === 'Récemment en ligne' && user.isOnline) return false;
    
    // Location filters
    if (filters.country !== 'Tous' && user.country !== filters.country) return false;
    if (filters.state !== 'Tous' && user.state !== filters.state) return false;
    if (filters.city !== 'Tous' && user.city !== filters.city) return false;
    
    // Photo filter
    if (filters.withPhoto && !user.hasPhoto) return false;
    
    // Verification filter
    if (filters.verifiedOnly && !user.isVerified) return false;
    
    // Relationship type filter
    const selectedRelationshipTypes = Object.entries(filters.relationshipType)
      .filter(([_, selected]) => selected)
      .map(([type, _]) => type);
    
    if (selectedRelationshipTypes.length > 0) {
      const hasMatchingRelationshipType = selectedRelationshipTypes.some(type => 
        user.relationshipType.includes(type as any)
      );
      if (!hasMatchingRelationshipType) return false;
    }
    
    return true;
  });
};

export const sortUsers = (users: User[], sortBy: string): User[] => {
  const sortedUsers = [...users];
  
  switch (sortBy) {
    case 'Nouveaux':
      return sortedUsers.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    
    case 'Dernière connexion':
      return sortedUsers.sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return 0;
      });
    
    case 'Populaires':
      return sortedUsers.sort((a, b) => b.popularityScore - a.popularityScore);
    
    default:
      return sortedUsers;
  }
};

export const searchUsers = (users: User[], filters: SearchFilters): User[] => {
  const filteredUsers = filterUsers(users, filters);
  return sortUsers(filteredUsers, filters.sortBy);
};