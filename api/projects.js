import { connectToDatabase } from '../src/utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    switch (req.method) {
      case 'GET':
        const projects = await db.collection('projects').find({}).toArray();
        res.status(200).json(projects);
        break;
      
      case 'POST':
        const project = req.body;
        const result = await db.collection('projects').insertOne(project);
        res.status(201).json(result);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}