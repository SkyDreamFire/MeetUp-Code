# AfroIntroductions Backend

Backend complet pour une application de rencontre similaire à AfroIntroductions, développé avec Node.js, Express et MySQL.

## 🚀 Fonctionnalités

### Authentification & Sécurité
- ✅ Inscription/Connexion avec JWT
- ✅ Hashage des mots de passe avec bcrypt
- ✅ Rate limiting pour prévenir les abus
- ✅ Validation des données avec express-validator
- ✅ Middleware de sécurité avec Helmet

### Gestion des Utilisateurs
- ✅ Profils utilisateurs complets
- ✅ Upload et gestion des photos avec Cloudinary
- ✅ Recherche avancée avec filtres
- ✅ Géolocalisation et distance
- ✅ Statistiques de profil

### Système de Matching
- ✅ Système de likes
- ✅ Matching mutuel automatique
- ✅ Blocage d'utilisateurs
- ✅ Signalements et modération

### Messagerie en Temps Réel
- ✅ Messages instantanés avec Socket.IO
- ✅ Statut en ligne/hors ligne
- ✅ Notifications de frappe
- ✅ Marquage des messages comme lus

### Abonnements Premium
- ✅ Intégration Stripe pour les paiements
- ✅ Plans mensuel et annuel
- ✅ Gestion des webhooks
- ✅ Fonctionnalités premium

### Administration
- ✅ Panel admin avec authentification
- ✅ Gestion des utilisateurs
- ✅ Statistiques et analytics
- ✅ Modération des signalements

## 📋 Prérequis

- Node.js 16+
- MySQL 8.0+
- Compte Cloudinary (pour les images)
- Compte Stripe (pour les paiements)
- Compte email SMTP (pour les notifications)

## 🛠 Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd afro-dating-backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
```bash
# Se connecter à MySQL
mysql -u root -p

# Importer le schéma
source database/schema.sql
```

4. **Configuration des variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

5. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

## 🗄️ Structure de la Base de Données

### Tables Principales

- **users** - Informations des utilisateurs
- **user_photos** - Photos de profil
- **likes** - Likes entre utilisateurs
- **matches** - Matches créés
- **messages** - Messages échangés
- **subscriptions** - Abonnements premium
- **blocked_users** - Utilisateurs bloqués
- **user_reports** - Signalements

### Fonctionnalités Avancées

- **Triggers** pour calculer automatiquement la completion du profil
- **Procédures stockées** pour le nettoyage des données
- **Vues** pour les statistiques utilisateur
- **Index optimisés** pour les performances

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=afro_dating

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/verify` - Vérifier le token

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil
- `GET /api/users/search` - Rechercher des utilisateurs
- `GET /api/users/:userId` - Voir un profil
- `DELETE /api/users/account` - Supprimer le compte

### Matching
- `POST /api/matches/like/:userId` - Liker un utilisateur
- `DELETE /api/matches/like/:userId` - Supprimer un like
- `GET /api/matches/matches` - Obtenir les matches
- `GET /api/matches/likes-received` - Likes reçus
- `POST /api/matches/block/:userId` - Bloquer un utilisateur

### Messages
- `POST /api/messages/send` - Envoyer un message
- `GET /api/messages/conversation/:userId` - Messages d'une conversation
- `GET /api/messages/conversations` - Toutes les conversations
- `PUT /api/messages/read/:userId` - Marquer comme lu

### Photos
- `POST /api/photos/upload` - Upload une photo
- `GET /api/photos/user/:userId` - Photos d'un utilisateur
- `PUT /api/photos/:photoId/primary` - Photo principale
- `DELETE /api/photos/:photoId` - Supprimer une photo

### Abonnements
- `GET /api/subscriptions/plans` - Plans disponibles
- `POST /api/subscriptions/create-checkout-session` - Créer une session de paiement
- `GET /api/subscriptions/current` - Abonnement actuel
- `POST /api/subscriptions/cancel` - Annuler l'abonnement

## 🔌 WebSocket Events

### Connexion
```javascript
// Côté client
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events Disponibles
- `send_message` - Envoyer un message
- `new_message` - Nouveau message reçu
- `typing` - Utilisateur en train d'écrire
- `user_online` - Utilisateur en ligne
- `user_offline` - Utilisateur hors ligne
- `messages_read` - Messages marqués comme lus

## 🛡️ Sécurité

- Authentification JWT
- Rate limiting (100 req/15min)
- Validation des données d'entrée
- Hashage des mots de passe (bcrypt)
- Protection CORS
- Helmet pour la sécurité des headers
- Validation des uploads d'images

## 📊 Fonctionnalités Premium

### Abonnement Premium
- Messages illimités
- Voir qui vous a liké
- Filtres de recherche avancés
- Boost de profil
- Pas de publicité

### Plans Disponibles
- **Premium Mensuel**: 19.99€/mois
- **Premium Annuel**: 199.99€/an (2 mois gratuits)

## 🔧 Administration

### Panel Admin
Accessible via `/api/admin/` avec authentification spéciale

### Fonctionnalités Admin
- Dashboard avec statistiques
- Gestion des utilisateurs
- Modération des signalements
- Suspension/activation des comptes
- Analytics et métriques

## 📈 Performance

### Optimisations
- Index de base de données optimisés
- Cache des requêtes fréquentes
- Compression gzip
- Limitation de taille des uploads
- Nettoyage automatique des données anciennes

### Monitoring
- Logs détaillés avec Morgan
- Métriques de performance
- Gestion des erreurs centralisée

## 🚀 Déploiement

### Variables de Production
```env
NODE_ENV=production
PORT=5000
# Autres variables...
```

### Commandes de Déploiement
```bash
# Build pour production
npm run build

# Démarrer en production
npm start
```

## 📞 Support

Pour toute question ou problème:
- Email: support@afroIntroductions.com
- Documentation: [Wiki du projet]

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

Développé avec ❤️ pour la communauté AfroIntroductions