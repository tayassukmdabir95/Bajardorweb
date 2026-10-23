
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

const client =
  globalWithMongo._mongoClient ??
  new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  globalWithMongo._mongoClient = client;
}

export { client };

export const db = client.db("bazardor");
