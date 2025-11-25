import { MongoClient, ObjectId } from 'mongodb';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = await connectToDatabase();
    const db = client.db("porfolio");
    const collection = db.collection("experience");

    if (req.method === 'GET') {
      const experience = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: experience });
    }

    if (req.method === 'POST') {
      const experience = req.body;
      const result = await collection.insertOne({
        ...experience,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return res.status(201).json({ 
        success: true, 
        data: { _id: result.insertedId, ...experience } 
      });
    }

    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      return res.status(200).json({ 
        success: true, 
        message: 'Experiencia actualizada' 
      });
    }

    if (req.method === 'DELETE') {
      const { _id } = req.body;
      const result = await collection.deleteOne({ _id: new ObjectId(_id) });
      return res.status(200).json({ 
        success: true, 
        message: 'Experiencia eliminada' 
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}