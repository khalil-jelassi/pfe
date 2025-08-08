import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Removed `role`
    
    // Check if username or email already exists
    if (await User.findOne({ username })) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create new user with default role "employé"
    const user = await User.create({ username, email, password, role: "employé" });


    res.status(201).json({
      success: true,
      user: { id: user._id, username, email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({ success: true, token, user: { id: user._id, username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user data', error: error.message });
  }
};

// Define routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', protect, getCurrentUser);

export default router;
