import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
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
      res.status(200).json({ token: newToken });
    } else {
      res.status(200).json({ token: token.token });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
