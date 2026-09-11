const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// API Routes
app.all('/api/competitions', require('./api/competitions'));
app.all('/api/teams', require('./api/teams'));
app.all('/api/scores', require('./api/scores'));
app.all('/api/users', require('./api/users'));
app.all('/api/sync', require('./api/sync'));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SiMika Server running at http://localhost:${PORT}`);
  console.log(`📦 MongoDB Atlas Connected: mongodb+srv://bandungpreanger_db_user:lSoI9r4s25T4qRN4@ahmadxsam.n459uq9.mongodb.net/?appName=ahmadxsam`);
});
