import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const query = { type: 'ranked' };
    const totalCount = await collection.countDocuments(query);

    const lists = { totalCount: totalCount, type: 'unranked' };

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json(error.toString());
  }
}
