require('dotenv').config();
const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  cachedDb = client.db(process.env.MONGODB_DATABASE);
  return cachedDb;
}

module.exports = connectToDatabase;
