import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConversationsProvider } from './contexts/ConversationsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Layout components
import { Header } from './components/layout/Header';

// View components
import { VueDeProfilView } from './components/vueDeProfil/VueDeProfilView';
import { CorrespondancesView } from './components/Correspondances/CorrespondancesView';
import { MessagesView } from './components/messages/MessagesView';
import { ProfileView } from './components/profile/ProfileView';

import { LikesView } from './components/likes/LikesView';
import { FavorisView } from './components/favoris/FavorisView';
import { ListeRougesView } from './components/ListeRouge/ListeRougesView';
import { RechercherView } from './components/Rechercher/RechercherView';
import { EnligneView } from './components/Enligne/Enligne';
import { LogoutHandler } from './components/Réglages/LogoutHandler';
// Page components
import LandingPage from './pages/LandingPage';
// import Dashboard from './pages/Dashboard';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';

// Route protégée
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return   <div className="min-h-screen bg-gradient-romantic flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <img src="/logo_final-removebg-preview.png" alt="logo" className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MeeTup</h1>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          </div>
        </motion.div>
      </div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Route publique
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return   <div className="min-h-screen bg-gradient-romantic flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <img src="/logo_final-removebg-preview.png" alt="logo" className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MeeTup</h1>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          </div>
        </motion.div>
      </div>;
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

type ViewType = 
  | 'En ligne'
  | 'correspondances' 
  | 'messages'
  | 'profile'
  | 'rechercher'
  | 'réglages'
  | 'likes'
  | 'favoris'
  | 'vue de profil'
  | 'liste rouge';

// App interne après connexion
function InternalApp() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('En ligne');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <img src="/logo_final-removebg-preview.png" alt="logo" className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MeeTup</h1>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'En ligne': return <EnligneView />;
      case 'correspondances': return <CorrespondancesView />;
      case 'messages': return <MessagesView />;
      case 'rechercher': return <RechercherView />;
      
      case 'likes': return <LikesView />;
      case 'favoris': return <FavorisView />;
      case 'vue de profil': return <VueDeProfilView />;
      case 'liste rouge': return <ListeRougesView />;
      case 'profile': return <ProfileView user={user} />;
      default: return <EnligneView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        currentUser={user}
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// App principale avec routes
function App() {
  return (
    <AuthProvider>
      <ConversationsProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><InternalApp /></ProtectedRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/logout" element={<LogoutHandler />} />

          </Routes>
        </Router>
      </ConversationsProvider>
    </AuthProvider>
  );
}

export default App;
