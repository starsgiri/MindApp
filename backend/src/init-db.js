const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  // Create connection without database to create it if it doesn't exist
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Check and drop existing tables
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);

    // Disable foreign key checks temporarily
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop tables in reverse order if they exist
    if (tableNames.includes('mood_entries')) await connection.query('DROP TABLE mood_entries');
    if (tableNames.includes('user_mood_entries')) await connection.query('DROP TABLE user_mood_entries');
    if (tableNames.includes('user_mcq_entries')) await connection.query('DROP TABLE user_mcq_entries');
    if (tableNames.includes('user_gratitude_entries')) await connection.query('DROP TABLE user_gratitude_entries');
    if (tableNames.includes('users')) await connection.query('DROP TABLE users');
    if (tableNames.includes('moods')) await connection.query('DROP TABLE moods');

    // Create tables in order of dependencies
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        emoji VARCHAR(10),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS moods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(50) NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        color VARCHAR(20),
        backlight VARCHAR(20)
      );
    `);

    // Insert initial moods
    await connection.query(`
      INSERT INTO moods (label, emoji, color, backlight) VALUES
        ('Happy', '😊', 'bg-yellow-100', '#facc15'),
        ('Sad', '😢', 'bg-blue-100', '#60a5fa'),
        ('Calm', '😌', 'bg-green-100', '#4ade80'),
        ('Anxious', '😰', 'bg-purple-100', '#a78bfa'),
        ('Excited', '🤩', 'bg-pink-100', '#f472b6'),
        ('Tired', '🥱', 'bg-gray-100', '#a3a3a3'),
        ('Angry', '😡', 'bg-red-100', '#f87171')
      ON DUPLICATE KEY UPDATE 
        emoji = VALUES(emoji),
        color = VALUES(color),
        backlight = VALUES(backlight);
    `);

    // Create child tables that depend on users and moods
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_mood_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mood_id INT NOT NULL,
        entry_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (mood_id) REFERENCES moods(id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_mcq_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        question VARCHAR(255) NOT NULL,
        answer VARCHAR(255) NOT NULL,
        entry_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_gratitude_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        gratitude_text TEXT NOT NULL,
        entry_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Database and tables created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Make sure to re-enable foreign key checks even if there's an error
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    await connection.end();
  }
}

initializeDatabase();
