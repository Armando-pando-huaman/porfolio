import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = await connectToDatabase();
    const db = client.db("porfolio");
    const collection = db.collection("skills");

    if (req.method === 'GET') {
      const skills = await collection.findOne({});
      return res.status(200).json({
        success: true,
        data: skills || null
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const skillsData = req.body;
      
      const result = await collection.updateOne(
        {},
        { 
          $set: {
            ...skillsData,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Habilidades guardadas exitosamente',
        data: skillsData
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}