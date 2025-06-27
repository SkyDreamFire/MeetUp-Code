const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Connexion admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier les identifiants admin
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10));
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Connexion admin réussie' });

  } catch (error) {
    console.error('Erreur connexion admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les statistiques
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [activeUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    const [premiumUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE subscription_type != "free"');
    const [totalMatches] = await db.execute('SELECT COUNT(*) as count FROM matches');
    const [totalMessages] = await db.execute('SELECT COUNT(*) as count FROM messages');
    
    // Nouveaux utilisateurs cette semaine
    const [newUsersWeek] = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    // Revenus du mois
    const [monthlyRevenue] = await db.execute(
      `SELECT SUM(
        CASE 
          WHEN plan_type = 'premium_monthly' THEN 19.99
          WHEN plan_type = 'premium_yearly' THEN 199.99
          ELSE 0
        END
      ) as revenue
      FROM subscriptions 
      WHERE status = 'active' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    res.json({
      totalUsers: totalUsers[0].count,
      activeUsers: activeUsers[0].count,
      premiumUsers: premiumUsers[0].count,
      totalMatches: totalMatches[0].count,
      totalMessages: totalMessages[0].count,
      newUsersWeek: newUsersWeek[0].count,
      monthlyRevenue: monthlyRevenue[0].revenue || 0
    });

  } catch (error) {
    console.error('Erreur stats admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir la liste des utilisateurs
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (search) {
      whereClause = 'WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?';
      queryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const [users] = await db.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.age, u.city, u.country,
       u.subscription_type, u.is_active, u.is_verified, u.created_at, u.last_login,
       (SELECT COUNT(*) FROM user_photos WHERE user_id = u.id) as photo_count,
       (SELECT COUNT(*) FROM matches WHERE user1_id = u.id OR user2_id = u.id) as match_count
       FROM users u ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const [totalCount] = await db.execute(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      queryParams
    );

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].total,
        pages: Math.ceil(totalCount[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur liste utilisateurs admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Suspendre/Activer un utilisateur
router.put('/users/:userId/toggle-status', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const [user] = await db.execute(
      'SELECT is_active FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const newStatus = !user[0].is_active;

    await db.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [newStatus, userId]
    );

    res.json({ 
      message: `Utilisateur ${newStatus ? 'activé' : 'suspendu'}`,
      isActive: newStatus
    });

  } catch (error) {
    console.error('Erreur toggle status admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les signalements
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const [reports] = await db.execute(
      `SELECT r.*, 
       reporter.first_name as reporter_name,
       reported.first_name as reported_name,
       reported.email as reported_email
       FROM user_reports r
       JOIN users reporter ON r.reporter_id = reporter.id
       JOIN users reported ON r.reported_user_id = reported.id
       WHERE r.status = 'pending'
       ORDER BY r.created_at DESC`
    );

    res.json({ reports });

  } catch (error) {
    console.error('Erreur signalements admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Traiter un signalement
router.put('/reports/:reportId', adminAuth, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, notes } = req.body; // action: 'approved', 'rejected'

    await db.execute(
      'UPDATE user_reports SET status = ?, admin_notes = ?, resolved_at = NOW() WHERE id = ?',
      [action, notes, reportId]
    );

    res.json({ message: 'Signalement traité' });

  } catch (error) {
    console.error('Erreur traitement signalement admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;