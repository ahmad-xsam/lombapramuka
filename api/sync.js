const { connectToDatabase } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    
    // Fetch all collections
    const competitions = await db.collection('competitions').find({}).toArray();
    const teams = await db.collection('teams').find({}).toArray();
    const scoreDocs = await db.collection('scores').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();

    const scoreMap = {};
    scoreDocs.forEach(doc => {
      if (doc.lombaId && doc.scores) {
        scoreMap[doc.lombaId] = doc.scores;
      }
    });

    return res.status(200).json({
      connected: true,
      dbName: 'bandungpreanger_db',
      data: {
        competitions,
        teams,
        scores: scoreMap,
        users
      }
    });
  } catch (error) {
    console.error('[API sync error]:', error);
    return res.status(500).json({
      connected: false,
      error: error.message || 'MongoDB connection error'
    });
  }
};
