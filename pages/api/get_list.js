import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  const { uri } = req.query;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({ uri: { $eq: uri } }).toArray();

    if (results.length > 0) {
      let viewCount = results[0].views;
      const currentDate = new Date();
      await collection.updateOne(
        { uri: { $eq: uri } },
        {
          $set: {
            views: viewCount + 1,
            last_accessed: currentDate
          }
        }
      );

      res.status(200).json(results[0]);
    } else {
      res.status(200).json('not_found');
    }
  } catch (error) {
    res.status(500).json(error.toString());
  }
}
