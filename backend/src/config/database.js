const { Sequelize } = require('sequelize');
require('dotenv').config();

// Log database configuration (without password)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER
});

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

const initializeDatabase = async () => {
  try {
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