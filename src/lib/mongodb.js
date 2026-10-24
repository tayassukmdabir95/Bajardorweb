
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const globalWithMongo = globalThis;

const client =
  globalWithMongo._mongoClient ??
  new MongoClient(uri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });

if (!globalWithMongo._mongoClient) {
  globalWithMongo._mongoClient = client;
}

const connectionPromise =
  globalWithMongo._mongoConnectionPromise ??
  client.connect();

if (!globalWithMongo._mongoConnectionPromise) {
  globalWithMongo._mongoConnectionPromise = connectionPromise;
}

export { client };

export const db = client.db("bazardor");

export async function connectToDatabase() {
  await connectionPromise;
  return db;
}
