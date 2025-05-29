const pool = require('../db');

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