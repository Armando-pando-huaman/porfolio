const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://Armandopando:Mongo123@cluster0.pmy6lxe.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  let client;
  
  try {
    console.log('🔗 Conectando a MongoDB Atlas...');
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    console.log('✅ ¡Conectado exitosamente a MongoDB!');

    const db = client.db();
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('📁 Colecciones disponibles:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    // Verificar datos en profile
    const profile = await db.collection('profile').findOne({});
    if (profile) {
      console.log('✅ Datos en colección profile:');
      console.log(`   Nombre: ${profile.name}`);
      console.log(`   Email: ${profile.email}`);
    } else {
      console.log('❌ La colección profile está vacía');
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('Detalles del error:', error.name);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('🔧 Posibles soluciones:');
      console.log('   1. Verifica tu conexión a internet');
      console.log('   2. Revisa la whitelist de IPs en MongoDB Atlas');
      console.log('   3. Verifica que el cluster esté activo');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

testConnection();