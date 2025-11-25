import clientPromise from '../src/utils/database.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔌 Conectando a MongoDB...');
    
    const client = await clientPromise;
    const db = client.db("porfolio");
    
    console.log('✅ Conectado a MongoDB');
    
    // Obtener certificaciones
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    console.log(`📊 Encontradas ${certifications.length} certificaciones`);
    
    return res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      certifications: certifications,
      count: certifications.length
    });
    
  } catch (error) {
    console.error('❌ Error en API:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      certifications: []
    });
  }
}