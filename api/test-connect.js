import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 1. Verificar variable
  if (!process.env.MONGODB_URL) {
    return res.status(200).json({
      status: '❌ FALTA VARIABLE',
      message: 'MONGODB_URL no configurada en Vercel'
    });
  }

  let client;
  
  try {
    // 2. Intentar conexión simple
    client = new MongoClient(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    
    // 3. Verificar base de datos
    const db = client.db('portfolio');
    const collections = await db.listCollections().toArray();
    
    res.status(200).json({
      status: '✅ CONEXIÓN EXITOSA',
      collections: collections.map(c => c.name),
      message: 'MongoDB + Vercel funcionando correctamente'
    });

  } catch (error) {
    res.status(200).json({
      status: '❌ ERROR DE CONEXIÓN',
      error: error.message,
      urlUsed: process.env.MONGODB_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    });
  } finally {
    if (client) await client.close();
  }
}