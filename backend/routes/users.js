const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

/**
 * POST /api/users/create
 * Create or retrieve user profile
 */
router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    const userId = uuidv4();
    
    const user = new User({ userId, name: name || 'Student' });
    await user.save();
    
    res.json({ userId: user.userId, name: user.name });
  } catch (err) {
    // If DB unavailable, generate a client-side userId
    res.json({ userId: uuidv4(), name: req.body.name || 'Student' });
  }
});

/**
 * GET /api/users/:userId
 */
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
