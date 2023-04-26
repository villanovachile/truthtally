import connectToDatabase from '@/utils/mongo-connection';

export default async function handler(req, res) {
  const { uri, v } = req.query;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const results = await collection
      .aggregate([
        { $match: { uri: { $eq: uri } } },
        {
          $lookup: {
            from: process.env.MONGODB_COLLECTION_USERS,
            let: { author_uid: '$author_uid' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$uid', '$$author_uid'] }]
                  }
                }
              }
            ],
            as: 'author_info'
          }
        },
        {
          $addFields: {
            author: {
              $ifNull: [{ $arrayElemAt: ['$author_info.username', 0] }, '$author']
            }
          }
        },
        { $unwind: { path: '$author_info', preserveNullAndEmptyArrays: true } }
      ])
      .toArray();

    if (results.length > 0) {
      let result = results[0];
      let viewCount = result.views;
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

      if (result.versions) {
        const selectedVersion = v ? parseInt(v) : result.versions.length;
        const responseObject = {
          ...result,
          ...result.versions[selectedVersion - 1],
          version: selectedVersion,
          version_count: result.versions.length
        };
        delete responseObject.versions;
        res.status(200).json(responseObject);
      } else {
        let responseObject;
        let versionCount;
        if (result.source_uri) {
          try {
            const listVersion = await collection.find({ uri: { $eq: result.source_uri } }).toArray();
            listVersion[0].versions && (versionCount = listVersion[0].versions.length);

            if (versionCount !== null) {
              responseObject = {
                ...result,
                version_count: versionCount
              };
            } else {
              responseObject = result;
            }
          } catch (error) {}
        } else {
          responseObject = result;
        }
        res.status(200).json(responseObject);
      }
    } else {
      res.status(200).json('not_found');
    }
  } catch (error) {
    res.status(500).json(error.toString());
  }
}
