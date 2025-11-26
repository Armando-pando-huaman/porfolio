import { connectToDatabase } from '../src/utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    if (req.method === 'POST') {
      const fileData = req.body;
      const result = await db.collection('uploads').insertOne(fileData);
      res.status(201).json(result);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}