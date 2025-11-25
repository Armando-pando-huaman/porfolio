import clientPromise from '../utils/database.js';

export async function testMongoDBConnection() {
  try {
    console.log('🔌 Probando conexión a MongoDB...');
    
    const client = await clientPromise;
    const db = client.db("porfolio");
    
    console.log('✅ Conectado a MongoDB');
    
    // Verificar si la colección certifications existe
    const collections = await db.listCollections().toArray();
    const certCollection = collections.find(col => col.name === 'certifications');
    
    if (certCollection) {
      console.log('✅ Colección "certifications" encontrada');
      
      // Contar documentos en certifications
      const count = await db.collection('certifications').countDocuments();
      console.log(`📊 Documentos en certifications: ${count}`);
      
      // Mostrar los documentos
      const certifications = await db.collection('certifications').find({}).toArray();
      console.log('📋 Certificaciones:', certifications);
      
      return { success: true, count, certifications };
    } else {
      console.log('❌ Colección "certifications" NO encontrada');
      return { success: false, error: 'Collection not found' };
    }
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    return { success: false, error: error.message };
  }
}