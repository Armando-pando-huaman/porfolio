import { connectToDatabase } from '../src/utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    switch (req.method) {
      case 'GET':
        const profile = await db.collection('profile').findOne({});
        res.status(200).json(profile);
        break;
      
      case 'POST':
        const profileData = req.body;
        const result = await db.collection('profile').updateOne(
          {}, 
          { $set: profileData }, 
          { upsert: true }
        );
        res.status(200).json(result);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}