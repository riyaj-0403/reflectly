const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (userId) =>
  jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hashed });

    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[register]', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[login]', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('[getMe]', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
