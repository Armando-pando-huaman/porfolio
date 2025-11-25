import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://Armandopando:Mongo123@cluster0.pmy6lxe.mongodb.net/porfolio?retryWrites=true&w=majority&appName=Cluster0";
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  console.log('🚀 API /certifications - Método:', req.method);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("porfolio");
    const collection = db.collection("certifications");

    // CREATE - Insertar nueva certificación
    if (req.method === 'POST') {
      const { name, institution, year, category, code } = req.body;
      
      if (!name || !institution) {
        return res.status(400).json({
          success: false,
          error: "Nombre e institución son campos requeridos"
        });
      }

      const result = await collection.insertOne({
        name,
        institution,
        year: year || new Date().getFullYear().toString(),
        category: category || "General",
        code: code || `CERT-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Certificación creada:', result.insertedId);
      
      return res.status(201).json({
        success: true,
        message: 'Certificación creada exitosamente',
        data: { 
          _id: result.insertedId, 
          name, 
          institution, 
          year, 
          category, 
          code 
        }
      });
    }

    // READ - Obtener todas las certificaciones
    if (req.method === 'GET') {
      let certifications = [];
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);

      if (collectionNames.includes('certifications')) {
        certifications = await collection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        console.log(`📊 ${certifications.length} certificaciones encontradas`);
      }

      return res.status(200).json({
        success: true,
        message: 'Conexión exitosa a MongoDB',
        data: certifications,
        count: certifications.length,
        collections: collectionNames
      });
    }

    // UPDATE - Actualizar certificación
    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      
      if (!_id) {
        return res.status(400).json({
          success: false,
          error: "ID de certificación es requerido"
        });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          error: "Certificación no encontrada"
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Certificación actualizada exitosamente'
      });
    }

    // DELETE - Eliminar certificación
    if (req.method === 'DELETE') {
      const { _id } = req.body;
      
      if (!_id) {
        return res.status(400).json({
          success: false,
          error: "ID de certificación es requerido"
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(_id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: "Certificación no encontrada"
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Certificación eliminada exitosamente'
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('❌ Error en la API:', error.message);
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}