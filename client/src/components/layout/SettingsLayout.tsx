import React from 'react';
import { Header } from './Header';
import { useAuth } from '../../contexts/AuthContext';
import { ViewType, SettingsViewType } from '../../types/views';

interface SettingsLayoutProps {
  children: React.ReactNode;
  currentView: SettingsViewType;
  onNavigate: (view: ViewType | SettingsViewType) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, currentView, onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        currentUser={user}
        onNavigate={onNavigate}
        currentView={currentView}
      />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};