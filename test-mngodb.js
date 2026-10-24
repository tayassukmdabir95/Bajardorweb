
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("FAIL: MONGODB_URI is missing.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

try {
  console.log("Connecting to MongoDB Atlas...");

  await client.connect();

  await client.db("bazardor").command({ ping: 1 });

  console.log("SUCCESS: MongoDB Atlas connection works.");
} catch (error) {
  console.error("FAIL:", error.name);
  console.error("Message:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
