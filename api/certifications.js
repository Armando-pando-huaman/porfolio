const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy6lxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('🔌 Intentando conectar a MongoDB Atlas...');
    
    await client.connect();
    console.log('✅ Conexión establecida exitosamente!');
    
    // Ping para confirmar conexión
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping exitoso a MongoDB!");
    
    // Listar todas las bases de datos disponibles
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('\n📂 Bases de datos disponibles:');
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Verificar la base de datos "porfolio"
    const porfolioDB = client.db("porfolio");
    const collections = await porfolioDB.listCollections().toArray();
    console.log('\n📁 Colecciones en la base "porfolio":');
    if (collections.length > 0) {
      collections.forEach(col => console.log(`   - ${col.name}`));
    } else {
      console.log('   (No hay colecciones aún)');
    }
    
    console.log('\n✅ DIAGNÓSTICO COMPLETO: Todo funciona correctamente');
    
  } catch (error) {
    console.error('\n❌ ERROR DETECTADO:');
    console.error('   Tipo:', error.name);
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n🔐 PROBLEMA DE AUTENTICACIÓN:');
      console.error('   1. Verifica que la contraseña sea exactamente: Nino.1412');
      console.error('   2. Resetea la contraseña en MongoDB Atlas');
      console.error('   3. Verifica que no haya espacios extras');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n🌐 PROBLEMA DE RED:');
      console.error('   1. Verifica tu conexión a internet');
      console.error('   2. Revisa el firewall');
    } else if (error.message.includes('IP')) {
      console.error('\n🔒 PROBLEMA DE ACCESO:');
      console.error('   1. Agrega tu IP en Network Access de MongoDB Atlas');
      console.error('   2. O usa 0.0.0.0/0 para permitir todas las IPs (solo desarrollo)');
    }
    
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

run().catch(console.dir);