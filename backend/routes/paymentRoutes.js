const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/authMiddleware');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', protect, async (req, res) => {
    try {
        const { amount, success_url, cancel_url } = req.body;
        console.log("💰 Amount:", amount);
        console.log("✅ Success URL:", success_url);
        console.log("❌ Cancel URL:", cancel_url);
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
          }
    
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Freelance Contract Payment',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url,
          cancel_url,
        });
    
      
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Stripe session creation failed:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

module.exports = router;
