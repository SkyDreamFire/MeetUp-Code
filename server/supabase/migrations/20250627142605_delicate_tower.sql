
-- Création de la base de données et des tables

CREATE DATABASE IF NOT EXISTS afro_dating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE afro_dating;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    looking_for ENUM('male', 'female', 'both') NOT NULL,
    
    -- Informations de localisation
    country VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Informations de profil
    bio TEXT,
    height INT, -- en cm
    weight INT, -- en kg
    occupation VARCHAR(150),
    education ENUM('high_school', 'bachelor', 'master', 'phd', 'other'),
    religion VARCHAR(50),
    smoking ENUM('never', 'occasionally', 'regularly'),
    drinking ENUM('never', 'occasionally', 'regularly'),
    children ENUM('none', 'have_some', 'want_some', 'dont_want'),
    interests JSON,
    languages JSON,
    
    -- Statuts et métadonnées
    is_active BOOLEAN DEFAULT 1,
    is_verified BOOLEAN DEFAULT 0,
    is_online BOOLEAN DEFAULT 0,
    subscription_type ENUM('free', 'premium_monthly', 'premium_yearly') DEFAULT 'free',
    profile_completion_percentage INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    last_seen TIMESTAMP NULL,
    
    INDEX idx_gender_looking_for (gender, looking_for),
    INDEX idx_location (country, city),
    INDEX idx_age (age),
    INDEX idx_last_seen (last_seen),
    INDEX idx_is_active (is_active)
);

-- Table des photos des utilisateurs
CREATE TABLE user_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    cloudinary_id VARCHAR(200),
    is_primary BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_primary (user_id, is_primary)
);

-- Table des likes
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    liked_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (liked_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, liked_user_id),
    INDEX idx_liked_user (liked_user_id),
    INDEX idx_created_at (created_at)
);

-- Table des matches
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_match (user1_id, user2_id),
    INDEX idx_user1 (user1_id),
    INDEX idx_user2 (user2_id),
    INDEX idx_matched_at (matched_at),
    
    -- S'assurer que user1_id < user2_id pour éviter les doublons
    CONSTRAINT chk_users_order CHECK (user1_id < user2_id)
);

-- Table des messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (sender_id, receiver_id, created_at),
    INDEX idx_receiver_unread (receiver_id, is_read),
    INDEX idx_created_at (created_at)
);

-- Table des utilisateurs bloqués
CREATE TABLE blocked_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blocker_id INT NOT NULL,
    blocked_id INT NOT NULL,
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_block (blocker_id, blocked_id),
    INDEX idx_blocker (blocker_id),
    INDEX idx_blocked (blocked_id)
);

-- Table des vues de profil
CREATE TABLE profile_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    viewer_id INT NOT NULL,
    viewed_user_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (viewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_view (viewer_id, viewed_user_id),
    INDEX idx_viewed_user (viewed_user_id),
    INDEX idx_viewed_at (viewed_at)
);

-- Table des abonnements
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stripe_subscription_id VARCHAR(200),
    plan_type ENUM('premium_monthly', 'premium_yearly') NOT NULL,
    status ENUM('active', 'canceled', 'past_due', 'unpaid') DEFAULT 'active',
    current_period_start TIMESTAMP NULL,
    current_period_end TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_subscription (user_id),
    INDEX idx_status (status),
    INDEX idx_period_end (current_period_end)
);

-- Table des signalements d'utilisateurs
CREATE TABLE user_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_user_id INT NOT NULL,
    reason ENUM('inappropriate_content', 'fake_profile', 'harassment', 'spam', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_reported_user (reported_user_id),
    INDEX idx_created_at (created_at)
);

-- Table des notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('new_match', 'new_message', 'profile_view', 'like_received') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_user_id INT,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created_at (created_at)
);

-- Table des tokens de réinitialisation de mot de passe
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
);

-- Table des boosters de profil (feature premium)
CREATE TABLE profile_boosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    boost_type ENUM('location', 'global') DEFAULT 'local',
    duration_hours INT DEFAULT 24,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_expires_at (expires_at)
);

-- Table des logs d'activité (pour analytics)
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_action (user_id, action),
    INDEX idx_created_at (created_at)
);

-- Procédures stockées et triggers

