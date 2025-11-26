const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  
  if (!uri) {
    throw new Error('❌ MONGODB_URI no está definida');
  }
  
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`👤 ${req.method} /api/personal-data`);

  try {
    const client = await connectToDatabase();
    const db = client.db("porfolio");
    const collection = db.collection("personal_data");

    // GET - Obtener todos los perfiles o uno específico
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        // Obtener perfil específico
        const data = await collection.findOne({ _id: new ObjectId(id) });
        return res.status(200).json({
          success: true,
          data: data || null
        });
      } else {
        // Obtener todos los perfiles
        const data = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({
          success: true,
          data: data
        });
      }
    }

    // POST - Crear nuevo perfil
    if (req.method === 'POST') {
      const data = req.body;
      
      const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const insertedData = await collection.findOne({ _id: result.insertedId });
      
      return res.status(201).json({
        success: true,
        message: 'Perfil creado exitosamente',
        data: insertedData
      });
    }

    // PUT - Actualizar perfil existente
    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;
      
      if (!_id) {
        return res.status(400).json({
          success: false,
          error: 'ID es requerido para actualizar'
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
          error: 'Perfil no encontrado'
        });
      }

      const updatedData = await collection.findOne({ _id: new ObjectId(_id) });
      
      return res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedData
      });
    }

    // DELETE - Eliminar perfil
    if (req.method === 'DELETE') {
      const { _id } = req.body;
      
      if (!_id) {
        return res.status(400).json({
          success: false,
          error: 'ID es requerido para eliminar'
        });
      }
      
      const result = await collection.deleteOne({ _id: new ObjectId(_id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Perfil no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Perfil eliminado exitosamente'
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
};