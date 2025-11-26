const clientPromise = require('../src/utils/mongodb');

async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');

    switch (req.method) {
      case 'GET':
        const experiences = await db.collection('experiences').find({}).toArray();
        res.status(200).json(experiences);
        break;

      case 'POST':
        const result = await db.collection('experiences').insertOne(req.body);
        res.status(200).json({ success: true, result });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error en API experiences:', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
}

module.exports = handler;