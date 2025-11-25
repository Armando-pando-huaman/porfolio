import { MongoClient } from 'mongodb';

// ⚠️ REVISA ESTA CONTRASEÑA - probablemente es diferente
const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy6lxe.mongodb.net/porfolio?retryWrites=true&w=majority&appName=Cluster0";

export default async function handler(req, res) {
  console.log('🚀 API /certifications iniciada');
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client;

  try {
    console.log('🔌 Intentando conexión a MongoDB...');
    
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    console.log('✅ ¡CONEXIÓN EXITOSA!');

    const db = client.db("porfolio");
    
    // Verificar si la colección existe
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log('📂 Colecciones:', collectionNames);

    let certifications = [];
    
    if (collectionNames.includes('certifications')) {
      certifications = await db.collection("certifications")
        .find({})
        .sort({ order: 1 })
        .toArray();
      console.log(`📊 ${certifications.length} certificaciones encontradas`);
    } else {
      console.log('ℹ️  Colección "certifications" no existe');
    }

    return res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      data: certifications,
      count: certifications.length,
      collections: collectionNames
    });

  } catch (error) {
    console.error('❌ Error en MongoDB:', error.message);
    
    // Manejar error de autenticación específicamente
    if (error.code === 8000 || error.message.includes('authentication failed')) {
      console.error('🔐 ERROR DE AUTENTICACIÓN: Contraseña incorrecta');
    }
    
    // Datos de respaldo MUY COMPLETOS
    const fallbackData = [
      {
        _id: "1",
        name: "Especialista en Administración de Bases de Datos Oracle",
        institution: "Instituto SISE",
        year: "2022",
        category: "Bases de Datos",
        code: "COD-12345",
        order: 1
      },
      {
        _id: "2",
        name: "Gestor de Business Intelligence para Empresas",
        institution: "Instituto SISE",
        year: "2022",
        category: "Business Intelligence", 
        code: "COD-12346",
        order: 2
      },
      {
        _id: "3",
        name: "Desarrollador Web con Base de Datos",
        institution: "Instituto SISE",
        year: "2022",
        category: "Desarrollo Web",
        code: "COD-12347",
        order: 3
      },
      {
        _id: "4",
        name: "Networking Essentials CISCO",
        institution: "Instituto SISE",
        year: "2018",
        category: "Redes",
        code: "COD-12348",
        order: 4
      },
      {
        _id: "5", 
        name: "Comercio Electrónico",
        institution: "Google Activate",
        year: "2020",
        category: "E-commerce",
        code: "GOOGLE-001",
        order: 5
      },
      {
        _id: "6",
        name: "Desarrollo de Apps Móviles",
        institution: "Google Activate", 
        year: "2020",
        category: "Desarrollo Móvil",
        code: "GOOGLE-002",
        order: 6
      }
    ];
    
    return res.status(200).json({
      success: false,
      error: "Error de autenticación: " + error.message,
      data: fallbackData,
      count: fallbackData.length,
      fallback: true
    });
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}