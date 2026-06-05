const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const streamRoutes = require('./routes/streams');
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
const scoreRoutes = require('./routes/scores');
const resultsRoutes = require('./routes/results');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ikonex SMS API running' });
});

app.use('/api/streams', streamRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/results', resultsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});