const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Plans d'abonnement
const SUBSCRIPTION_PLANS = {
  premium_monthly: {
    name: 'Premium Mensuel',
    price: 19.99,
    currency: 'eur',
    interval: 'month',
    features: [
      'Messages illimités',
      'Voir qui vous a liké',
      'Boost de profil',
      'Filtres avancés',
      'Pas de publicité'
    ]
  },
  premium_yearly: {
    name: 'Premium Annuel',
    price: 199.99,
    currency: 'eur',
    interval: 'year',
    features: [
      'Messages illimités',
      'Voir qui vous a liké',
      'Boost de profil',
      'Filtres avancés',
      'Pas de publicité',
      '2 mois gratuits'
    ]
  }
};

// Obtenir les plans disponibles
router.get('/plans', (req, res) => {
  res.json({ plans: SUBSCRIPTION_PLANS });
});

// Créer une session de paiement
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({ message: 'Plan invalide' });
    }

    const planData = SUBSCRIPTION_PLANS[plan];

    // Récupérer les informations utilisateur
    const [user] = await db.execute(
      'SELECT email, first_name, last_name FROM users WHERE id = ?',
      [req.userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user[0].email,
      line_items: [
        {
          price_data: {
            currency: planData.currency,
            product_data: {
              name: planData.name,
              description: planData.features.join(', ')
            },
            unit_amount: Math.round(planData.price * 100),
            recurring: {
              interval: planData.interval
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: req.userId.toString(),
        plan: plan
      }
    });

    res.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Erreur création session:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Webhook Stripe
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erreur webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSubscriptionSuccess(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSuccess(invoice);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({received: true});

  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gérer le succès d'abonnement
async function handleSubscriptionSuccess(session) {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;
  const planData = SUBSCRIPTION_PLANS[plan];

  const expiresAt = new Date();
  if (planData.interval === 'month') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  await db.execute(
    `INSERT INTO subscriptions (user_id, stripe_subscription_id, plan_type, 
     status, current_period_start, current_period_end, created_at) 
     VALUES (?, ?, ?, 'active', NOW(), ?, NOW())
     ON DUPLICATE KEY UPDATE 
     stripe_subscription_id = VALUES(stripe_subscription_id),
     plan_type = VALUES(plan_type),
     status = VALUES(status),
     current_period_end = VALUES(current_period_end)`,
    [userId, session.subscription, plan, expiresAt]
  );

  // Mettre à jour le type d'abonnement de l'utilisateur
  await db.execute(
    'UPDATE users SET subscription_type = ? WHERE id = ?',
    [plan, userId]
  );
}

// Gérer le succès de paiement
async function handlePaymentSuccess(invoice) {
  const subscriptionId = invoice.subscription;
  
  // Récupérer l'abonnement depuis Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Mettre à jour la base de données
  await db.execute(
    `UPDATE subscriptions SET 
     current_period_start = FROM_UNIXTIME(?),
     current_period_end = FROM_UNIXTIME(?),
     status = 'active'
     WHERE stripe_subscription_id = ?`,
    [subscription.current_period_start, subscription.current_period_end, subscriptionId]
  );
}

// Gérer l'annulation d'abonnement
async function handleSubscriptionCanceled(subscription) {
  await db.execute(
    'UPDATE subscriptions SET status = "canceled" WHERE stripe_subscription_id = ?',
    [subscription.id]
  );

  // Remettre l'utilisateur en version gratuite
  const [userSub] = await db.execute(
    'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?',
    [subscription.id]
  );

  if (userSub.length > 0) {
    await db.execute(
      'UPDATE users SET subscription_type = "free" WHERE id = ?',
      [userSub[0].user_id]
    );
  }
}

// Obtenir l'abonnement actuel
router.get('/current', auth, async (req, res) => {
  try {
    const [subscription] = await db.execute(
      `SELECT s.*, u.subscription_type 
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = ? AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [req.userId]
    );

    if (subscription.length === 0) {
      return res.json({ 
        subscription: null,
        plan: 'free',
        features: ['Messages limités', 'Recherche de base']
      });
    }

    const sub = subscription[0];
    const planData = SUBSCRIPTION_PLANS[sub.plan_type];

    res.json({
      subscription: sub,
      plan: sub.plan_type,
      features: planData ? planData.features : []
    });

  } catch (error) {
    console.error('Erreur récupération abonnement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Annuler l'abonnement
router.post('/cancel', auth, async (req, res) => {
  try {
    const [subscription] = await db.execute(
      'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ? AND status = "active"',
      [req.userId]
    );

    if (subscription.length === 0) {
      return res.status(404).json({ message: 'Aucun abonnement actif trouvé' });
    }

    // Annuler dans Stripe
    await stripe.subscriptions.update(subscription[0].stripe_subscription_id, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Abonnement annulé, actif jusqu\'à la fin de la période' });

  } catch (error) {
    console.error('Erreur annulation abonnement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;