const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration Multer pour l'upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

// Upload d'une photo
router.post('/upload', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    // Vérifier le nombre de photos existantes
    const [photoCount] = await db.execute(
      'SELECT COUNT(*) as count FROM user_photos WHERE user_id = ?',
      [req.userId]
    );

    if (photoCount[0].count >= 6) {
      return res.status(400).json({ message: 'Maximum 6 photos autorisées' });
    }

    // Upload vers Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'afro-dating/users',
          public_id: `user_${req.userId}_${Date.now()}`,
          transformation: [
            { width: 800, height: 800, crop: 'fill', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Déterminer si c'est la photo principale
    const isPrimary = photoCount[0].count === 0;

    // Sauvegarder dans la base de données
    const [result] = await db.execute(
      'INSERT INTO user_photos (user_id, photo_url, cloudinary_id, is_primary, created_at) VALUES (?, ?, ?, ?, NOW())',
      [req.userId, uploadResult.secure_url, uploadResult.public_id, isPrimary]
    );

    res.status(201).json({
      message: 'Photo uploadée avec succès',
      photo: {
        id: result.insertId,
        url: uploadResult.secure_url,
        isPrimary
      }
    });

  } catch (error) {
    console.error('Erreur upload photo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les photos d'un utilisateur
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const [photos] = await db.execute(
      'SELECT id, photo_url, is_primary, created_at FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC',
      [userId]
    );

    res.json({ photos });

  } catch (error) {
    console.error('Erreur récupération photos:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Définir une photo comme principale
router.put('/:photoId/primary', auth, async (req, res) => {
  try {
    const { photoId } = req.params;

    // Vérifier que la photo appartient à l'utilisateur
    const [photo] = await db.execute(
      'SELECT user_id FROM user_photos WHERE id = ?',
      [photoId]
    );

    if (photo.length === 0) {
      return res.status(404).json({ message: 'Photo non trouvée' });
    }

    if (photo[0].user_id !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Commencer une transaction
    await db.execute('START TRANSACTION');

    try {
      // Retirer le statut principal des autres photos
      await db.execute(
        'UPDATE user_photos SET is_primary = 0 WHERE user_id = ?',
        [req.userId]
      );

      // Définir cette photo comme principale
      await db.execute(
        'UPDATE user_photos SET is_primary = 1 WHERE id = ?',
        [photoId]
      );

      await db.execute('COMMIT');

      res.json({ message: 'Photo principale mise à jour' });

    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Erreur photo principale:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une photo
router.delete('/:photoId', auth, async (req, res) => {
  try {
    const { photoId } = req.params;

    // Récupérer les informations de la photo
    const [photo] = await db.execute(
      'SELECT user_id, cloudinary_id, is_primary FROM user_photos WHERE id = ?',
      [photoId]
    );

    if (photo.length === 0) {
      return res.status(404).json({ message: 'Photo non trouvée' });
    }

    if (photo[0].user_id !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Supprimer de Cloudinary
    if (photo[0].cloudinary_id) {
      await cloudinary.uploader.destroy(photo[0].cloudinary_id);
    }

    // Supprimer de la base de données
    await db.execute(
      'DELETE FROM user_photos WHERE id = ?',
      [photoId]
    );

    // Si c'était la photo principale, définir une autre comme principale
    if (photo[0].is_primary) {
      await db.execute(
        'UPDATE user_photos SET is_primary = 1 WHERE user_id = ? ORDER BY created_at ASC LIMIT 1',
        [req.userId]
      );
    }

    res.json({ message: 'Photo supprimée' });

  } catch (error) {
    console.error('Erreur suppression photo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir mes photos
router.get('/my-photos', auth, async (req, res) => {
  try {
    const [photos] = await db.execute(
      'SELECT id, photo_url, is_primary, created_at FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC',
      [req.userId]
    );

    res.json({ photos });

  } catch (error) {
    console.error('Erreur mes photos:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;