// 📁 src/components/Header.tsx
import React, { useState } from 'react';
import { Crown, Settings, Mail, Lock, User, CreditCard, Languages, HelpCircle, UserPlus, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserProfile } from '../../hooks/useUserProfile';


interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { profile, loading } = useUserProfile();


  const settingsOptions = [
    { icon: Mail, label: 'Adresse Email', path: 'email' },
    { icon: User, label: 'Paramètres profil', path: 'profile' },
    { icon: Lock, label: 'Mot de passe', path: 'password' },
    { icon: Languages, label: 'Sélectionner la langue', path: 'language' },
    { icon: CreditCard, label: 'Facturation', path: 'billing' },
    { icon: UserPlus, label: 'Abonnez-vous', path: 'subscribe' },
    { icon: HelpCircle, label: 'Aide', path: 'help' },
    { icon: LogOut, label: 'Déconnecter', path: '/logout' },
  ];

  const navItems = [
    { id: 'En ligne', label: 'En ligne' },
    { id: 'correspondances', label: 'Correspondances' },
    { id: 'rechercher', label: 'Rechercher' },
    { id: 'messages', label: 'Messages' },
    
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-pink-300 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <img src="/logo_final-removebg-preview.png" alt="Logo" className="h-10 w-15 rounded-full bg-white" />

          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 cursor-pointer">
            <span
              onClick={() => onNavigate('dashboard')}
              className="text-xl font-display font-bold bg-gradient-romantic bg-clip-text text-transparent"
            >
              MeetUp
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === item.id ? 'bg-primary-500 text-white shadow-lg' : 'text-white hover:bg-secondary-500'
                }`}
              >
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <motion.button
                key="activités"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentView === 'activités' ? 'bg-primary-500 text-white shadow-lg' : 'text-white hover:bg-secondary-500'
                }`}
              >
                <span className="font-medium">Activités</span>
              </motion.button>

              {showDropdown && (
                <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {['likes', 'favoris', 'vue de profil', 'liste rouge'].map((option) => (
                    <button
                      key={option}
                      onClick={() => onNavigate(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            {/* {profile?.est_premium && ( */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-1 bg-gradient-sunset px-3 py-1 rounded-full"
              >
                <Crown className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Premium</span>
              </motion.div>
            {/* )} */}

            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600" />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {settingsOptions.map((option, index) => (
                      <button
                        key={index}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsSettingsOpen(false);
                          onNavigate(`settings/${option.path}`);
                        }}
                      >
                        <option.icon className="w-4 h-4 mr-3" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <motion.img
              whileHover={{ scale: 1.1 }}
              src={profile?.photos?.find(p => p.est_principale)?.url_photo || '/icons8-user-default-64.png'}
              alt={`${profile?.nom || 'User'} ${profile?.prenom || 'Profile'}`}
              className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 cursor-pointer"
              onClick={() => onNavigate('profile')}
            />
          </div>
        </div>

        <div className="md:hidden border-t border-gray-200">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentView === item.id ? 'text-secondary-500' : 'text-white'
                }`}
              >
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
