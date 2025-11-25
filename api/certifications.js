import { MongoClient, ObjectId } from 'mongodb';

// Solo usar variable de entorno - NUNCA hardcodear credenciales
const uri = process.env.MONGODB_URI;

// Verificar que la variable existe
if (!uri) {
  console.error('❌ MONGODB_URI no está definida en las variables de entorno');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  console.log('🔌 Conectando a MongoDB...');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Conexión a MongoDB establecida');
    
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
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`📜 ${req.method} /api/certifications`);

  try {
    const { db } = await connectToDatabase();
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
      
      // Verificar si la colección existe
      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some(col => col.name === 'certifications');

      if (collectionExists) {
        certifications = await collection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        console.log(`📊 ${certifications.length} certificaciones encontradas`);
      } else {
        console.log('ℹ️ Colección "certifications" no existe aún');
      }

      return res.status(200).json({
        success: true,
        data: certifications,
        count: certifications.length,
        message: collectionExists ? 
          `${certifications.length} certificaciones encontradas` : 
          'Colección de certificaciones no existe'
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

    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });

  } catch (error) {
    console.error('❌ Error en /api/certifications:', error.message);
    
    // Error específico por falta de variable de entorno
    if (error.message.includes('MONGODB_URI')) {
      return res.status(500).json({
        success: false,
        error: 'Error de configuración: MONGODB_URI no definida',
        details: 'Configura la variable MONGODB_URI en Vercel con tus credenciales de MongoDB'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}