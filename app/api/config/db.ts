import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, define la variable de entorno MONGODB_URI en el archivo .env.local'
  );
}

interface Cached {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}
declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached;
}

global.mongoose = global.mongoose || { conn: null, promise: null };
const cached = global.mongoose;

async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
