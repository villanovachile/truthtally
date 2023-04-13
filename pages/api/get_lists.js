import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  const { type, page } = req.query;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const query = { type: 'ranked' };
    const totalCount = await collection.countDocuments({ type: type });

    const totalPages = Math.ceil(totalCount / 12);

    const itemsPerPage = 12;
    const skip = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const currentPage = page;

    const lists = await collection.find({ type: type }).skip(skip).limit(limit).toArray();

    // console.log(items);

    const results = {
      totalCount: totalCount,
      type: type,
      lists: lists,
      totalPages: totalPages,
      currentPage: currentPage
    };

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error.toString());
  }
}
