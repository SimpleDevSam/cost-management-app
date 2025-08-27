import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = 'mongodb+srv://samuelufop121035:SamucaUfop123@costmanagementdb.agp8vac.mongodb.net/?retryWrites=true&w=majority&appName=CostManagementDb'

if (!MONGODB_URI) {
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
    cached.promise = mongoose.connect(MONGODB_URI, clientOptions).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

