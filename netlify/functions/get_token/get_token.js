const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require('../../../utils/mongo-connection');

const handler = async (event) => {
  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION_TOKEN);
    const token = await collection.findOne({ _id: 'token' });

    const now = Date.now();
    const INTERVAL = 1 * 60 * 1000; //1 minute intervals

    if (!token || now - token.lastGenerated >= INTERVAL) {
      const newToken = uuidv4();
      await collection.updateOne(
        { _id: 'token' },
        {
          $set: {
            token: newToken,
            lastGenerated: now
          }
        },
        { upsert: true }
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ token: newToken })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ token: token.token })
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
