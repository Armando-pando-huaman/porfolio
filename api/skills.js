import { connectToDatabase } from '../src/utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    switch (req.method) {
      case 'GET':
        const skills = await db.collection('skills').find({}).toArray();
        res.status(200).json(skills);
        break;
      
      case 'POST':
        const skill = req.body;
        const result = await db.collection('skills').insertOne(skill);
        res.status(201).json(result);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}