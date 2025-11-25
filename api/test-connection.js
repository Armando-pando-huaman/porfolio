import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI no está definida en las variables de entorno',
        solution: 'Agrega MONGODB_URI en los Environment Variables de Vercel'
      });
    }

    console.log('🔌 Probando conexión a MongoDB...');
    
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db("porfolio");
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    await client.close();

    res.status(200).json({
      success: true,
      message: '✅ Conexión exitosa a MongoDB',
      database: 'porfolio',
      collections: collectionNames,
      totalCollections: collections.length,
      details: 'La conexión a MongoDB funciona correctamente'
    });

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Verifica que la MONGODB_URI en Vercel sea correcta y que MongoDB Atlas permita conexiones desde cualquier IP'
    });
  }
}