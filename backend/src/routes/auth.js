const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.register);

// Protected routes
router.get('/user/:id', authMiddleware, userController.getProfile);
router.put('/user/:id', authMiddleware, userController.updateProfile);

module.exports = router;