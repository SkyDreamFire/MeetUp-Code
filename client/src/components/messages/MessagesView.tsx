import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Crown, Send, Smile, Paperclip, ArrowLeft } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

interface Conversation {
  id: string;
  user: typeof mockUsers[0];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export const MessagesView: React.FC = () => {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      user: mockUsers[0],
      lastMessage: 'Hey! How was your day?',
      timestamp: '2 min ago',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      user: mockUsers[1],
      lastMessage: 'Thanks for the like! 😊',
      timestamp: '1 hour ago',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      user: mockUsers[2],
      lastMessage: 'Would love to meet up sometime',
      timestamp: '3 hours ago',
      unreadCount: 1,
      isOnline: true,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', text: 'Hi there! 😊', sender: 'them', timestamp: '10:30' },
      { id: '2', text: 'Thanks! 😄', sender: 'me', timestamp: '10:31' },
    ],
    '2': [
      { id: '1', text: 'Hey! How’s it going?', sender: 'them', timestamp: '12:00' },
    ],
    '3': [],
  });

  const messages = selectedConversation
    ? messagesByConversation[selectedConversation.id] || []
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), message],
    }));

    setNewMessage('');

    setTimeout(() => {
      const reply = {
        id: Date.now().toString() + '_r',
        text: "That's nice! 😊",
        sender: 'them' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessagesByConversation((prev) => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), reply],
      }));
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <div className={`md:block w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 ${
        selectedConversation ? 'hidden md:block' : 'block'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 cursor-pointer border-b border-gray-100 ${
                selectedConversation?.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.user.photos[0]}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-800 truncate">{conversation.user.name}</h3>
                      {conversation.user.isPremium && <Crown className="w-4 h-4 text-accent-500" />}
                    </div>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedConversation ? (
        <div className="flex-1 flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200 flex items-center space-x-3">
            <button
              className="md:hidden text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={selectedConversation.user.photos[0]}
              alt={selectedConversation.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-800">{selectedConversation.user.name}</h3>
                {selectedConversation.user.isPremium && <Crown className="w-4 h-4 text-accent-500" />}
              </div>
              <p className="text-sm text-gray-500">
                {selectedConversation.isOnline ? 'Online now' : 'Last seen 2 hours ago'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-primary-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 relative">
              {/* Fichier joint */}
              <label className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && selectedConversation) {
                      const fileMsg = {
                        id: Date.now().toString(),
                        text: `📎 Fichier: ${file.name}`,
                        sender: 'me' as const,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      };
                      setMessagesByConversation((prev) => ({
                        ...prev,
                        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), fileMsg],
                      }));
                    }
                  }}
                />
              </label>

              {/* Emoji */}
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) => {
                        setNewMessage((prev) => prev + emoji.native);
                        setShowEmojiPicker(false);
                      }}
                      theme="light"
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose from your existing conversations</p>
          </div>
        </div>
      )}
    </div>
  );
};
