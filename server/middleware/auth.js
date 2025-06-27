const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe et est actif
    const [user] = await db.execute(
      'SELECT id, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (user.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user[0].is_active) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    req.userId = decoded.userId;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    
    console.error('Erreur auth middleware:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = auth;