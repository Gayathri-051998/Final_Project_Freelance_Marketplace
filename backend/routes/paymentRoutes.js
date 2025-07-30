const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/authMiddleware');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { amount, success_url, cancel_url } = req.body;

    // ✅ Log for debugging
    console.log("💰 Received amount FROM FRONTEND :", amount);
    console.log("🔐 Authenticated user from JWT:", req.user); // protect middleware adds this

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const successUrl = success_url || 'https://dashing-bienenstitch-f7f9b5.netlify.app/success';
    const cancelUrl = cancel_url || 'https://dashing-bienenstitch-f7f9b5.netlify.app/cancel';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Freelance Contract Payment',
          },
          unit_amount: Math.floor(amount * 100), // Convert to cents and round
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // ✅ Always respond with session id
    return res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Stripe session creation failed:', error.message);
    return res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

module.exports = router;
