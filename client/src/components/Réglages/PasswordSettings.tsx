import React, { useState } from 'react';
import { SettingsLayout } from '../layout/SettingsLayout';
import { useViewTransition } from '../../hooks/useViewTransition';

export const PasswordSettings: React.FC = () => {
  const { currentView, navigateToView } = useViewTransition('settings/password');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SettingsLayout currentView={currentView} onNavigate={navigateToView}>
      <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Changer le mot de passe</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe actuel
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="currentPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Nouveau mot de passe
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="text-sm text-gray-600">
            Afficher le mot de passe
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
        >
          Mettre à jour le mot de passe
        </button>
      </form>
      </div>
    </SettingsLayout>
  );
};