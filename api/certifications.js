import { MongoClient } from 'mongodb';

// ✅ Cluster que SÍ funciona (de tu sistema de cobranza)
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
    console.log('🔌 Conectando a MongoDB...');
    
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });

    await client.connect();
    console.log('✅ Conectado a MongoDB exitosamente');

    const db = client.db("porfolio");
    
    // Intentar obtener certificaciones
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log(`📊 ${certifications.length} certificaciones encontradas`);

    return res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      data: certifications,
      count: certifications.length
    });

  } catch (error) {
    console.error('❌ Error en MongoDB:', error);
    
    // Datos de respaldo
    const fallbackData = [
      {
        _id: "1",
        name: "Especialista en Administración de Bases de Datos Oracle",
        institution: "Instituto SISE",
        year: "2022",
        category: "Bases de Datos",
        code: "COD-12345"
      },
      {
        _id: "2",
        name: "Desarrollador Web con Base de Datos",
        institution: "Instituto SISE",
        year: "2022",
        category: "Desarrollo Web", 
        code: "COD-12346"
      },
      {
        _id: "3",
        name: "Networking Essentials CISCO",
        institution: "Instituto SISE",
        year: "2018",
        category: "Redes",
        code: "COD-12347"
      }
    ];
    
    return res.status(200).json({
      success: false,
      error: error.message,
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