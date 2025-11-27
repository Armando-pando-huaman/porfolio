const { MongoClient } = require('mongodb');

async function connectToDatabase() {
  // CAMBIO: MONGODB_URL → MONGODB_URI
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI no configurada');
    return null;
  }

  try {
    // CAMBIO: MONGODB_URL → MONGODB_URI
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    return {
      client,
      db: client.db('portfolio')
    };
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const connection = await connectToDatabase();
    
    if (!connection) {
      return res.status(200).json({
        ...staticProfile,
        _source: 'static_data',
        message: 'MONGODB_URL no configurada - usando datos estáticos'
      });
    }

    const { db, client } = connection;
    const profile = await db.collection('profile').findOne({});
    
    await client.close();

    if (profile) {
      return res.status(200).json({
        ...profile,
        _source: 'mongodb_database'
      });
    } else {
      return res.status(200).json({
        ...staticProfile,
        _source: 'static_data_empty_db',
        message: 'Conectado a MongoDB pero no hay datos'
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(200).json({
      ...staticProfile,
      _source: 'static_data_error',
      error: error.message,
      message: 'Error de conexión - usando datos estáticos'
    });
  }
};