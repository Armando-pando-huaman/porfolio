import { connectToDatabase } from '../src/utils/mongodb.js';

// Datos estáticos de respaldo
const staticProfile = {
  name: "Armando Pando",
  title: "Desarrollador Full Stack Junior",
  email: "armandopando27@gmail.com",
  phone: "+51 904 683 731",
  location: "Lima, Perú",
  about: "Desarrollador Full Stack Junior con experiencia en más de 18 proyectos de desarrollo web.",
  socialLinks: {
    github: "https://github.com/armandopando",
    linkedin: "https://linkedin.com/in/armando-pando-huaman"
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Intentar conectar a MongoDB
    const connection = await connectToDatabase();
    
    if (!connection) {
      console.log('📦 Usando datos estáticos - MONGODB_URL no configurada');
      return res.status(200).json({
        ...staticProfile,
        _source: 'static_data',
        message: 'MONGODB_URL no configurada en Vercel - Usando datos estáticos'
      });
    }

    const { db } = connection;
    const profile = await db.collection('profile').findOne({});
    
    if (profile) {
      return res.status(200).json({
        ...profile,
        _source: 'mongodb_database'
      });
    } else {
      return res.status(200).json({
        ...staticProfile,
        _source: 'static_data_empty_db',
        message: 'Conectado a MongoDB pero no hay datos en la colección profile'
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(200).json({
      ...staticProfile,
      _source: 'static_data_error',
      error: error.message,
      message: 'Error de conexión - Usando datos estáticos'
    });
  }
}