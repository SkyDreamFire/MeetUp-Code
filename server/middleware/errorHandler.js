const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur de validation Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'Fichier trop volumineux. Maximum 5MB autorisé.' 
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      message: 'Champ de fichier inattendu.' 
    });
  }

  // Erreur MySQL
  if (err.code && err.code.startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: 'Cette ressource existe déjà.' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Erreur de base de données.' 
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Token invalide.' 
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expiré.' 
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur interne.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;