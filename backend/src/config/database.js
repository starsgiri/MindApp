const { Sequelize } = require('sequelize');
require('dotenv').config();

// Log database configuration (without password)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  dialect: 'mysql'
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mindcare',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test database operations
    try {
      await sequelize.query('SELECT 1+1 AS result');
      console.log('✅ Database query test successful');
    } catch (queryError) {
      console.error('❌ Database query test failed:', queryError);
      throw queryError;
    }

    // Log database tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    console.error('Connection details:', {
      database: process.env.DB_NAME || 'mindcare',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root'
    });
    throw error;
  }
};

module.exports = { sequelize, testConnection }; 