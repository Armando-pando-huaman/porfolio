import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://Armandopando:Mongo123@cluster0.pmy6lxe.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Colecciones:', collections.map(c => c.name));

    // Probemos la colección 'profile'
    const profile = await db.collection('profile').findOne({});
    console.log('Perfil:', profile);

  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testConnection();