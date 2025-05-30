const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, email, password, emoji, description } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password_hash: password, // Will be hashed by model hook
            emoji,
            description
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.toJSON());
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, emoji, description } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            name: name || user.name,
            emoji: emoji || user.emoji,
            description: description || user.description
        });

        res.json(user.toJSON());
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
};