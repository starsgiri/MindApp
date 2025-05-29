const express = require('express');
const cors = require('cors');
const { testConnection, sequelize } = require('./config/database');
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
const initializeApp = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    database: sequelize.authenticate() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initialize the application
initializeApp(); 