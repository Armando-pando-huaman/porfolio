const { MongoClient } = require('mongodb');

// USA EL CLUSTER QUE SÍ FUNCIONA (el de tu sistema de cobranza)
const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy6lxe.mongodb.net/porfolio?retryWrites=true&w=majority&appName=Cluster0";

module.exports = async (req, res) => {
  console.log('🔌 Iniciando API /certifications con cluster funcional');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client;

  try {
    console.log('🔌 Conectando al cluster funcional...');
    
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });

    await client.connect();
    console.log('✅ Conectado exitosamente al cluster funcional');

    const db = client.db("porfolio");
    
    // El resto del código igual...
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log(`📊 Encontradas ${certifications.length} certificaciones`);

    return res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      data: certifications,
      count: certifications.length
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      data: []
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};