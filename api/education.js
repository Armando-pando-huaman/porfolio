const clientPromise = require('../src/utils/mongodb');

async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');

    switch (req.method) {
      case 'GET':
        const education = await db.collection('education').find({}).toArray();
        res.status(200).json(education);
        break;

      case 'POST':
        const result = await db.collection('education').insertOne(req.body);
        res.status(200).json({ success: true, result });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error en API education:', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
}

module.exports = handler;