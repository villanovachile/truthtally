const { MongoClient } = require("mongodb");
const randomstring = require("randomstring");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
  const input = JSON.parse(event.body);

  const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
  const collection = database.collection(process.env.MONGODB_COLLECTION);
  let newURI = randomstring.generate(8);
  try {
    await collection.insertOne({
      [newURI]: input.items,
      views: 0,
      rating: 0,
      title: input.title,
      type: input.type,
      unlisted: input.unlisted,
      tags: input.tags,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(newURI),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
