const { MongoClient } = require('mongodb');

module.exports = async function handler(req, res) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return res.status(200).json({ 
        status: '❌ MONGODB_URI no configurada',
        message: 'La variable no existe en Vercel' 
      });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('portfolio');
    const collections = await db.listCollections().toArray();
    
    await client.close();

    res.status(200).json({
      status: '✅ Conexión exitosa',
      collections: collections.map(c => c.name),
      message: 'MongoDB conectado correctamente'
    });

  } catch (error) {
    res.status(200).json({
      status: '❌ Error de conexión',
      error: error.message,
      message: 'Problema conectando a MongoDB'
    });
  }
};