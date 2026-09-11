/* ==========================================================================
   SiMika - MongoDB Atlas Client Helper for Vercel & Express Backend
   Connection String: mongodb+srv://bandungpreanger_db_user:lSoI9r4s25T4qRN4@ahmadxsam.n459uq9.mongodb.net/?appName=ahmadxsam
   ========================================================================== */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bandungpreanger_db_user:lSoI9r4s25T4qRN4@ahmadxsam.n459uq9.mongodb.net/?appName=ahmadxsam';
const DB_NAME = process.env.DB_NAME || 'bandungpreanger_db';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase, DB_NAME };
