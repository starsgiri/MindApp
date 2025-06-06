const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

const User = require('./User');
const Mood = require('./Mood');

User.hasMany(Mood, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Mood.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Mood };