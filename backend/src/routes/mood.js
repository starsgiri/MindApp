const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood');

router.get('/', moodController.getAllMoods);
router.post('/', moodController.addMood); // For admin use

module.exports = router; 