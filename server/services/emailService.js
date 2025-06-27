const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Vérifier la configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Configuration email invalide:', error);
  } else {
    console.log('✅ Service email configuré');
  }
});

const emailService = {
  // Email de bienvenue
  sendWelcomeEmail: async (email, firstName) => {
    try {
      const mailOptions = {
        from: `"AfroIntroductions" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Bienvenue ${firstName} sur AfroIntroductions! 💕`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e91e63; text-align: center;">Bienvenue sur AfroIntroductions!</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2>Bonjour ${firstName}! 👋</h2>
              
              <p>Félicitations pour avoir rejoint la plus grande communauté de rencontres afro!</p>
              
              <h3>Vos prochaines étapes:</h3>
              <ul>
                <li>✅ <strong>Complétez votre profil</strong> - Ajoutez des photos et une bio attrayante</li>
                <li>🔍 <strong>Explorez les profils</strong> - Découvrez des personnes compatibles</li>
                <li>💬 <strong>Commencez à discuter</strong> - Envoyez des likes et créez des matches</li>
                <li>⭐ <strong>Passez Premium</strong> - Débloquez toutes les fonctionnalités</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/profile/edit" 
                   style="background: #e91e63; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold;">
                  Compléter mon profil
                </a>
              </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h4>💡 Conseil du jour</h4>
              <p>Les profils avec photos reçoivent 10x plus de matches. Ajoutez dès maintenant votre plus belle photo!</p>
            </div>
            
            <hr style="margin: 30px 0;">
            
            <div style="text-align: center; color: #6c757d; font-size: 14px;">
              <p>Besoin d'aide? Contactez-nous à support@afroIntroductions.com</p>
              <p>© 2024 AfroIntroductions. Tous droits réservés.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de bienvenue envoyé à ${email}`);

    } catch (error) {
      console.error('❌ Erreur envoi email bienvenue:', error);
    }
  },

  // Notification de nouveau match
  sendMatchNotification: async (userEmail, userName, matchName) => {
    try {
      const mailOptions = {
        from: `"AfroIntroductions" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `🎉 Nouveau match avec ${matchName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e91e63; text-align: center;">Nouveau Match! 🎉</h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 30px; border-radius: 15px; text-align: center;">
              <h2>Félicitations ${userName}!</h2>
              <p style="font-size: 18px;">Vous avez un nouveau match avec <strong>${matchName}</strong></p>
              
              <div style="margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/matches" 
                   style="background: white; color: #667eea; padding: 15px 30px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold;">
                  Voir le match
                </a>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center;">
              <p>N'attendez pas trop longtemps pour envoyer le premier message! 💌</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Notification match envoyée à ${userEmail}`);

    } catch (error) {
      console.error('❌ Erreur envoi notification match:', error);
    }
  },

  // Notification de nouveau message
  sendMessageNotification: async (userEmail, userName, senderName) => {
    try {
      const mailOptions = {
        from: `"AfroIntroductions" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `💬 Nouveau message de ${senderName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e91e63; text-align: center;">Nouveau Message! 💬</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
              <p>Bonjour ${userName},</p>
              <p><strong>${senderName}</strong> vous a envoyé un nouveau message!</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL}/messages" 
                   style="background: #e91e63; color: white; padding: 12px 25px; 
                          text-decoration: none; border-radius: 20px;">
                  Lire le message
                </a>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

    } catch (error) {
      console.error('❌ Erreur notification message:', error);
    }
  },

  // Email de réinitialisation de mot de passe
  sendPasswordReset: async (email, resetToken) => {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"AfroIntroductions" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e91e63;">Réinitialisation du mot de passe</h1>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #e91e63; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 25px;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px;">
              Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, 
              ignorez cet email.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

    } catch (error) {
      console.error('❌ Erreur email reset password:', error);
    }
  }
};

module.exports = emailService;