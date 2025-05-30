const express = require('express');
const router = express.Router();
const { 
    addMoodEntry,
    getMoodEntries,
    getMcqStats,
    getGratitudeEntries
} = require('../controllers/entry');
const authMiddleware = require('../middleware/auth');

// Protect all entry routes
router.use(authMiddleware);

// Combined entry routes
router.post('/', addMoodEntry);
router.get('/user/:userId', getMoodEntries);

// MCQ specific routes
router.get('/mcq/stats/:userId', getMcqStats);

// Gratitude specific routes
router.get('/gratitude/:userId', getGratitudeEntries);

module.exports = router;