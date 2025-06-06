const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Mood = sequelize.define('Mood', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    label: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    emoji: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    healthStatus: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    gratitudeText: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    mcqAnswers: {
        type: DataTypes.JSON,
        allowNull: true
    },
    entry_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

module.exports = Mood;