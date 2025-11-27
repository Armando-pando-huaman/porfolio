export default async function handler(req, res) {
  return res.status(200).json({
    status: "✅ API funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasMongoDB: !!process.env.MONGODB_URL
  });
}