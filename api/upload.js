const clientPromise = require('../src/utils/mongodb');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const { imageData, fileName, collection, documentId, type } = req.body;
    
    if (!imageData || !fileName) {
      return res.status(400).json({ error: 'Datos de imagen requeridos' });
    }

    const fileDoc = {
      fileName,
      fileData: imageData, // Base64 encoded
      type: type || 'image',
      uploadedAt: new Date(),
      collection,
      documentId
    };

    const result = await db.collection('files').insertOne(fileDoc);
    
    // Actualizar el documento principal con referencia al archivo
    if (collection && documentId) {
      const updateField = type === 'certificate' ? 'certificateImage' : 'image';
      await db.collection(collection).updateOne(
        { _id: new require('mongodb').ObjectId(documentId) },
        { $set: { [updateField]: result.insertedId.toString() } }
      );
    }
    
    res.status(200).json({ 
      success: true, 
      fileId: result.insertedId,
      message: 'Archivo subido correctamente'
    });
    
  } catch (error) {
    console.error('Error en API upload:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
}

module.exports = handler;