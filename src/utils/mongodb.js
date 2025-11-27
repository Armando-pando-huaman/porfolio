import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URL;

// NO lances error - solo devuelve null
if (!MONGODB_URI) {
  console.log('⚠️ MONGODB_URL no está configurada');
}

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Si no hay URL, retorna null inmediatamente
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
      return {
        client,
        db: client.db(),
      };
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}