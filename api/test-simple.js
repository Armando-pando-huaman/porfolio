export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Solo verificar que la variable existe
    const hasMongoUrl = !!process.env.MONGODB_URL;
    const urlPreview = process.env.MONGODB_URL ? 
      process.env.MONGODB_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
      'NO CONFIGURADA';

    res.status(200).json({
      status: '✅ API funcionando',
      hasMongoUrl: hasMongoUrl,
      mongoUrlPreview: urlPreview,
      message: hasMongoUrl ? 
        'Variable MONGODB_URL encontrada' : 
        'Variable MONGODB_URL NO configurada en Vercel'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}