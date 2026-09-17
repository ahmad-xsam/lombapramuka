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
    const collection = db.collection('scores');

    if (req.method === 'GET') {
      const records = await collection.find({}).toArray();
      // Transform document list back into scores map { [lombaId]: { [teamId]: scoreObj } }
      const scoreMap = {};
      records.forEach(doc => {
        if (doc.lombaId && doc.scores) {
          scoreMap[doc.lombaId] = doc.scores;
        }
      });
      return res.status(200).json(scoreMap);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { lombaId, teamId, scoreObj, fullScores } = body;

      if (fullScores) {
        // Bulk replace/upsert all scores
        for (const [lId, lScores] of Object.entries(fullScores)) {
          await collection.updateOne(
            { lombaId: lId },
            { $set: { lombaId: lId, scores: lScores, updatedAt: new Date() } },
            { upsert: true }
          );
        }
        return res.status(200).json({ success: true });
      }

      if (!lombaId || !teamId) {
        return res.status(400).json({ error: 'Missing lombaId or teamId' });
      }

      // Fetch existing record for this lombaId
      const existingDoc = await collection.findOne({ lombaId }) || { lombaId, scores: {} };
      const updatedScores = existingDoc.scores || {};
      updatedScores[teamId] = scoreObj;

      await collection.updateOne(
        { lombaId },
        { $set: { lombaId, scores: updatedScores, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({ success: true, lombaId, teamId });
    }

    if (req.method === 'DELETE') {
      const { all, lombaId } = req.query || (req.body || {});
      if (all === 'true' || all === true) {
        await collection.deleteMany({});
        return res.status(200).json({ success: true, deletedAll: true });
      }
      if (lombaId) {
        await collection.deleteOne({ lombaId });
        return res.status(200).json({ success: true, deletedLombaId: lombaId });
      }
      return res.status(400).json({ error: 'Missing lombaId or all parameter' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('[API scores error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
