import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Configuración CORS básica
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client;
  
  try {
    // Verificar variable de entorno
    if (!process.env.MONGODB_URL) {
      console.error('❌ MONGODB_URL no está definida');
      return res.status(500).json({ 
        error: 'Configuración faltante',
        message: 'La variable MONGODB_URL no está configurada en Vercel' 
      });
    }

    console.log('🔗 Intentando conectar a MongoDB...');

    // Configuración de conexión más tolerante
    client = new MongoClient(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000, // 10 segundos
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1
    });

    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db();
    
    // Verificar que podemos interactuar con la base de datos
    const collections = await db.listCollections().toArray();
    console.log('📁 Colecciones:', collections.map(c => c.name));

    if (req.method === 'GET') {
      const profile = await db.collection('profile').findOne({});
      
      if (!profile) {
        console.log('📭 La colección profile está vacía');
        return res.status(404).json({ 
          error: 'Perfil no encontrado',
          message: 'La base de datos está conectada pero no hay datos en la colección profile' 
        });
      }

      console.log('✅ Datos de perfil encontrados');
      return res.status(200).json(profile);
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('💥 ERROR CRÍTICO:', error);
    
    let errorMessage = 'Error interno del servidor';
    let errorDetails = error.message;

    // Clasificar el error
    if (error.name === 'MongoServerSelectionError') {
      errorMessage = 'No se puede conectar al servidor de MongoDB';
    } else if (error.name === 'MongoNetworkError') {
      errorMessage = 'Error de red con MongoDB Atlas';
    } else if (error.message.includes('auth')) {
      errorMessage = 'Error de autenticación con MongoDB';
    } else if (error.message.includes('querySrv')) {
      errorMessage = 'Error de DNS - verifica la URL de conexión';
    }

    return res.status(500).json({
      error: errorMessage,
      details: errorDetails,
      solution: 'Verifica: 1) Variable MONGODB_URL en Vercel, 2) IP whitelist en MongoDB Atlas, 3) Usuario/contraseña correctos'
    });

  } finally {
    // Cerrar conexión de manera segura
    if (client) {
      try {
        await client.close();
        console.log('🔌 Conexión cerrada');
      } catch (closeError) {
        console.error('Error cerrando conexión:', closeError);
      }
    }
  }
}