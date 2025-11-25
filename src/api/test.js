import clientPromise from '../src/utils/database.js';

export default async function handler(req, res) {
  try {
    console.log('🔌 Conectando a MongoDB...');
    
    const client = await clientPromise;
    const db = client.db("porfolio");
    
    console.log('✅ Conectado a MongoDB');
    
    // Verificar conexión y obtener certificaciones
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    console.log(`📊 Encontradas ${certifications.length} certificaciones`);
    
    res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      certifications: certifications,
      count: certifications.length
    });
    
  } catch (error) {
    console.error('❌ Error en API:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      certifications: []
    });
  }
}