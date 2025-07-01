import React, { useState } from 'react';

import { useViewTransition } from '../../hooks/useViewTransition';

export const LanguageSettings: React.FC = () => {
  const { currentView, navigateToView } = useViewTransition('settings/language');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Ici, vous pouvez ajouter la logique pour changer la langue dans votre application
  };

  return (
  
      <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Sélectionner la langue</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center p-4 rounded-lg border-2 transition-colors ${selectedLanguage === language.code 
              ? 'border-pink-500 bg-pink-50' 
              : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50'}`}
          >
            <span className="text-2xl mr-3">{language.flag}</span>
            <span className="text-lg">{language.name}</span>
            {selectedLanguage === language.code && (
              <span className="ml-auto">
                <svg className="w-6 h-6 text-pink-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Paramètres régionaux</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
              Format de date
            </label>
            <select
              id="dateFormat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
              <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
              <option value="yyyy/mm/dd">AAAA/MM/JJ</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
              Format de l'heure
            </label>
            <select
              id="timeFormat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="24">24 heures</option>
              <option value="12">12 heures (AM/PM)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        className="mt-8 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
        onClick={() => {
          // Sauvegarder les paramètres de langue
        }}
      >
        Enregistrer les préférences
      </button>
      </div>
  
  );
};