import { connectToDatabase } from '../src/utils/mongodb.js';

const fallbackProfile = {
  name: "Armando Pando",
  title: "Desarrollador Full Stack Junior",
  email: "armandopando27@gmail.com",
  phone: "+51 904 683 731",
  location: "Lima, Perú",
  about: "Desarrollador Full Stack Junior con experiencia en más de 18 proyectos de desarrollo web utilizando arquitectura MVC, APIs RESTful y bases de datos relacionales.",
  socialLinks: {
    github: "https://github.com/armandopando",
    linkedin: "https://www.linkedin.com/in/armando-pando-huaman"
  }
};

export default async function handler(req, res) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Si no hay variable de entorno, usar fallback
  if (!process.env.MONGODB_URL) {
    return res.status(200).json({
      ...fallbackProfile,
      _source: 'fallback_no_env_var',
      message: 'Variable MONGODB_URL no configurada en Vercel'
    });
  }

  try {
    const { db } = await connectToDatabase();
    const profile = await db.collection('profile').findOne({});

    if (!profile) {
      return res.status(200).json({
        ...fallbackProfile,
        _source: 'fallback_empty_collection',
        message: 'La colección profile está vacía en MongoDB'
      });
    }

    return res.status(200).json({
      ...profile,
      _source: 'mongodb_database'
    });

  } catch (error) {
    console.error('Error de MongoDB:', error);

    return res.status(200).json({
      ...fallbackProfile,
      _source: 'fallback_connection_error',
      error: error.message,
      message: 'Error de conexión a MongoDB - usando datos de respaldo'
    });
  }
}