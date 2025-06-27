import React from 'react';
import { Heart, MessageCircle, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { User } from '../../types';

interface UserCardProps {
  User: User;
}

const UserCard: React.FC<UserCardProps> = ({ User }) => {
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
        {User.isPremium && (
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
    </div>
  );
};

export default UserCard;