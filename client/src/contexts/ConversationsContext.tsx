import React, { createContext, useContext, ReactNode } from 'react';
import { useConversations } from '../hooks/useConversations';

type ConversationsContextType = ReturnType<typeof useConversations>;

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const ConversationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const conversations = useConversations();

  return (
    <ConversationsContext.Provider value={conversations}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversationsContext = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversationsContext must be used within a ConversationsProvider');
  }
  return context;
};