const express = require('express');
const router = express.Router();
const {addMoodEntry,getMoodEntries,getMoodStats,getAllMoods,getUserMoodEntries} = require('../controllers/mood');
const authMiddleware = require('../middleware/auth');

// Protect all mood routes
router.use(authMiddleware);

// Mood entry routes
router.post('/add', addMoodEntry);
router.get('/', getMoodEntries);
router.get('/stats', getMoodStats);
router.get('/:userId', getUserMoodEntries);
router.get('/get/all',getAllMoods)

module.exports = router;