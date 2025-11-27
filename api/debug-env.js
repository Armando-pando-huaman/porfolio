export default async function handler(req, res) {
  // Mostrar todas las variables de entorno (sin valores sensibles)
  const envInfo = {
    hasMongoDB: !!process.env.MONGODB_URL,
    mongoUrlLength: process.env.MONGODB_URL ? process.env.MONGODB_URL.length : 0,
    mongoUrlPreview: process.env.MONGODB_URL ? 
      process.env.MONGODB_URL.substring(0, 50) + '...' : 
      'NO CONFIGURADA',
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes('MONGO') || key.includes('VERCEL') || key.includes('NODE')
    ),
    nodeEnv: process.env.NODE_ENV
  };

  res.status(200).json(envInfo);
}