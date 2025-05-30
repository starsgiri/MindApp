const express = require('express');
const router = express.Router();
const { addMoodEntry, getMoodEntries, getMoodStats } = require('../controllers/mood');
const authMiddleware = require('../middleware/auth');

// Protect all mood routes
router.use(authMiddleware);

// Mood entry routes
router.post('/', addMoodEntry);
router.get('/', getMoodEntries);
router.get('/stats', getMoodStats);

module.exports = router;