import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// En desarrollo: no error, solo warning
if (!uri) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔧 Modo desarrollo: usando datos de ejemplo (sin MongoDB)');
    // Retornamos una promesa que siempre rechaza para desarrollo
    clientPromise = Promise.reject(new Error('MongoDB no configurada - Modo desarrollo'));
  } else {
    // En producción es obligatorio
    throw new Error('❌ MONGODB_URI requerida en producción');
  }
} else {
  // Conexión real cuando hay URI (solo en producción)
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;