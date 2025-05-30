const pool = require('../db');
const Mood = require('../models/Mood');
const { Op } = require('sequelize');

exports.getAllMoods = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM moods');
  res.json(rows);
};

exports.addMood = async (req, res) => {
  const { label, emoji, color, backlight } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO moods (label, emoji, color, backlight) VALUES (?, ?, ?, ?)',
      [label, emoji, color, backlight]
    );
    res.json({ id: result.insertId, label, emoji, color, backlight });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addMoodEntry = async (req, res) => {
  try {
    const {
      label,
      emoji,
      healthStatus,
      gratitudeText,
      mcqAnswers
    } = req.body;

    const mood = await Mood.create({
      user_id: req.user.id,
      label,
      emoji,
      healthStatus,
      gratitudeText,
      mcqAnswers,
      entry_date: new Date()
    });

    res.status(201).json(mood);
  } catch (error) {
    console.error('Add mood entry error:', error);
    res.status(500).json({ error: 'Error adding mood entry' });
  }
};

exports.getMoodEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {
      user_id: req.user.id
    };

    if (startDate && endDate) {
      where.entry_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const entries = await Mood.findAll({
      where,
      order: [['entry_date', 'DESC']]
    });

    res.json(entries);
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Error fetching mood entries' });
  }
};

exports.getMoodStats = async (req, res) => {
  try {
    const entries = await Mood.findAll({
      where: {
        user_id: req.user.id,
        entry_date: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      attributes: ['label', 'emoji', 'entry_date']
    });

    const stats = entries.reduce((acc, entry) => {
      const date = entry.entry_date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        label: entry.label,
        emoji: entry.emoji
      });
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Error fetching mood statistics' });
  }
};