-- Trigger pour mettre à jour le pourcentage de completion du profil
DELIMITER $$
CREATE TRIGGER update_profile_completion 
AFTER UPDATE ON users 
FOR EACH ROW 
BEGIN
    DECLARE completion_percentage INT DEFAULT 0;
    
    -- Calculer le pourcentage basé sur les champs remplis
    IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN
        SET completion_percentage = completion_percentage + 20;
    END IF;
    
    IF NEW.occupation IS NOT NULL AND NEW.occupation != '' THEN
        SET completion_percentage = completion_percentage + 15;
    END IF;
    
    IF NEW.education IS NOT NULL THEN
        SET completion_percentage = completion_percentage + 10;
    END IF;
    
    IF NEW.height IS NOT NULL AND NEW.weight IS NOT NULL THEN
        SET completion_percentage = completion_percentage + 10;
    END IF;
    
    IF NEW.interests IS NOT NULL THEN
        SET completion_percentage = completion_percentage + 15;
    END IF;
    
    -- Vérifier s'il y a des photos
    IF (SELECT COUNT(*) FROM user_photos WHERE user_id = NEW.id) > 0 THEN
        SET completion_percentage = completion_percentage + 30;
    END IF;
    
    -- Mettre à jour le pourcentage
    UPDATE users SET profile_completion_percentage = completion_percentage WHERE id = NEW.id;
END$$
DELIMITER ;

-- Procédure pour nettoyer les anciennes données
DELIMITER $$
CREATE PROCEDURE CleanOldData()
BEGIN
    -- Supprimer les anciens tokens expirés
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used = 1;
    
    -- Supprimer les anciennes notifications (plus de 30 jours)
    DELETE FROM notifications 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    -- Supprimer les anciens logs d'activité (plus de 90 jours)
    DELETE FROM activity_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    -- Désactiver les anciens boosts expirés
    UPDATE profile_boosts 
    SET is_active = 0 
    WHERE expires_at < NOW() AND is_active = 1;
END$$
DELIMITER ;

-- Fonction pour calculer la distance entre deux points
DELIMITER $$
CREATE FUNCTION calculate_distance(lat1 DECIMAL(10,8), lon1 DECIMAL(11,8), lat2 DECIMAL(10,8), lon2 DECIMAL(11,8))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE distance DECIMAL(10,2);
    SET distance = (
        6371 * ACOS(
            COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * COS(RADIANS(lon2) - RADIANS(lon1)) +
            SIN(RADIANS(lat1)) * SIN(RADIANS(lat2))
        )
    );
    RETURN distance;
END$$
DELIMITER ;

-- Création d'un événement pour nettoyer automatiquement les données
CREATE EVENT IF NOT EXISTS daily_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL CleanOldData();

-- Données de test (optionnel)
INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth, age, gender, looking_for, country, city, bio) VALUES
('admin@afroIntroductions.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLKNuXKKyJnNLsW', 'Admin', 'User', '1990-01-01', 34, 'male', 'female', 'France', 'Paris', 'Administrateur du site'),
('user1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLKNuXKKyJnNLsW', 'Amélie', 'Dubois', '1995-03-15', 29, 'female', 'male', 'France', 'Lyon', 'Passionnée de voyages et de découvertes culturelles'),
('user2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLKNuXKKyJnNLsW', 'Jean', 'Martin', '1988-07-22', 36, 'male', 'female', 'France', 'Marseille', 'Entrepreneur passionné de tech et de sport');

-- Index pour améliorer les performances
CREATE INDEX idx_users_search ON users (gender, looking_for, age, country, is_active);
CREATE INDEX idx_messages_conversation ON messages (sender_id, receiver_id, created_at);
CREATE INDEX idx_likes_user_date ON likes (user_id, created_at);
CREATE INDEX idx_matches_users ON matches (user1_id, user2_id, matched_at);

-- Vues pour faciliter les requêtes communes
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.subscription_type,
    u.created_at,
    COALESCE(photo_count, 0) as photo_count,
    COALESCE(likes_sent, 0) as likes_sent,
    COALESCE(likes_received, 0) as likes_received,
    COALESCE(match_count, 0) as match_count,
    COALESCE(message_count, 0) as message_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as photo_count 
    FROM user_photos 
    GROUP BY user_id
) p ON u.id = p.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as likes_sent 
    FROM likes 
    GROUP BY user_id
) ls ON u.id = ls.user_id
LEFT JOIN (
    SELECT liked_user_id, COUNT(*) as likes_received 
    FROM likes 
    GROUP BY liked_user_id
) lr ON u.id = lr.liked_user_id
LEFT JOIN (
    SELECT user1_id as user_id, COUNT(*) as match_count 
    FROM matches 
    GROUP BY user1_id
    UNION ALL
    SELECT user2_id as user_id, COUNT(*) as match_count 
    FROM matches 
    GROUP BY user2_id
) m ON u.id = m.user_id
LEFT JOIN (
    SELECT sender_id as user_id, COUNT(*) as message_count 
    FROM messages 
    GROUP BY sender_id
) msg ON u.id = msg.user_id;

COMMIT;