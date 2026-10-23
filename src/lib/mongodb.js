
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const options = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  timeoutMS: 15000,
};

const globalWithMongo = globalThis;

const clientPromise =
  globalWithMongo._mongoClientPromise ??
  (async () => {
    const client = new MongoClient(uri, options);
    await client.connect();
    return client;
  })();

if (process.env.NODE_ENV !== "production") {
  globalWithMongo._mongoClientPromise = clientPromise;
}

const client = await clientPromise;

export { client };
export const db = client.db("bazardor");
