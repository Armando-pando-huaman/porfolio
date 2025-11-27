export default async function handler(req, res) {
  // Muestra solo una parte de la URL por seguridad
  const mongoUrl = process.env.MONGODB_URL;
  const maskedUrl = mongoUrl ? mongoUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : null;

  return res.status(200).json({
    status: "✅ API funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasMongoDB: !!mongoUrl,
    mongoUrl: maskedUrl, // Solo muestra la URL enmascarada
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('VERCEL'))
  });
}