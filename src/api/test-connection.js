const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy61xe.mongodb.net/porfolio";

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client;
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    
    client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db("porfolio");
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    console.log(`📊 Encontradas ${certifications.length} certificaciones`);
    
    res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      certifications: certifications,
      count: certifications.length
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      certifications: []
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}