import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const options = {};

let client;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }

  client = global._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

export { client };
export const db = client.db("bazardor");