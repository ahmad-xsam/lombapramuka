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
    const collection = db.collection('teams');

    if (req.method === 'GET') {
      const data = await collection.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = req.body || {};
      if (!body.id) {
        return res.status(400).json({ error: 'Missing team id' });
      }

      await collection.updateOne(
        { id: body.id },
        { $set: { ...body, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, team: body });
    }

    if (req.method === 'DELETE') {
      const { id, all } = req.query || (req.body || {});
      if (all === 'true' || all === true) {
        await collection.deleteMany({});
        return res.status(200).json({ success: true, deletedAll: true });
      }
      if (!id) {
        return res.status(400).json({ error: 'Missing team id' });
      }

      await collection.deleteOne({ id });
      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('[API teams error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
