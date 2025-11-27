const { MongoClient, ObjectId } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db('porfolio');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();

    // GET
    if (req.method === 'GET') {
      const profile = await db.collection('profile').findOne({});
      return res.status(200).json(profile || {});
    }

    // POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
      const data = req.body;
      const result = await db.collection('profile').updateOne(
        {},
        { $set: data },
        { upsert: true }
      );
      return res.status(200).json({ success: true, result });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en profile:', error);
    return res.status(500).json({ error: error.message });
  }
};