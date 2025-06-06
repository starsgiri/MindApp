const { Mood } = require('../../models');
const { Op } = require('sequelize');
const {User} = require('../../models');

// Get all moods
exports.getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'emoji', 'description']
      }],
      order: [['entry_date', 'DESC']]
    });
    res.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Error fetching moods' });
  }
};

exports.addMood = async (req, res) => {
  const { label, emoji, color, backlight } = req.body;

  try {
    const mood = await Mood.create({
      user_id: req.user.id,
      label,
      emoji,
      healthStatus: color,
      gratitudeText: backlight
    });

    res.status(201).json(mood);
  } catch (error) {
    console.error('Error adding mood:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.addMoodEntry = async (req, res) => {
  try {
    const {
      user_id,
      label,
      emoji,
      healthStatus,
      gratitudeText,
      mcqAnswers
    } = req.body;

    if(!user_id){
      return res.status(400).json({ error: 'User ID is required' });
    }
    const mood = await Mood.create({
      user_id,
      label,
      emoji,
      healthStatus,
      gratitudeText,
      mcqAnswers,
      entry_date: new Date()
    });

    res.status(201).json(mood);
  } catch (error) {
    console.error('Add mood entry error:', error);
    res.status(500).json({ error: 'Error adding mood entry' });
  }
};

// Get mood entries (optionally between two dates)
exports.getMoodEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {
      user_id: req.user.id
    };

    if (startDate && endDate) {
      where.entry_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const entries = await Mood.findAll({
      where,
      order: [['entry_date', 'DESC']]
    });

    res.json(entries);
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Error fetching mood entries' });
  }
};


// Get mood entries for a specific user
exports.getUserMoodEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const where = {
      user_id: userId
    };

    // Optional date filtering
    if (startDate && endDate) {
      where.entry_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.entry_date = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.entry_date = {
        [Op.lte]: new Date(endDate)
      };
    }

    const queryOptions = {
      where,
      order: [['entry_date', 'DESC']]
    };

    // Optional limit
    if (limit && !isNaN(limit)) {
      queryOptions.limit = parseInt(limit);
    }

    const entries = await Mood.findAll(queryOptions);

    if (entries.length === 0) {
      return res.status(404).json({ message: 'No mood entries found for this user' });
    }

    res.json({
      user_id: userId,
      total_entries: entries.length,
      entries: entries
    });
  } catch (error) {
    console.error('Get user mood entries error:', error);
    res.status(500).json({ error: 'Error fetching user mood entries' });
  }
};

// Get mood stats for the last 7 days
exports.getMoodStats = async (req, res) => {
  try {
    // Get entries from the last 7 days
    const entries = await Mood.findAll({
      where: {
        user_id: req.user.id,
        entry_date: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // last 7 days
        }
      },
      attributes: ['label', 'emoji', 'healthStatus', 'entry_date'],
      order: [['entry_date', 'ASC']]
    });

    // Define mood to score mapping
    const moodScores = {
      'Happy': 5,
      'Excited': 5,
      'Calm': 4,
      'Tired': 2,
      'Sad': 1,
      'Anxious': 2,
      'Angry': 1
    };

    // Helper function to calculate health score from health status text
    const calculateHealthScore = (healthStatus) => {
      if (!healthStatus) return 3; // default neutral score
      
      const text = healthStatus.toLowerCase();
      const positiveWords = ['good', 'great', 'excellent', 'fine', 'well', 'healthy', 'better', 'amazing', 'fantastic'];
      const negativeWords = ['bad', 'terrible', 'awful', 'sick', 'ill', 'pain', 'hurt', 'worse', 'horrible'];
      
      let score = 3; // neutral baseline
      
      positiveWords.forEach(word => {
        if (text.includes(word)) score += 0.5;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) score -= 0.5;
      });
      
      // Clamp between 1 and 5
      return Math.max(1, Math.min(5, Math.round(score)));
    };

    // Create arrays for the last 7 days
    const last7Days = [];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        dayName: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1] // Convert Sunday=0 to Saturday=6
      });
    }

    // Initialize arrays with default values
    const weeklyMood = new Array(7).fill(3); // default neutral mood
    const weeklyHealth = new Array(7).fill(3); // default neutral health

    // Group entries by date and calculate averages
    const entriesByDate = entries.reduce((acc, entry) => {
      const date = entry.entry_date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});

    // Fill in actual data for days that have entries
    last7Days.forEach((day, index) => {
      const dayEntries = entriesByDate[day.date] || [];
      
      if (dayEntries.length > 0) {
        // Calculate average mood score for the day
        const moodScoresForDay = dayEntries.map(entry => moodScores[entry.label] || 3);
        const avgMoodScore = moodScoresForDay.reduce((sum, score) => sum + score, 0) / moodScoresForDay.length;
        weeklyMood[index] = Math.round(avgMoodScore);

        // Calculate average health score for the day
        const healthScoresForDay = dayEntries.map(entry => calculateHealthScore(entry.healthStatus));
        const avgHealthScore = healthScoresForDay.reduce((sum, score) => sum + score, 0) / healthScoresForDay.length;
        weeklyHealth[index] = Math.round(avgHealthScore);
      }
    });

    // Also return the raw mood data for additional insights
    const moodsByDate = {};
    Object.keys(entriesByDate).forEach(date => {
      moodsByDate[date] = entriesByDate[date].map(entry => ({
        label: entry.label,
        emoji: entry.emoji
      }));
    });

    const response = {
      weeklyMood,
      weeklyHealth,
      weekDays: last7Days.map(day => day.dayName),
      dates: last7Days.map(day => day.date),
      moodsByDate, // raw mood data for additional features
      totalEntries: entries.length
    };

    res.json(response);
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Error fetching mood statistics' });
  }
};