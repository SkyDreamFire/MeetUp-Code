import React from 'react';
<<<<<<< HEAD
import { Heart, MessageCircle, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
=======
import { motion } from 'framer-motion';
import { Heart, X, MapPin, Briefcase, GraduationCap, Crown, MessageCircle } from 'lucide-react';
import PopUpMessage from '../shared/PopUpMessage';
import MessageList from '../shared/MessageList';
import { useConversationsContext } from '../../contexts/ConversationsContext';
>>>>>>> bdc5fac6c208b0df3547b419c3940e0ac4dad065
import { User } from '../../types';

interface UserCardProps {
  User: User;
}

<<<<<<< HEAD
export const UserCard: React.FC<UserCardProps> = ({ User }) => {
=======
export const UserCard: React.FC<UserCardProps> = ({ user, onLike, onPass }) => {
  const {
    conversations,
    isListOpen,
    selectedConversation,
    addConversation,
    selectConversation,
    closeList,
    closeConversation
  } = useConversationsContext();
>>>>>>> bdc5fac6c208b0df3547b419c3940e0ac4dad065
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* User Image */}
      <div className="relative">
        <img
          src={User.photos[0]}
          alt={User.name}
          className="w-full h-64 object-cover"
        />
        {/* Online Status */}
        {User.isOnline && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            En ligne
          </div>
        )}
        {/* Verified Badge */}
        {User.isVerified && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white p-1.5 rounded-full">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {User.name}, {User.age}
          </h3>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{User.city}, {User.country}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-3">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">{User.isOnline}</span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {User.interests}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1">
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
          <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1">
            <Star className="w-4 h-4" />
            Intérêt
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
<<<<<<< HEAD
    </div>
=======

      {/* Action Buttons */}
      <div className="absolute bottom-6 right-6 flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-3 bg-blue-500 rounded-full text-white shadow-lg"
          onClick={() => addConversation(user)}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPass(user.id)}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onLike(user.id)}
          className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-all duration-200"
        >
          <Heart className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Message List and Popup Container */}
      <div className="fixed bottom-0 right-0 flex items-end space-x-4 z-50">
        {/* Message List */}
        {isListOpen && (
          <MessageList
            conversations={conversations}
            onSelect={selectConversation}
            onClose={closeList}
          />
        )}

        {/* Message Popup */}
        {selectedConversation && (
          <PopUpMessage
            isOpen={true}
            onClose={closeConversation}
            recipientName={selectedConversation.name}
            recipientAge={selectedConversation.age}
            recipientPhoto={selectedConversation.avatar}
            recipientLocation={selectedConversation.location || 'Non spécifié'}
            isOnline={selectedConversation.isOnline || false}
          />
        )}
      </div>
    </motion.div>
>>>>>>> bdc5fac6c208b0df3547b419c3940e0ac4dad065
  );
};

export default UserCard;