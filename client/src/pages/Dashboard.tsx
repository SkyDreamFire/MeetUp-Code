import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, LogOut, User, MessageCircle, Search, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-800">MeetUp</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Bonjour, {user?.user_metadata?.firstName}!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenue, {user?.user_metadata?.firstName} {user?.user_metadata?.lastName}!
            </h1>
            <p className="text-gray-600 mb-6">
              Votre voyage vers l'amour commence maintenant. Explorez et connectez-vous avec des personnes extraordinaires.
            </p>
            {!user?.profile?.profileComplete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Complétez votre profil</strong> pour augmenter vos chances de rencontrer quelqu'un de spécial!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Découvrir</h3>
            <p className="text-gray-600 mb-4">
              Explorez les profils et trouvez des personnes qui partagent vos intérêts.
            </p>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
              Commencer
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Messages</h3>
            <p className="text-gray-600 mb-4">
              Consultez vos conversations et continuez à faire connaissance.
            </p>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200">
              Voir messages
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Profil</h3>
            <p className="text-gray-600 mb-4">
              Personnalisez votre profil pour attirer les bonnes personnes.
            </p>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-200">
              Modifier profil
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Votre activité</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">0</div>
              <div className="text-gray-600">Profils vus</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
              <div className="text-gray-600">Likes reçus</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">0</div>
              <div className="text-gray-600">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">Messages</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;