const pool = require('../db');

// Mood Entries
exports.addMoodEntry = async (req, res) => {
  const { user_id, mood_id, entry_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO user_mood_entries (user_id, mood_id, entry_date) VALUES (?, ?, ?)',
      [user_id, mood_id, entry_date]
    );
    res.json({ id: result.insertId, user_id, mood_id, entry_date });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMoodEntries = async (req, res) => {
  const { userId } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM user_mood_entries WHERE user_id = ? ORDER BY entry_date DESC',
    [userId]
  );
  res.json(rows);
};

// MCQ Entries
exports.addMcqEntry = async (req, res) => {
  const { user_id, question, answer, entry_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO user_mcq_entries (user_id, question, answer, entry_date) VALUES (?, ?, ?, ?)',
      [user_id, question, answer, entry_date]
    );
    res.json({ id: result.insertId, user_id, question, answer, entry_date });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMcqEntries = async (req, res) => {
  const { userId } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM user_mcq_entries WHERE user_id = ? ORDER BY entry_date DESC',
    [userId]
  );
  res.json(rows);
};

// Gratitude Entries
exports.addGratitudeEntry = async (req, res) => {
  const { user_id, gratitude_text, entry_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO user_gratitude_entries (user_id, gratitude_text, entry_date) VALUES (?, ?, ?)',
      [user_id, gratitude_text, entry_date]
    );
    res.json({ id: result.insertId, user_id, gratitude_text, entry_date });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGratitudeEntries = async (req, res) => {
  const { userId } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM user_gratitude_entries WHERE user_id = ? ORDER BY entry_date DESC',
    [userId]
  );
  res.json(rows);
}; 