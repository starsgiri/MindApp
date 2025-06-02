const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Log database configuration (without password)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

// Function to ensure database exists
const ensureDatabaseExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Database "${process.env.DB_NAME}" ensured/created.`);
    await connection.end();
  } catch (error) {
    console.error('❌ Error ensuring database exists:', error);
    throw error;
  }
};

// Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialization function
const initializeDatabase = async () => {
  try {
    await ensureDatabaseExists();

    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

module.exports = { sequelize, initializeDatabase };
