const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Stockage des utilisateurs connectés
const connectedUsers = new Map();

const socketHandler = (io) => {
  
  // Middleware d'authentification Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token manquant'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Vérifier l'utilisateur
      const [user] = await db.execute(
        'SELECT id, first_name FROM users WHERE id = ? AND is_active = 1',
        [decoded.userId]
      );

      if (user.length === 0) {
        return next(new Error('Utilisateur non trouvé'));
      }

      socket.userId = decoded.userId;
      socket.user = user[0];
      next();

    } catch (error) {
      next(new Error('Authentification échouée'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`Utilisateur connecté: ${socket.user.first_name} (${socket.userId})`);
    
    // Stocker la connexion
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date()
    });

    // Marquer l'utilisateur comme en ligne
    await db.execute(
      'UPDATE users SET is_online = 1, last_seen = NOW() WHERE id = ?',
      [socket.userId]
    );

    // Rejoindre les salles de conversation
    const [matches] = await db.execute(
      'SELECT user1_id, user2_id FROM matches WHERE user1_id = ? OR user2_id = ?',
      [socket.userId, socket.userId]
    );

    matches.forEach(match => {
      const roomId = `conversation_${Math.min(match.user1_id, match.user2_id)}_${Math.max(match.user1_id, match.user2_id)}`;
      socket.join(roomId);
    });

    // Écouter les événements

    // Envoi de message
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, message } = data;
        
        // Vérifier si c'est un match
        const [match] = await db.execute(
          'SELECT id FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
          [Math.min(socket.userId, receiverId), Math.max(socket.userId, receiverId), 
           Math.max(socket.userId, receiverId), Math.min(socket.userId, receiverId)]
        );

        if (match.length === 0) {
          socket.emit('error', { message: 'Aucun match trouvé' });
          return;
        }

        // Sauvegarder le message
        const [result] = await db.execute(
          'INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES (?, ?, ?, NOW())',
          [socket.userId, receiverId, message]
        );

        const messageData = {
          id: result.insertId,
          senderId: socket.userId,
          receiverId: receiverId,
          message: message,
          createdAt: new Date(),
          senderName: socket.user.first_name
        };

        // Envoyer le message à la salle de conversation
        const roomId = `conversation_${Math.min(socket.userId, receiverId)}_${Math.max(socket.userId, receiverId)}`;
        io.to(roomId).emit('new_message', messageData);

        // Notification push si l'utilisateur n'est pas en ligne
        const receiverConnection = connectedUsers.get(receiverId);
        if (!receiverConnection) {
          // Ici vous pouvez ajouter la logique de notification push
        }

      } catch (error) {
        console.error('Erreur envoi message socket:', error);
        socket.emit('error', { message: 'Erreur envoi message' });
      }
    });

    // Notification de frappe
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const roomId = `conversation_${Math.min(socket.userId, receiverId)}_${Math.max(socket.userId, receiverId)}`;
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.first_name
      });
    });

    // Arrêt de frappe
    socket.on('stop_typing', (data) => {
      const { receiverId } = data;
      const roomId = `conversation_${Math.min(socket.userId, receiverId)}_${Math.max(socket.userId, receiverId)}`;
      socket.to(roomId).emit('user_stop_typing', {
        userId: socket.userId
      });
    });

    // Marquer les messages comme lus
    socket.on('mark_messages_read', async (data) => {
      try {
        const { senderId } = data;
        
        await db.execute(
          'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
          [senderId, socket.userId]
        );

        // Notifier l'expéditeur
        const senderConnection = connectedUsers.get(senderId);
        if (senderConnection) {
          io.to(senderConnection.socketId).emit('messages_read', {
            readBy: socket.userId
          });
        }

      } catch (error) {
        console.error('Erreur marquer messages lus:', error);
      }
    });

    // Déconnexion
    socket.on('disconnect', async () => {
      console.log(`Utilisateur déconnecté: ${socket.user.first_name} (${socket.userId})`);
      
      // Supprimer de la liste des connectés
      connectedUsers.delete(socket.userId);

      // Marquer comme hors ligne
      await db.execute(
        'UPDATE users SET is_online = 0, last_seen = NOW() WHERE id = ?',
        [socket.userId]
      );

      // Notifier les matches de la déconnexion
      const [matches] = await db.execute(
        'SELECT user1_id, user2_id FROM matches WHERE user1_id = ? OR user2_id = ?',
        [socket.userId, socket.userId]
      );

      matches.forEach(match => {
        const otherUserId = match.user1_id === socket.userId ? match.user2_id : match.user1_id;
        const otherUserConnection = connectedUsers.get(otherUserId);
        
        if (otherUserConnection) {
          io.to(otherUserConnection.socketId).emit('user_offline', {
            userId: socket.userId
          });
        }
      });
    });

    // Notifier les matches de la connexion
    const [userMatches] = await db.execute(
      'SELECT user1_id, user2_id FROM matches WHERE user1_id = ? OR user2_id = ?',
      [socket.userId, socket.userId]
    );

    userMatches.forEach(match => {
      const otherUserId = match.user1_id === socket.userId ? match.user2_id : match.user1_id;
      const otherUserConnection = connectedUsers.get(otherUserId);
      
      if (otherUserConnection) {
        io.to(otherUserConnection.socketId).emit('user_online', {
          userId: socket.userId,
          userName: socket.user.first_name
        });
      }
    });
  });

  // Fonction utilitaire pour obtenir les utilisateurs en ligne
  io.getConnectedUsers = () => {
    return Array.from(connectedUsers.values()).map(conn => ({
      userId: conn.user.id,
      userName: conn.user.first_name,
      lastSeen: conn.lastSeen
    }));
  };
};

module.exports = socketHandler;