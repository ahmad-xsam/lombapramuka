const { connectToDatabase } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('users');

    if (req.method === 'GET') {
      const data = await collection.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.username) {
        return res.status(400).json({ error: 'Missing username' });
      }

      await collection.updateOne(
        { username: body.username },
        { $set: { ...body, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, user: body });
    }

    if (req.method === 'DELETE') {
      const { username } = req.query || (req.body || {});
      if (!username) {
        return res.status(400).json({ error: 'Missing username for deletion' });
      }

      await collection.deleteOne({ username });
      return res.status(200).json({ success: true, deletedUsername: username });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('[API users error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
