const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id, expiresIn) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d' });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required' });

    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, subscriptionStatus: user.subscriptionStatus }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user._id, rememberMe ? '15d' : '1d');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      subscriptionStatus: req.user.subscriptionStatus,
      subscriptionCurrentPeriodEnd: req.user.subscriptionCurrentPeriodEnd,
      uploadsThisMonth: req.user.uploadsThisMonth,
      hasActiveSubscription: req.user.hasActiveSubscription()
    }
  });
});

// PUT /auth/me — update display name
router.put('/me', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });

    req.user.name = name.trim();
    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        subscriptionStatus: req.user.subscriptionStatus,
        subscriptionCurrentPeriodEnd: req.user.subscriptionCurrentPeriodEnd,
        uploadsThisMonth: req.user.uploadsThisMonth,
        hasActiveSubscription: req.user.hasActiveSubscription()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /auth/password — change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Current and new password are required' });
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'New password must be at least 8 characters' });

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
