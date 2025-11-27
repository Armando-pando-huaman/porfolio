const { MongoClient } = require('mongodb');

// Prueba AMBAS URLs para ver cuál funciona
const urls = [
  "mongodb+srv://Armandopando:Mongo123@cluster0.pmy61xe.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0",
  "mongodb+srv://Armandopando:Mongo123@cluster0.pmy6lxe.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0"
];

async function testUrl(url, index) {
  console.log(`\n🔍 Probando URL ${index + 1}: ${url.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
  
  const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });

  try {
    await client.connect();
    console.log('✅ ¡CONEXIÓN EXITOSA!');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📁 Colecciones:', collections.map(c => c.name));
    
    await client.close();
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    await client.close();
    return false;
  }
}

async function main() {
  console.log('🚀 INICIANDO PRUEBAS DE CONEXIÓN...\n');
  
  for (let i = 0; i < urls.length; i++) {
    const success = await testUrl(urls[i], i);
    if (success) {
      console.log(`\n🎯 ¡URL ${i + 1} FUNCIONA! Usa esta en Vercel`);
      break;
    }
  }
}

main();