const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Envoyer un message
router.post('/send', auth, [
  body('receiverId').isInt(),
  body('message').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, message } = req.body;
    const senderId = req.userId;

    if (receiverId == senderId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous envoyer un message' });
    }

    // Vérifier si c'est un match
    const [match] = await db.execute(
      'SELECT id FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [Math.min(senderId, receiverId), Math.max(senderId, receiverId), Math.max(senderId, receiverId), Math.min(senderId, receiverId)]
    );

    if (match.length === 0) {
      return res.status(403).json({ message: 'Vous devez être en match pour envoyer un message' });
    }

    // Vérifier si l'utilisateur est bloqué
    const [blocked] = await db.execute(
      'SELECT id FROM blocked_users WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)',
      [senderId, receiverId, receiverId, senderId]
    );

    if (blocked.length > 0) {
      return res.status(403).json({ message: 'Impossible d\'envoyer le message' });
    }

    // Envoyer le message
    const [result] = await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES (?, ?, ?, NOW())',
      [senderId, receiverId, message]
    );

    // Récupérer le message créé
    const [newMessage] = await db.execute(
      `SELECT m.*, u.first_name as sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Message envoyé',
      messageData: newMessage[0]
    });

  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les messages d'une conversation
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    // Vérifier si c'est un match
    const [match] = await db.execute(
      'SELECT id FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [Math.min(currentUserId, userId), Math.max(currentUserId, userId), Math.max(currentUserId, userId), Math.min(currentUserId, userId)]
    );

    if (match.length === 0) {
      return res.status(403).json({ message: 'Aucun match trouvé' });
    }

    // Récupérer les messages
    const [messages] = await db.execute(
      `SELECT m.*, 
       sender.first_name as sender_name,
       receiver.first_name as receiver_name
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [currentUserId, userId, userId, currentUserId, parseInt(limit), offset]
    );

    // Marquer les messages comme lus
    await db.execute(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [userId, currentUserId]
    );

    res.json({
      messages: messages.reverse(), // Inverser pour avoir les plus anciens en premier
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir toutes les conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const [conversations] = await db.execute(
      `SELECT DISTINCT
       CASE 
         WHEN m.sender_id = ? THEN m.receiver_id
         ELSE m.sender_id
       END as other_user_id,
       CASE 
         WHEN m.sender_id = ? THEN receiver.first_name
         ELSE sender.first_name
       END as other_user_name,
       CASE 
         WHEN m.sender_id = ? THEN receiver.age
         ELSE sender.age
       END as other_user_age,
       CASE 
         WHEN m.sender_id = ? THEN receiver.is_online
         ELSE sender.is_online
       END as other_user_online,
       CASE 
         WHEN m.sender_id = ? THEN receiver.last_seen
         ELSE sender.last_seen
       END as other_user_last_seen,
       CASE 
         WHEN m.sender_id = ? THEN (SELECT photo_url FROM user_photos WHERE user_id = receiver.id AND is_primary = 1 LIMIT 1)
         ELSE (SELECT photo_url FROM user_photos WHERE user_id = sender.id AND is_primary = 1 LIMIT 1)
       END as other_user_photo,
       m.message as last_message,
       m.created_at as last_message_date,
       m.sender_id = ? as sent_by_me,
       CASE WHEN m.sender_id != ? AND m.is_read = 0 THEN 1 ELSE 0 END as has_unread,
       (SELECT COUNT(*) FROM messages WHERE 
        sender_id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END 
        AND receiver_id = ? AND is_read = 0) as unread_count
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE m.sender_id = ? OR m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      Array(12).fill(req.userId).concat([req.userId, req.userId])
    );

    // Grouper par utilisateur et garder seulement le dernier message
    const uniqueConversations = [];
    const seenUsers = new Set();

    conversations.forEach(conv => {
      if (!seenUsers.has(conv.other_user_id)) {
        seenUsers.add(conv.other_user_id);
        uniqueConversations.push(conv);
      }
    });

    res.json({ conversations: uniqueConversations });

  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer les messages comme lus
router.put('/read/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    await db.execute(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [userId, currentUserId]
    );

    res.json({ message: 'Messages marqués comme lus' });

  } catch (error) {
    console.error('Erreur marquage lu:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un message
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    // Vérifier que l'utilisateur est le propriétaire du message
    const [message] = await db.execute(
      'SELECT sender_id FROM messages WHERE id = ?',
      [messageId]
    );

    if (message.length === 0) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    if (message[0].sender_id !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await db.execute(
      'DELETE FROM messages WHERE id = ?',
      [messageId]
    );

    res.json({ message: 'Message supprimé' });

  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;