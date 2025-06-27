const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Liker un utilisateur
router.post('/like/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const likerId = req.userId;

    if (userId == likerId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous liker vous-même' });
    }

    // Vérifier si l'utilisateur existe
    const [targetUser] = await db.execute(
      'SELECT id FROM users WHERE id = ? AND is_active = 1',
      [userId]
    );

    if (targetUser.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si déjà liké
    const [existingLike] = await db.execute(
      'SELECT id FROM likes WHERE user_id = ? AND liked_user_id = ?',
      [likerId, userId]
    );

    if (existingLike.length > 0) {
      return res.status(400).json({ message: 'Déjà liké' });
    }

    // Créer le like
    await db.execute(
      'INSERT INTO likes (user_id, liked_user_id, created_at) VALUES (?, ?, NOW())',
      [likerId, userId]
    );

    // Vérifier si c'est un match mutuel
    const [mutualLike] = await db.execute(
      'SELECT id FROM likes WHERE user_id = ? AND liked_user_id = ?',
      [userId, likerId]
    );

    let isMatch = false;
    if (mutualLike.length > 0) {
      // Créer le match
      await db.execute(
        'INSERT INTO matches (user1_id, user2_id, matched_at) VALUES (?, ?, NOW())',
        [Math.min(likerId, userId), Math.max(likerId, userId)]
      );
      isMatch = true;
    }

    res.json({
      message: isMatch ? 'Match créé!' : 'Like envoyé',
      isMatch
    });

  } catch (error) {
    console.error('Erreur like:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un like
router.delete('/like/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const likerId = req.userId;

    await db.execute(
      'DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?',
      [likerId, userId]
    );

    // Supprimer le match s'il existe
    await db.execute(
      'DELETE FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [Math.min(likerId, userId), Math.max(likerId, userId), Math.max(likerId, userId), Math.min(likerId, userId)]
    );

    res.json({ message: 'Like supprimé' });

  } catch (error) {
    console.error('Erreur suppression like:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les matches
router.get('/matches', auth, async (req, res) => {
  try {
    const [matches] = await db.execute(
      `SELECT m.*, 
       CASE 
         WHEN m.user1_id = ? THEN u2.id
         ELSE u1.id
       END as match_user_id,
       CASE 
         WHEN m.user1_id = ? THEN u2.first_name
         ELSE u1.first_name
       END as match_name,
       CASE 
         WHEN m.user1_id = ? THEN u2.age
         ELSE u1.age
       END as match_age,
       CASE 
         WHEN m.user1_id = ? THEN u2.city
         ELSE u1.city
       END as match_city,
       CASE 
         WHEN m.user1_id = ? THEN u2.is_online
         ELSE u1.is_online
       END as match_is_online,
       CASE 
         WHEN m.user1_id = ? THEN u2.last_seen
         ELSE u1.last_seen
       END as match_last_seen,
       CASE 
         WHEN m.user1_id = ? THEN (SELECT photo_url FROM user_photos WHERE user_id = u2.id AND is_primary = 1 LIMIT 1)
         ELSE (SELECT photo_url FROM user_photos WHERE user_id = u1.id AND is_primary = 1 LIMIT 1)
       END as match_photo,
       (SELECT message FROM messages WHERE 
        ((sender_id = ? AND receiver_id = CASE WHEN m.user1_id = ? THEN u2.id ELSE u1.id END) OR
         (sender_id = CASE WHEN m.user1_id = ? THEN u2.id ELSE u1.id END AND receiver_id = ?))
        ORDER BY created_at DESC LIMIT 1) as last_message,
       (SELECT created_at FROM messages WHERE 
        ((sender_id = ? AND receiver_id = CASE WHEN m.user1_id = ? THEN u2.id ELSE u1.id END) OR
         (sender_id = CASE WHEN m.user1_id = ? THEN u2.id ELSE u1.id END AND receiver_id = ?))
        ORDER BY created_at DESC LIMIT 1) as last_message_date
       FROM matches m
       JOIN users u1 ON m.user1_id = u1.id
       JOIN users u2 ON m.user2_id = u2.id
       WHERE (m.user1_id = ? OR m.user2_id = ?)
       ORDER BY m.matched_at DESC`,
      Array(16).fill(req.userId).concat([req.userId, req.userId])
    );

    res.json({ matches });

  } catch (error) {
    console.error('Erreur récupération matches:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les likes reçus
router.get('/likes-received', auth, async (req, res) => {
  try {
    const [likes] = await db.execute(
      `SELECT l.*, u.id as user_id, u.first_name, u.age, u.city, u.country,
       u.is_online, u.last_seen,
       (SELECT photo_url FROM user_photos WHERE user_id = u.id AND is_primary = 1 LIMIT 1) as primary_photo
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.liked_user_id = ?
       ORDER BY l.created_at DESC`,
      [req.userId]
    );

    res.json({ likes });

  } catch (error) {
    console.error('Erreur likes reçus:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Bloquer un utilisateur
router.post('/block/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const blockerId = req.userId;

    if (userId == blockerId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous bloquer vous-même' });
    }

    // Vérifier si déjà bloqué
    const [existingBlock] = await db.execute(
      'SELECT id FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
      [blockerId, userId]
    );

    if (existingBlock.length > 0) {
      return res.status(400).json({ message: 'Utilisateur déjà bloqué' });
    }

    // Bloquer l'utilisateur
    await db.execute(
      'INSERT INTO blocked_users (blocker_id, blocked_id, blocked_at) VALUES (?, ?, NOW())',
      [blockerId, userId]
    );

    // Supprimer les likes et matches existants
    await db.execute(
      'DELETE FROM likes WHERE (user_id = ? AND liked_user_id = ?) OR (user_id = ? AND liked_user_id = ?)',
      [blockerId, userId, userId, blockerId]
    );

    await db.execute(
      'DELETE FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [Math.min(blockerId, userId), Math.max(blockerId, userId), Math.max(blockerId, userId), Math.min(blockerId, userId)]
    );

    res.json({ message: 'Utilisateur bloqué' });

  } catch (error) {
    console.error('Erreur blocage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Débloquer un utilisateur
router.delete('/block/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const blockerId = req.userId;

    await db.execute(
      'DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
      [blockerId, userId]
    );

    res.json({ message: 'Utilisateur débloqué' });

  } catch (error) {
    console.error('Erreur déblocage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les utilisateurs bloqués
router.get('/blocked', auth, async (req, res) => {
  try {
    const [blockedUsers] = await db.execute(
      `SELECT b.*, u.first_name, u.age, u.city
       FROM blocked_users b
       JOIN users u ON b.blocked_id = u.id
       WHERE b.blocker_id = ?
       ORDER BY b.blocked_at DESC`,
      [req.userId]
    );

    res.json({ blockedUsers });

  } catch (error) {
    console.error('Erreur utilisateurs bloqués:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;