import mongoose, { ConnectOptions } from "mongoose";
import { env } from "node:process";

const MONGODBURI =  process.env.MONGODB_URI ? process.env.MONGODB_URI : ''

if (MONGODBURI ==='') {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const clientOptions: ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

const cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

export async function connectDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODBURI, clientOptions).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

