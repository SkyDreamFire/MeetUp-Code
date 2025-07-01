import React from 'react';
import { SettingsLayout } from '../layout/SettingsLayout';
import { useViewTransition } from '../../hooks/useViewTransition';

export const EmailSettings: React.FC = () => {
  const { currentView, navigateToView } = useViewTransition('settings/email');
  return (
    <SettingsLayout currentView={currentView} onNavigate={navigateToView}>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Paramètres d'email</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email actuelle
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Nouvelle adresse email
            </label>
            <input
              type="email"
              id="newEmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              Mot de Passe
            </label>
            <input 
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            Mettre à jour l'email
          </button>
        </form>
      </div>
    </SettingsLayout>
  );
};