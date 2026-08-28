const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'active', 'past_due', 'canceled'],
    default: 'inactive'
  },
  subscriptionCurrentPeriodEnd: { type: Date, default: null },
  uploadsThisMonth: { type: Number, default: 0 },
  lastUploadReset: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.hasActiveSubscription = function () {
  return (
    this.subscriptionStatus === 'active' &&
    this.subscriptionCurrentPeriodEnd &&
    new Date(this.subscriptionCurrentPeriodEnd) > new Date()
  );
};

module.exports = mongoose.model('User', userSchema);
