const pool = require('../db');
const Mood = require('../models/Mood');
const { Op } = require('sequelize');

// Mood Entries
exports.addMoodEntry = async (req, res) => {
  try {
    const { label, emoji, healthStatus, gratitudeText, mcqAnswers } = req.body;

    const entry = await Mood.create({
      user_id: req.user.id,
      label,
      emoji,
      healthStatus,
      gratitudeText,
      mcqAnswers,
      entry_date: new Date(),
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Add entry error:', error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
};

exports.getMoodEntries = async (req, res) => {
  try {
    const entries = await Mood.findAll({
      where: {
        user_id: req.params.userId,
        [Op.not]: {
          mcqAnswers: null,
        },
      },
      order: [['entry_date', 'DESC']],
    });
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};

// MCQ specific operations
exports.getMcqStats = async (req, res) => {
  try {
    const entries = await Mood.findAll({
      where: {
        user_id: req.params.userId,
        mcqAnswers: {
          [Op.not]: null,
        },
      },
      attributes: ['mcqAnswers', 'entry_date'],
    });

    // Process MCQ statistics
    const stats = entries.reduce((acc, entry) => {
      const answers = entry.mcqAnswers;
      Object.keys(answers).forEach((question) => {
        if (!acc[question]) {
          acc[question] = {};
        }
        const answer = answers[question];
        acc[question][answer] = (acc[question][answer] || 0) + 1;
      });
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    console.error('Get MCQ stats error:', error);
    res.status(500).json({ error: 'Failed to fetch MCQ statistics' });
  }
};

// Gratitude specific operations
exports.getGratitudeEntries = async (req, res) => {
  try {
    const entries = await Mood.findAll({
      where: {
        user_id: req.params.userId,
        gratitudeText: {
          [Op.not]: null,
        },
      },
      attributes: ['gratitudeText', 'entry_date'],
      order: [['entry_date', 'DESC']],
    });
    res.json(entries);
  } catch (error) {
    console.error('Get gratitude entries error:', error);
    res.status(500).json({ error: 'Failed to fetch gratitude entries' });
  }
};