import React, { useState } from 'react';

import { useViewTransition } from '../../hooks/useViewTransition';

export const ProfileSettings: React.FC = () => {
  const { currentView, navigateToView } = useViewTransition('settings/profile');
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    bio: '',
    location: '',
    interests: '',
    lookingFor: 'both',
    showDistance: true,
    showAge: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProfileData(prev => ({ ...prev, [name]: checked }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
 
      <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Paramètres du profil</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Âge
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={profileData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Localisation
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
            Centres d'intérêt (séparés par des virgules)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={profileData.interests}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">
            Je recherche
          </label>
          <select
            id="lookingFor"
            name="lookingFor"
            value={profileData.lookingFor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="men">Hommes</option>
            <option value="women">Femmes</option>
            <option value="both">Les deux</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showDistance"
              name="showDistance"
              checked={profileData.showDistance}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="showDistance" className="text-sm text-gray-600">
              Afficher ma distance
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showAge"
              name="showAge"
              checked={profileData.showAge}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="showAge" className="text-sm text-gray-600">
              Afficher mon âge
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
        >
          Enregistrer les modifications
        </button>
      </form>
      </div>
   
  );
};