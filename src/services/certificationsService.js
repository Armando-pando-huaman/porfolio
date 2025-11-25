import clientPromise from '../utils/database.js';

export async function getCertifications() {
  try {
    const client = await clientPromise;
    const db = client.db("porfolio");
    
    const certifications = await db.collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();
      
    return certifications;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}