import { MongoClient } from 'mongodb';
import promiseRetry from 'promise-retry';

const globalAny = global;
globalAny.mongo = globalAny.mongo || {};

let cachedDb = globalAny.mongo;

async function connectToDatabase(uri) {
  if (cachedDb.client) {
    return cachedDb.client.db(process.env.MONGODB_DATABASE);
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 100,
    minPoolSize: 0
  };

  const promiseRetryOptions = {
    retries: 10,
    factor: 1,
    minTimeout: 1000,
    maxTimeout: 2000
  };

  const client = new MongoClient(uri, options);

  const clientPromise = promiseRetry((retry, number) => {
    console.log(`MongoDB connection attempt number: ${number}`);
    return client.connect().catch(retry);
  }, promiseRetryOptions).then((promise) => {
    console.log('MongoDB successfully connected.');
    return promise;
  });

  cachedDb.client = await clientPromise;
  return cachedDb.client.db(process.env.MONGODB_DATABASE);
}

export default connectToDatabase;
