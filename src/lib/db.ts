import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to the .env.local file.");
}

export const client = new MongoClient(uri);
export const db = client.db(process.env.DB_NAME || "wedplan");
