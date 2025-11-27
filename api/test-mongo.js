import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    if (!process.env.MONGODB_URL) {
      return res.status(500).json({ error: "MONGODB_URL no configurada" });
    }

    const client = new MongoClient(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    const adminDb = client.db().admin();
    const serverStatus = await adminDb.serverStatus();
    
    await client.close();

    return res.status(200).json({
      status: "✅ MongoDB conectado correctamente",
      version: serverStatus.version,
      host: serverStatus.host,
      ok: serverStatus.ok
    });

  } catch (error) {
    return res.status(500).json({
      error: "❌ Error conectando a MongoDB",
      message: error.message,
      name: error.name
    });
  }
}