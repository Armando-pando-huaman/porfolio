import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Si ya existe conexión, reutilizarla
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Conectar a MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db('porfolio'); // Tu base de datos

    // Guardar en caché
    cachedClient = client;
    cachedDb = db;

    console.log('✅ MongoDB conectado');
    return { client, db };
  } catch (error) {
    console.error('❌ Error MongoDB:', error);
    throw error;
  }
}