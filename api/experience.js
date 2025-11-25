import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    const db = client.db("porfolio");
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`💼 ${req.method} /api/experience`);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("experience");

    if (req.method === 'GET') {
      const experience = await collection.find({}).sort({ createdAt: -1 }).toArray();
      
      return res.status(200).json({ 
        success: true, 
        data: experience,
        count: experience.length
      });
    }

    if (req.method === 'POST') {
      const experience = req.body;
      
      if (!experience.empresa || !experience.puesto) {
        return res.status(400).json({
          success: false,
          error: "Empresa y puesto son campos requeridos"
        });
      }

      const result = await collection.insertOne({
        ...experience,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return res.status(201).json({ 
        success: true, 
        data: { _id: result.insertedId, ...experience },
        message: 'Experiencia agregada exitosamente'
      });
    }

    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      
      if (!_id) {
        return res.status(400).json({
          success: false,
          error: "ID es requerido para actualizar"
        });
      }

      // CORRECTO: Usamos _id para filtrar, pero no lo incluimos en la actualización
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          error: "Experiencia no encontrada"
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Experiencia actualizada'
      });
    }

    if (req.method === 'DELETE') {
      const { _id } = req.body;
      
      if (!_id) {
        return res.status(400).json({
          success: false,
          error: "ID es requerido para eliminar"
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(_id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: "Experiencia no encontrada"
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Experiencia eliminada'
      });
    }

    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });

  } catch (error) {
    console.error('❌ Error en /api/experience:', error.message);
    
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}