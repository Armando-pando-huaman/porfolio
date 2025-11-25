import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://Armandopando:Mongo123@cluster0.pmy6lxe.mongodb.net/sistema_cobranza?retryWrites=true&w=majority&appName=Cluster0";
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
  console.log('🚀 API /certifications iniciada');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('🔌 Conectando a MongoDB...');
    
    const client = await connectToDatabase();
    console.log('✅ Conexión establecida');

    const db = client.db("porfolio");
    
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
      console.log('ℹ️  Colección "certifications" no existe aún');
    }

    return res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      data: certifications,
      count: certifications.length,
      collections: collectionNames
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
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
      },
      {
        _id: "7",
        name: "Fundamentos de Marketing Digital",
        institution: "Google Activate",
        year: "2020",
        category: "Marketing Digital",
        code: "GOOGLE-003",
        order: 7
      },
      {
        _id: "8",
        name: "Cloud Computing",
        institution: "Google Activate",
        year: "2020",
        category: "Cloud",
        code: "GOOGLE-004",
        order: 8
      },
      {
        _id: "9",
        name: "Python para Data Science",
        institution: "Coursera",
        year: "2021",
        category: "Data Science",
        code: "COURSE-001",
        order: 9
      },
      {
        _id: "10",
        name: "Git y GitHub Profesional",
        institution: "Platzi",
        year: "2021",
        category: "Control de Versiones",
        code: "PLATZI-001",
        order: 10
      }
    ];
    
    return res.status(200).json({
      success: false,
      error: error.message,
      data: fallbackData,
      count: fallbackData.length,
      fallback: true,
      note: "Usando datos de respaldo debido a error de conexión"
    });
  }
}