import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`👤 ${req.method} /api/personal-data`);

  try {
    const client = await connectToDatabase();
    const db = client.db("porfolio"); // Nota: typo en "portfolio"
    const collection = db.collection("personal_data");

    if (req.method === 'GET') {
      const data = await collection.findOne({});
      return res.status(200).json({
        success: true,
        data: data || null
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const data = req.body;
      const { _id, ...dataWithoutId } = data;
      
      const result = await collection.updateOne(
        {},
        { 
          $set: {
            ...dataWithoutId,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      const updatedData = await collection.findOne({});
      return res.status(200).json({
        success: true,
        message: 'Datos guardados exitosamente',
        data: updatedData
      });
    }

    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });

  } catch (error) {
    console.error('❌ Error en /api/personal-data:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}