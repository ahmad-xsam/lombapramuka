const { connectToDatabase } = require('./db');

module.exports = async function handler(req, res) {
  // Enable CORS
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
    const collection = db.collection('competitions');

    if (req.method === 'GET') {
      const data = await collection.find({}).sort({ order: 1 }).toArray();
      return res.status(200).json(data);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = req.body || {};

      // Bulk reorder or batch update competitions
      if (Array.isArray(body.competitions)) {
        const currentInDb = await collection.find({}).toArray();
        const incomingIds = new Set(body.competitions.map(c => c.id));
        
        const idsToRemove = currentInDb.filter(c => !incomingIds.has(c.id)).map(c => c.id);
        if (idsToRemove.length > 0) {
          await collection.deleteMany({ id: { $in: idsToRemove } });
        }

        const operations = body.competitions.map((comp, idx) => {
          const { _id, ...cleanComp } = comp;
          return {
            updateOne: {
              filter: { id: cleanComp.id },
              update: { $set: { ...cleanComp, order: idx, updatedAt: new Date() } },
              upsert: true
            }
          };
        });
        if (operations.length > 0) {
          await collection.bulkWrite(operations);
        }
        return res.status(200).json({ success: true, count: body.competitions.length });
      }

      if (!body.id || !body.name) {
        return res.status(400).json({ error: 'Missing required competition parameters (id, name).' });
      }

      const { _id, ...cleanBody } = body;
      await collection.updateOne(
        { id: cleanBody.id },
        { $set: { ...cleanBody, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, competition: cleanBody });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Missing competition id for deletion.' });
      }

      await collection.deleteOne({ id });
      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('[API competitions error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
