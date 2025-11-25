export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Probar conexión a MongoDB
    const { MongoClient } = await import('mongodb');
    
    const uri = process.env.MONGODB_URI;
    let mongoStatus = '❌ No configurada';
    let dbInfo = null;

    if (uri) {
      try {
        const client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 3000,
        });
        await client.connect();
        const db = client.db("porfolio");
        const collections = await db.listCollections().toArray();
        
        mongoStatus = '✅ Conectada';
        dbInfo = {
          database: 'porfolio',
          collections: collections.map(col => col.name),
          totalCollections: collections.length
        };
        
        await client.close();
      } catch (mongoError) {
        mongoStatus = `❌ Error: ${mongoError.message}`;
      }
    }

    const healthInfo = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      mongodb: {
        status: mongoStatus,
        uri_configured: !!uri,
        ...dbInfo
      },
      vercel: {
        region: process.env.VERCEL_REGION,
        environment: process.env.VERCEL_ENV,
        url: process.env.VERCEL_URL
      }
    };

    console.log('🔍 Health check:', healthInfo);

    res.status(200).json(healthInfo);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}