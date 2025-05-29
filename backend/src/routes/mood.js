const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Mood = require('../models/Mood');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('User not found for id:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Please authenticate', error: error.message });
  }
};

// Add new mood entry
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received mood entry request:', {
      userId: req.user.id,
      body: req.body
    });

    const { mood, emoji, note } = req.body;
    
    if (!mood || !emoji) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['mood', 'emoji'],
        received: { mood, emoji, note }
      });
    }

    const moodEntry = await Mood.create({
      userId: req.user.id,
      mood,
      emoji,
      note: note || null
    });

    console.log('Created mood entry:', moodEntry.toJSON());
    res.status(201).json(moodEntry);
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({ 
      message: 'Error creating mood entry', 
      error: error.message,
      details: error.stack
    });
  }
});

// Get user's mood history
router.get('/history', auth, async (req, res) => {
  try {
    console.log('Fetching mood history for user:', req.user.id);
    
    const moods = await Mood.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 30
    });

    console.log(`Found ${moods.length} mood entries`);
    res.json(moods);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ 
      message: 'Error fetching mood history',
      error: error.message
    });
  }
});

// Get mood statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const moods = await Mood.findAll({
      where: { userId: req.user.id },
      attributes: ['mood', 'emoji', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // Group moods by date
    const moodStats = moods.reduce((acc, mood) => {
      const date = mood.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        mood: mood.mood,
        emoji: mood.emoji,
        time: mood.createdAt
      });
      return acc;
    }, {});

    res.json(moodStats);
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    res.status(500).json({ message: 'Error fetching mood statistics' });
  }
});

module.exports = router; 