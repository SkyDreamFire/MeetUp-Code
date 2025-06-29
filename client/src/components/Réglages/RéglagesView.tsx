import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Mail,
  Lock,
  User,
  CreditCard,
  Languages,
  HelpCircle,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { SettingsRouter } from './SettingsRouter';

export const RéglagesView: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const settingsOptions = [
    { icon: Mail, label: 'Adresse Email', path: '/settings/email' },
    { icon: Lock, label: 'Mot de passe', path: '/settings/password' },
    { icon: User, label: 'Paramètres profil', path: '/settings/profile' },
    { icon: CreditCard, label: 'Facturation', path: '/settings/billing' },
    { icon: Languages, label: 'Sélectionner la langue', path: '/settings/language' },
    { icon: HelpCircle, label: 'Aide', path: '/settings/help' },
    { icon: UserPlus, label: 'Abonnez-vous', path: '/settings/subscribe' },
    { icon: LogOut, label: 'Déconnecter', path: '/logout' },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br p-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Bouton d’ouverture du menu réglages */}
        <div className="absolute top-6 right-4">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dropdown des réglages */}
          {isSettingsOpen && (
            <div className="absolute right-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                {settingsOptions.map((option, index) => (
                  <Link
                    key={index}
                    to={option.path}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    <option.icon className="w-4 h-4 mr-3" />
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal des réglages */}
        <div className="mt-16">
          <SettingsRouter />
        </div>
      </div>
    </div>
  );
};
