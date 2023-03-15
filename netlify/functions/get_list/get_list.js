const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  socketTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
});
const clientPromise = mongoClient.connect();

const handler = async (event) => {
  const input = event.queryStringParameters.uri;

  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({ [input]: { $exists: true } }).toArray();

    try {
      if (results.length > 0) {
        let viewCount = results[0].views;
        await collection.updateOne(
          { [input]: { $exists: true } },
          {
            $set: {
              views: viewCount + 1,
            },
          }
        );

        return {
          statusCode: 200,
          body: JSON.stringify(results[0]),
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify("not_found"),
        };
      }
    } catch (error) {
      return { statusCode: 500, body: error.toString() };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
