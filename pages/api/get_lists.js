import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  const { type, page, tags, title, items, all, sort, limit, skipCount } = req.query;
  let searchQuery = null;

  let sortOrder;

  switch (sort) {
    case 'title_asc':
      sortOrder = { title: 1 };
      break;
    case 'title_desc':
      sortOrder = { title: -1 };
      break;
    case 'oldest':
      sortOrder = { _id: 1 };

      break;
    case 'newest':
      sortOrder = { _id: -1 };
      break;
    case 'popularity':
      sortOrder = { views: -1 };
      break;
    default:
      sortOrder = { title: 1 };
      break;
  }

  try {
    let query = { type: type, unlisted: false };

    if (tags) {
      const tagArray = tags.split(',');
      const regexArray = tagArray.map((tag) => new RegExp(`${tag.slice(0, 150)}`, 'i'));
      query.tags = { $all: regexArray };
      searchQuery = tags.slice(0, 150);
    }

    if (title) {
      const words = title.split(/\s+/);
      const regex = words.map((word) => `(?=.*${word.slice(0, 150)})`).join('');
      query.title = { $regex: regex, $options: 'i' };
      searchQuery = title.slice(0, 150);
    }

    if (items) {
      const itemsRegex = new RegExp(`.*${items.slice(0, 150)}.*`, 'i');
      query.items = { $elemMatch: { item: itemsRegex } };
      searchQuery = items.slice(0, 150);
    }

    if (all) {
      const searchRegex = new RegExp(`.*${all.slice(0, 150)}.*`, 'i');
      query.$or = [
        { title: searchRegex },
        { tags: { $all: [searchRegex] } },
        { items: { $elemMatch: { item: searchRegex } } }
      ];
      searchQuery = all.slice(0, 150);
    }

    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    let totalCount;
    if (!skipCount) {
      totalCount = await collection.countDocuments(query);
    }

    const totalPages = Math.ceil(totalCount / 24);

    const currentPage = page > totalPages ? 1 : page;
    const itemsPerPage = 24;
    const skip = (currentPage - 1) * itemsPerPage;
    const limitItems = limit ? limit : itemsPerPage;

    const lists = await collection.find(query).sort(sortOrder).skip(skip).limit(parseInt(limitItems, 10)).toArray();

    const results = {
      totalCount: totalCount,
      type: type,
      lists: lists,
      totalPages: totalPages,
      currentPage: currentPage,
      searchQuery: searchQuery && searchQuery.slice(0, 150)
    };

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error.toString());
  }
}
