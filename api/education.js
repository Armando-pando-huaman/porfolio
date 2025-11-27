const { MongoClient, ObjectId } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('porfolio');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
      const education = await db.collection('education')
        .find({})
        .sort({ endYear: -1 })
        .toArray();
      return res.status(200).json(education);
    }

    if (req.method === 'POST') {
      const result = await db.collection('education').insertOne(req.body);
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID requerido' });
      
      const result = await db.collection('education').updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body }
      );
      return res.status(200).json({ success: true, result });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID requerido' });
      
      const result = await db.collection('education').deleteOne(
        { _id: new ObjectId(id) }
      );
      return res.status(200).json({ success: true, result });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en education:', error);
    return res.status(500).json({ error: error.message });
  }
};