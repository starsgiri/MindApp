const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const entryRoutes = require('./routes/entry');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/entry', entryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Something went wrong',
        message: err.message 
    });
});

// Not found middleware
app.use((req, res) => {
    console.log('Route not found:', req.method, req.url);
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize database
        const dbInitialized = await initializeDatabase();
        if (!dbInitialized) {
            console.error('Failed to initialize database');
            process.exit(1);
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('Available endpoints:');
            console.log('  POST /api/auth/register - Register new user');
            console.log('  POST /api/auth/login - Login user');
            console.log('  GET /api/auth/profile/:id - Get user profile');
            console.log('  POST /api/mood - Add mood entry');
            console.log('  GET /api/mood/user/:userId - Get user mood history');
            console.log('  GET /api/mood/stats - Get mood statistics');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();