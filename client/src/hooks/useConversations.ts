import { useState } from 'react';

interface Conversation {
  id: string;
  name: string;
  age: number;
  avatar: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const addConversation = (user: { id: string; name: string; age: number; photos: string[] }) => {
    const existingConversation = conversations.find(conv => conv.id === user.id);
    if (!existingConversation) {
      const newConversation: Conversation = {
        id: user.id,
        name: user.name,
        age: user.age,
        avatar: user.photos[0]
      };
      setConversations(prev => [...prev, newConversation]);
    }
    setIsListOpen(true);
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsListOpen(false);
  };

  const closeList = () => {
    setIsListOpen(false);
  };

  const closeConversation = () => {
    setSelectedConversation(null);
  };

  return {
    conversations,
    isListOpen,
    selectedConversation,
    addConversation,
    selectConversation,
    closeList,
    closeConversation
  };
};