import { connectToDatabase } from '../src/utils/mongodb.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    
    if (req.method === 'GET') {
      const profile = await db.collection('profile').findOne({});
      
      if (!profile) {
        return res.status(404).json({ 
          error: 'Perfil no encontrado',
          message: 'No hay datos en la base de datos' 
        });
      }
      
      res.status(200).json(profile);
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API profile:', error);
    res.status(500).json({ 
      error: 'Error del servidor',
      message: error.message 
    });
  }
}