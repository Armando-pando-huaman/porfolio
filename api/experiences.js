import { connectToDatabase } from '../src/utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    switch (req.method) {
      case 'GET':
        const experiences = await db.collection('experiences').find({}).toArray();
        res.status(200).json(experiences);
        break;
      
      case 'POST':
        const experience = req.body;
        const result = await db.collection('experiences').insertOne(experience);
        res.status(201).json(result);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}