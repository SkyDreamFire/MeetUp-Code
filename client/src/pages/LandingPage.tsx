import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-white"></div>
        <div className="relative px-4 py-6">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
    
              <span className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">MeetUp</span>
            </div>
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-white text-secondary-600 px-6 py-2 rounded-full font-semibold hover:bg-primary-400 transition-all duration-200 transform hover:scale-105"
              >
                S'inscrire
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-secondary-300"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Trouvez l'Amour
            <span className="block text-yellow-300">où que vous soyez</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec des célibataires  du monde entier. 
            Votre histoire d'amour commence ici.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-400 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-primary-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Commencer Maintenant
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Pourquoi Choisir MeetUp?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Communauté Authentique</h3>
              <p className="text-gray-600">
                Rejoignez une communauté de célibataires   à travers le monde.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sécurité Garantie</h3>
              <p className="text-gray-600">
                Vos données sont protégées avec nos protocoles de sécurité avancés.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Connexion Mondiale</h3>
              <p className="text-gray-600">
                Connectez-vous avec des personnes dans le monde et trouvez votre moitié.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-400 ">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à Rencontrer Votre Âme Sœur?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Rejoignez des milliers de célibataires qui ont trouvé l'amour sur MeetUp.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Créer Mon Profil
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
           
            <span className="text-xl font-bold bg-gradient-romantic bg-clip-text text-transparent">MeetUp</span>
          </div>
          <p className="text-gray-400">
            © 2024 MeetUp. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;