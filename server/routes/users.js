const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtenir le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT u.*, 
       (SELECT COUNT(*) FROM user_photos WHERE user_id = u.id) as photo_count,
       (SELECT COUNT(*) FROM likes WHERE liked_user_id = u.id) as likes_received,
       (SELECT COUNT(*) FROM profile_views WHERE viewed_user_id = u.id) as profile_views
       FROM users u WHERE u.id = ?`,
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = users[0];
    delete user.password_hash;

    res.json({ user });
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le profil
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ max: 1000 }),
  body('height').optional().isInt({ min: 100, max: 250 }),
  body('weight').optional().isInt({ min: 30, max: 300 }),
  body('occupation').optional().trim().isLength({ max: 100 }),
  body('education').optional().isIn(['high_school', 'bachelor', 'master', 'phd', 'other']),
  body('religion').optional().trim().isLength({ max: 50 }),
  body('smoking').optional().isIn(['never', 'occasionally', 'regularly']),
  body('drinking').optional().isIn(['never', 'occasionally', 'regularly']),
  body('children').optional().isIn(['none', 'have_some', 'want_some', 'dont_want']),
  body('languages').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedFields = [
      'first_name', 'last_name', 'bio', 'height', 'weight', 
      'occupation', 'education', 'religion', 'smoking', 
      'drinking', 'children', 'interests'
    ];

    const updateFields = [];
    const values = [];

    Object.keys(req.body).forEach(key => {
      const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbField)) {
        updateFields.push(`${dbField} = ?`);
        values.push(req.body[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide à mettre à jour' });
    }

    values.push(req.userId);

    await db.execute(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Obtenir le profil mis à jour
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.userId]
    );

    const user = users[0];
    delete user.password_hash;

    res.json({ 
      message: 'Profil mis à jour',
      user 
    });

  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Rechercher des utilisateurs
router.get('/search', auth, async (req, res) => {
  try {
    const {
      minAge = 18,
      maxAge = 99,
      country,
      city,
      education,
      religion,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;

    // Récupérer les préférences de l'utilisateur actuel
    const [currentUser] = await db.execute(
      'SELECT looking_for, gender FROM users WHERE id = ?',
      [req.userId]
    );

    if (currentUser.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    let genderFilter = '';
    if (currentUser[0].looking_for !== 'both') {
      genderFilter = 'AND u.gender = ?';
    }

    const conditions = [
      'u.id != ?',
      'u.is_active = 1',
      'u.age BETWEEN ? AND ?'
    ];

    const queryParams = [req.userId, minAge, maxAge];

    if (genderFilter) {
      conditions.push(genderFilter.replace('AND ', ''));
      queryParams.push(currentUser[0].looking_for);
    }

    if (country) {
      conditions.push('u.country = ?');
      queryParams.push(country);
    }

    if (city) {
      conditions.push('u.city = ?');
      queryParams.push(city);
    }

    if (education) {
      conditions.push('u.education = ?');
      queryParams.push(education);
    }

    if (religion) {
      conditions.push('u.religion = ?');
      queryParams.push(religion);
    }

    queryParams.push(parseInt(limit), offset);

    const [users] = await db.execute(
      `SELECT u.id, u.first_name, u.age, u.city, u.country, u.bio, 
       u.occupation, u.education, u.last_seen, u.is_online,
       (SELECT photo_url FROM user_photos WHERE user_id = u.id AND is_primary = 1 LIMIT 1) as primary_photo,
       (SELECT COUNT(*) FROM user_photos WHERE user_id = u.id) as photo_count
       FROM users u 
       WHERE ${conditions.join(' AND ')}
       ORDER BY u.last_seen DESC
       LIMIT ? OFFSET ?`,
      queryParams
    );

    // Compter le total
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM users u WHERE ${conditions.slice(0, -2).join(' AND ')}`,
      queryParams.slice(0, -2)
    );

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Voir un profil utilisateur
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Vérifier si l'utilisateur est bloqué
    const [blocked] = await db.execute(
      'SELECT id FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
      [userId, req.userId]
    );

    if (blocked.length > 0) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const [users] = await db.execute(
      `SELECT u.id, u.first_name, u.age, u.city, u.country, u.bio,
       u.height, u.occupation, u.education, u.religion, u.smoking,
       u.drinking, u.children, u.interests, u.last_seen, u.is_online,
       u.created_at
       FROM users u WHERE u.id = ? AND u.is_active = 1`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Récupérer les photos
    const [photos] = await db.execute(
      'SELECT photo_url, is_primary FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC',
      [userId]
    );

    // Enregistrer la vue du profil
    if (userId != req.userId) {
      await db.execute(
        'INSERT INTO profile_views (viewer_id, viewed_user_id, viewed_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE viewed_at = NOW()',
        [req.userId, userId]
      );
    }

    const user = {
      ...users[0],
      photos
    };

    res.json({ user });

  } catch (error) {
    console.error('Erreur vue profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer le compte
router.delete('/account', auth, async (req, res) => {
  try {
    // Commencer une transaction
    await db.execute('START TRANSACTION');

    try {
      // Supprimer toutes les données liées
      await db.execute('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [req.userId, req.userId]);
      await db.execute('DELETE FROM likes WHERE user_id = ? OR liked_user_id = ?', [req.userId, req.userId]);
      await db.execute('DELETE FROM matches WHERE user1_id = ? OR user2_id = ?', [req.userId, req.userId]);
      await db.execute('DELETE FROM blocked_users WHERE blocker_id = ? OR blocked_id = ?', [req.userId, req.userId]);
      await db.execute('DELETE FROM profile_views WHERE viewer_id = ? OR viewed_user_id = ?', [req.userId, req.userId]);
      await db.execute('DELETE FROM user_photos WHERE user_id = ?', [req.userId]);
      await db.execute('DELETE FROM subscriptions WHERE user_id = ?', [req.userId]);
      await db.execute('DELETE FROM users WHERE id = ?', [req.userId]);

      await db.execute('COMMIT');

      res.json({ message: 'Compte supprimé avec succès' });

    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Erreur suppression compte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;