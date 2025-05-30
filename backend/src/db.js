const mysql = require('mysql2/promise');
require('dotenv').config();

// Log the configuration (without password)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, // Use DB_PASSWORD instead of DB_PASS
  database: process.env.DB_NAME || 'mindcare',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
};

module.exports = { pool, testConnection };