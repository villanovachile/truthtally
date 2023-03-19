const connectToDatabase = require("../../../utils/mongo-connection");
const randomstring = require("randomstring");

const handler = async (event) => {
  const input = JSON.parse(event.body);
  console.log(input);

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    let newURI = randomstring.generate(8);

    await collection.insertOne({
      [newURI]: input.items,
      views: 0,
      rating: 0,
      title: input.title,
      type: input.type,
      unlisted: input.unlisted,
      tags: input.tags,
      unranked_list_uri: input.source_uri,
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
