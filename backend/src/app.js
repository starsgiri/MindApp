const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const moodRoutes = require('./routes/mood');
const entryRoutes = require('./routes/entry');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/entry', entryRoutes);

app.get('/', (req, res) => res.send('MindCare API Running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 