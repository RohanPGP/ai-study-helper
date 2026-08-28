const router = require('express').Router();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// POST /payment/create-checkout-session
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    let customerId = req.user.stripeCustomerId;

    // Create or reuse Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user._id.toString() }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID, // $5/month price ID from Stripe dashboard
        quantity: 1
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment?canceled=true`,
      metadata: { userId: req.user._id.toString() }
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /payment/create-portal-session (manage subscription)
router.post('/create-portal-session', protect, async (req, res) => {
  try {
    if (!req.user.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal session error:', err);
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

// POST /payment/webhook (raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const updateSubscription = async (subscription) => {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const userId = customer.metadata?.userId;
    if (!userId) return;

    await User.findByIdAndUpdate(userId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
    });
  };

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await updateSubscription(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await updateSubscription({ ...event.data.object, status: 'canceled' });
        break;

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        if (customer.metadata?.userId) {
          await User.findByIdAndUpdate(customer.metadata.userId, {
            subscriptionStatus: 'past_due'
          });
        }
        break;
      }

      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /payment/subscription-status
router.get('/subscription-status', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    status: user.subscriptionStatus,
    currentPeriodEnd: user.subscriptionCurrentPeriodEnd,
    isActive: user.hasActiveSubscription()
  });
});

module.exports = router;
