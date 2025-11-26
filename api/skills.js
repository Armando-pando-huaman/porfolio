const clientPromise = require('../src/utils/mongodb');

async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');

    switch (req.method) {
      case 'GET':
        const skills = await db.collection('skills').findOne({});
        res.status(200).json(skills || {});
        break;

      case 'POST':
        // Asumimos que solo hay un documento de skills
        const result = await db.collection('skills').updateOne(
          {},
          { $set: req.body },
          { upsert: true }
        );
        res.status(200).json({ success: true, result });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error en API skills:', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
}

module.exports = handler;