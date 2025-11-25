const { MongoClient } = require('mongodb');

// ✅ USA EL MISMO CLUSTER QUE TU SISTEMA DE COBRANZA (QUE SÍ FUNCIONA)
const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy6lxe.mongodb.net/porfolio?retryWrites=true&w=majority&appName=Cluster0";

module.exports = async (req, res) => {
  console.log('🚀 Iniciando API /certifications con cluster funcional');
  
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
      error: 'Método no permitido. Solo GET permitido.' 
    });
  }

  let client;

  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    console.log('📡 Cluster: cluster0.pmy6lxe.mongodb.net');
    console.log('👤 Usuario: Armandopando');
    console.log('📁 Base de datos: porfolio');
    
    // Configuración optimizada
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
    });

    console.log('⏳ Estableciendo conexión...');
    await client.connect();
    console.log('✅ ¡CONEXIÓN EXITOSA! Conectado a MongoDB Atlas');

    const db = client.db("porfolio");
    console.log('📊 Usando base de datos: porfolio');

    // Verificar qué colecciones existen
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log('📂 Colecciones disponibles:', collectionNames);

    // Verificar si la colección certifications existe
    if (!collectionNames.includes('certifications')) {
      console.log('⚠️  La colección "certifications" no existe. Creando colección y datos de ejemplo...');
      
      // Datos de ejemplo basados en tu CV
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
          name: "Gestor de Business Intelligence para Empresas", 
          institution: "Instituto SISE",
          year: "2022", 
          category: "Business Intelligence",
          code: "COD-12346",
          order: 2
        },
        {
          name: "Desarrollador Web con Base de Datos",
          institution: "Instituto SISE",
          year: "2022",
          category: "Desarrollo Web", 
          code: "COD-12347",
          order: 3
        },
        {
          name: "Networking Essentials CISCO",
          institution: "Instituto SISE", 
          year: "2018",
          category: "Redes",
          code: "COD-12348",
          order: 4
        },
        {
          name: "Comercio Electrónico",
          institution: "Google Activate",
          year: "2020",
          category: "E-commerce",
          code: "GOOGLE-001", 
          order: 5
        },
        {
          name: "Desarrollo de Apps Móviles",
          institution: "Google Activate",
          year: "2020",
          category: "Desarrollo Móvil",
          code: "GOOGLE-002",
          order: 6
        }
      ];

      // Insertar datos de ejemplo
      const result = await db.collection("certifications").insertMany(exampleCertifications);
      console.log(`📝 Insertados ${result.insertedCount} certificaciones de ejemplo`);

      return res.status(200).json({
        success: true,
        message: 'Colección creada con certificaciones de ejemplo',
        data: exampleCertifications,
        count: exampleCertifications.length,
        created: true
      });
    }

    // Si la colección existe, obtener los datos reales
    console.log('✅ Colección "certifications" encontrada, obteniendo datos...');
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log(`📊 Encontradas ${certifications.length} certificaciones en la base de datos`);

    // Si no hay certificaciones en la colección, insertar algunas
    if (certifications.length === 0) {
      console.log('ℹ️  La colección existe pero está vacía. Insertando datos de ejemplo...');
      
      const exampleData = [
        {
          name: "Certificación de Desarrollo Full Stack",
          institution: "Platzi", 
          year: "2023",
          category: "Desarrollo Web",
          code: "PLATZI-FS001",
          order: 1
        },
        {
          name: "Administración de Servidores Linux",
          institution: "Coursera",
          year: "2023",
          category: "DevOps", 
          code: "COURSERA-LINUX01",
          order: 2
        }
      ];

      await db.collection("certifications").insertMany(exampleData);
      const newCerts = await db.collection("certifications").find({}).toArray();
      
      return res.status(200).json({
        success: true,
        message: 'Datos de ejemplo insertados en colección existente',
        data: newCerts,
        count: newCerts.length,
        example: true
      });
    }

    // ÉXITO: Retornar las certificaciones encontradas
    console.log('🎉 Envío exitoso de certificaciones al frontend');
    return res.status(200).json({
      success: true,
      message: 'Certificaciones cargadas exitosamente desde MongoDB',
      data: certifications,
      count: certifications.length,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('❌ Error en API certifications:', error);
    
    // Manejar errores específicos con más detalle
    let errorMessage = error.message;
    let errorType = 'Error de conexión';
    
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'No se puede resolver el DNS del servidor de MongoDB.';
      errorType = 'Error de DNS';
    } else if (error.name === 'MongoServerSelectionError') {
      errorMessage = 'No se puede conectar al servidor de MongoDB. Verifica la conexión.';
      errorType = 'Error de servidor';
    } else if (error.code === 'ETIMEOUT') {
      errorMessage = 'Timeout al conectar con MongoDB. El servidor no respondió a tiempo.';
      errorType = 'Timeout de conexión';
    } else if (error.code === 13) {
      errorMessage = 'Error de autenticación. Verifica usuario y contraseña.';
      errorType = 'Error de autenticación';
    } else if (error.code === 18) {
      errorMessage = 'Error de autenticación. Usuario o contraseña incorrectos.';
      errorType = 'Error de credenciales';
    }

    console.error(`❌ ${errorType}:`, errorMessage);
    console.error('🔧 Stack trace:', error.stack);
    
    // Datos de fallback para que el frontend siempre funcione
    const fallbackCertifications = [
      {
        _id: "fallback-1",
        name: "Especialista en Administración de Bases de Datos Oracle",
        institution: "Instituto SISE",
        year: "2022", 
        category: "Bases de Datos",
        code: "COD-12345",
        order: 1
      },
      {
        _id: "fallback-2",
        name: "Desarrollador Web con Base de Datos",
        institution: "Instituto SISE",
        year: "2022",
        category: "Desarrollo Web",
        code: "COD-12346",
        order: 2
      },
      {
        _id: "fallback-3", 
        name: "Networking Essentials CISCO",
        institution: "Instituto SISE",
        year: "2018",
        category: "Redes",
        code: "COD-12347",
        order: 3
      },
      {
        _id: "fallback-4",
        name: "Comercio Electrónico",
        institution: "Google Activate", 
        year: "2020",
        category: "E-commerce",
        code: "GOOGLE-001",
        order: 4
      }
    ];
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
      errorType: errorType,
      data: fallbackCertifications,
      count: fallbackCertifications.length,
      fallback: true
    });
    
  } finally {
    // Cerrar conexión de manera segura
    if (client) {
      try {
        await client.close();
        console.log('🔌 Conexión a MongoDB cerrada correctamente');
      } catch (closeError) {
        console.error('❌ Error cerrando conexión:', closeError);
      }
    }
  }
};