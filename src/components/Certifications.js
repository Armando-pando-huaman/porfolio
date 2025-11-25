const { MongoClient } = require('mongodb');

// Connection string corregido - versión SRV con opciones mejoradas
const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy61xe.mongodb.net/porfolio?retryWrites=true&w=majority&appName=Cluster0&ssl=true&maxIdleTimeMS=45000";

module.exports = async (req, res) => {
  console.log('🔌 Iniciando API /certifications');
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('✅ Respondiendo a preflight request');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });
  }

  let client;

  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    
    // Configuración optimizada para Vercel
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,  // 10 segundos para encontrar servidor
      connectTimeoutMS: 15000,          // 15 segundos para conectar
      socketTimeoutMS: 30000,           // 30 segundos para operaciones
      maxPoolSize: 5,                   // Pool más pequeño para serverless
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true
    });

    console.log('⏳ Intentando conexión...');
    await client.connect();
    console.log('✅ Conectado exitosamente a MongoDB');

    const db = client.db("porfolio");
    console.log('📁 Usando base de datos: porfolio');

    // Verificar qué colecciones existen
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log('📂 Colecciones encontradas:', collectionNames);

    // Verificar si la colección certifications existe
    if (!collectionNames.includes('certifications')) {
      console.log('⚠️  La colección "certifications" no existe. Creando datos de ejemplo...');
      
      // Crear colección y insertar datos de ejemplo
      const exampleCertifications = [
        {
          name: "Especialista en Administración de Bases de Datos Oracle",
          institution: "Instituto SISE",
          year: "2022",
          category: "Bases de Datos",
          code: "COD-12345",
          order: 1
        },
        {
          name: "Desarrollador Web con Base de Datos", 
          institution: "Instituto SISE",
          year: "2022", 
          category: "Desarrollo Web",
          code: "COD-12346",
          order: 2
        },
        {
          name: "Networking Essentials CISCO",
          institution: "Instituto SISE",
          year: "2018",
          category: "Redes",
          code: "COD-12347", 
          order: 3
        }
      ];

      // Insertar datos de ejemplo
      const result = await db.collection("certifications").insertMany(exampleCertifications);
      console.log(`📝 Insertados ${result.insertedCount} certificaciones de ejemplo`);

      return res.status(200).json({
        success: true,
        message: 'Colección creada con datos de ejemplo',
        data: exampleCertifications,
        count: exampleCertifications.length,
        created: true
      });
    }

    // Si la colección existe, obtener los datos
    console.log('✅ Colección "certifications" encontrada, obteniendo datos...');
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log(`📊 Encontradas ${certifications.length} certificaciones`);

    // Si no hay certificaciones, crear algunas de ejemplo
    if (certifications.length === 0) {
      console.log('ℹ️  No hay certificaciones, insertando datos de ejemplo...');
      
      const exampleData = [
        {
          name: "Certificación de Ejemplo 1",
          institution: "Institución Ejemplo", 
          year: "2024",
          category: "Desarrollo",
          code: "EXAMPLE-001",
          order: 1
        },
        {
          name: "Certificación de Ejemplo 2",
          institution: "Institución Ejemplo",
          year: "2024",
          category: "Bases de Datos", 
          code: "EXAMPLE-002",
          order: 2
        }
      ];

      await db.collection("certifications").insertMany(exampleData);
      const newCerts = await db.collection("certifications").find({}).toArray();
      
      return res.status(200).json({
        success: true,
        message: 'Datos de ejemplo insertados',
        data: newCerts,
        count: newCerts.length,
        example: true
      });
    }

    // Retornar las certificaciones encontradas
    return res.status(200).json({
      success: true,
      message: 'Certificaciones cargadas exitosamente',
      data: certifications,
      count: certifications.length
    });

  } catch (error) {
    console.error('❌ Error en API certifications:', error);
    
    // Manejar errores específicos
    let errorMessage = error.message;
    let errorType = 'Error de conexión';
    
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'No se puede conectar a MongoDB Atlas. Problema de DNS/red.';
      errorType = 'Error de DNS';
    } else if (error.name === 'MongoServerSelectionError') {
      errorMessage = 'No se puede conectar al servidor de MongoDB. Verifica tu conexión.';
      errorType = 'Error de servidor';
    } else if (error.code === 'ETIMEOUT') {
      errorMessage = 'Timeout al conectar con MongoDB. Intenta nuevamente.';
      errorType = 'Timeout';
    }

    console.error(`❌ ${errorType}:`, errorMessage);
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
      errorType: errorType,
      data: [
        // Datos de fallback para que el frontend funcione
        {
          _id: "fallback-1",
          name: "Especialista en Administración de Bases de Datos Oracle",
          institution: "Instituto SISE",
          year: "2022", 
          code: "COD-12345"
        },
        {
          _id: "fallback-2",
          name: "Desarrollador Web con Base de Datos",
          institution: "Instituto SISE",
          year: "2022",
          code: "COD-12346" 
        }
      ]
    });
    
  } finally {
    // Cerrar conexión de manera segura
    if (client) {
      try {
        await client.close();
        console.log('🔌 Conexión a MongoDB cerrada');
      } catch (closeError) {
        console.error('❌ Error cerrando conexión:', closeError);
      }
    }
  }
};