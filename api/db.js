/* ==========================================================================
   SiMika - MongoDB Atlas Client Helper for Vercel Serverless & Express Backend
   Connection String: mongodb+srv://bandungpreanger_db_user:lSoI9r4s25T4qRN4@ahmadxsam.n459uq9.mongodb.net/?appName=ahmadxsam
   ========================================================================== */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bandungpreanger_db_user:lSoI9r4s25T4qRN4@ahmadxsam.n459uq9.mongodb.net/?appName=ahmadxsam';
const DB_NAME = process.env.DB_NAME || 'bandungpreanger_db';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      await cachedDb.command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (e) {
      console.warn('[MongoDB Connection Stale, reconnecting]:', e.message);
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase, DB_NAME };
