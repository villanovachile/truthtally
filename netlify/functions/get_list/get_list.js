const connectToDatabase = require('../../../utils/mongo-connection');

const handler = async (event) => {
  const input = event.queryStringParameters.uri;

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({ uri: { $eq: input } }).toArray();

    if (results.length > 0) {
      let viewCount = results[0].views;
      const currentDate = new Date();
      await collection.updateOne(
        { uri: { $eq: input } },
        {
          $set: {
            views: viewCount + 1,
            last_accessed: currentDate
          }
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify(results[0])
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify('not_found')
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
