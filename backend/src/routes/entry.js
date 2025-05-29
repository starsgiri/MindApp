const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entry');

// Mood entries
router.post('/mood', entryController.addMoodEntry);
router.get('/mood/:userId', entryController.getMoodEntries);

// MCQ entries
router.post('/mcq', entryController.addMcqEntry);
router.get('/mcq/:userId', entryController.getMcqEntries);

// Gratitude entries
router.post('/gratitude', entryController.addGratitudeEntry);
router.get('/gratitude/:userId', entryController.getGratitudeEntries);

module.exports = router; 