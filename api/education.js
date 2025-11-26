import { connectToDatabase } from '../src/utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    switch (req.method) {
      case 'GET':
        const education = await db.collection('education').find({}).toArray();
        res.status(200).json(education);
        break;
      
      case 'POST':
        const educationItem = req.body;
        const result = await db.collection('education').insertOne(educationItem);
        res.status(201).json(result);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}