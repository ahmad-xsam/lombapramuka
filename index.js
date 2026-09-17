const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Root directory for static asset resolution in Vercel Serverless & Local
const rootDir = process.cwd();

// Serve static assets with explicit routes
app.use('/css', express.static(path.join(rootDir, 'css')));
app.use('/js', express.static(path.join(rootDir, 'js')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));
app.use('/manifest.json', (req, res) => res.sendFile(path.join(rootDir, 'manifest.json')));
app.use('/sw.js', (req, res) => res.sendFile(path.join(rootDir, 'sw.js')));
app.use('/favicon.ico', (req, res) => res.sendFile(path.join(rootDir, 'assets', 'simika-logo.png')));

// API Routes
app.all('/api/competitions/reorder', require('./api/competitions'));
app.all('/api/competitions', require('./api/competitions'));
app.all('/api/teams', require('./api/teams'));
app.all('/api/scores', require('./api/scores'));
app.all('/api/users', require('./api/users'));
app.all('/api/sync', require('./api/sync'));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Run standalone server if executed directly (e.g. node index.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 SiMika Express Server running at http://localhost:${PORT}`);
    console.log(`📦 MongoDB Atlas Connected: mongodb+srv://bandungpreanger_db_user:lSoI9r4s25T4qRN4@ahmadxsam.n459uq9.mongodb.net/?appName=ahmadxsam`);
  });
}

module.exports = app;
