import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  const { type, page, tags, title } = req.query;

  try {
    let query = { type: type };

    if (tags) {
      const tagArray = tags.split(',');
      const regexArray = tagArray.map((tag) => new RegExp(`${tag}`, 'i'));
      query.tags = { $all: regexArray };
    }

    if (title) {
      const words = title.split(/\s+/);
      const regex = words.map((word) => `(?=.*${word})`).join('');
      query.title = { $regex: regex, $options: 'i' };
    }

    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const totalCount = await collection.countDocuments(query);

    const totalPages = Math.ceil(totalCount / 12);

    const currentPage = page > totalPages ? 1 : page;
    const itemsPerPage = 12;
    const skip = (currentPage - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const lists = await collection.find(query).skip(skip).limit(limit).toArray();

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
