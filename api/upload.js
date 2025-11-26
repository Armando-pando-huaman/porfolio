const clientPromise = require('../src/utils/mongodb');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    // Para subida de archivos, necesitaríamos un middleware como multer
    // Pero en Vercel Functions es más complejo, así que usaremos base64 por ahora
    const { imageData, fileName, collection, documentId } = req.body;
    
    if (!imageData || !fileName) {
      return res.status(400).json({ error: 'Datos de imagen requeridos' });
    }

    // Guardar la imagen en base64 en la colección correspondiente
    const imageDoc = {
      fileName,
      imageData,
      uploadedAt: new Date(),
      collection,
      documentId
    };

    const result = await db.collection('uploads').insertOne(imageDoc);
    
    res.status(200).json({ 
      success: true, 
      imageId: result.insertedId,
      message: 'Imagen subida correctamente'
    });
    
  } catch (error) {
    console.error('Error en API upload:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
}

module.exports = handler;