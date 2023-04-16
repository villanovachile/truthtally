import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  const { type, page, tags, title, items, all, sort, limit } = req.query;

  console.log(limit);

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

  console.log('sortOrder:', sortOrder);
  console.log('sort:', sort);

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

    if (items) {
      const itemsRegex = new RegExp(`.*${items}.*`, 'i');
      query.items = { $elemMatch: { item: itemsRegex } };
    }

    if (all) {
      const searchRegex = new RegExp(`.*${all}.*`, 'i');
      query.$or = [
        { title: searchRegex },
        { tags: { $all: [searchRegex] } },
        { items: { $elemMatch: { item: searchRegex } } }
      ];
    }

    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const totalCount = await collection.countDocuments(query);

    const totalPages = Math.ceil(totalCount / 12);

    const currentPage = page > totalPages ? 1 : page;
    const itemsPerPage = 12;
    const skip = (currentPage - 1) * itemsPerPage;
    const limitItems = limit ? limit : itemsPerPage;

    // const lists = await collection.find(query).skip(skip).limit(limit).toArray();
    const lists = await collection.find(query).sort(sortOrder).skip(skip).limit(parseInt(limitItems, 10)).toArray();

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
