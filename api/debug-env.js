module.exports = async function handler(req, res) {
  const envInfo = {
    // CAMBIO: MONGODB_URL → MONGODB_URI
    hasMongoDB: !!process.env.MONGODB_URI,
    mongoUrlPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
      'NO CONFIGURADA',
    allEnvVars: Object.keys(process.env),
    apiPackageJson: 'COMMONJS',
    rootPackageJson: 'MODULE'
  };

  res.status(200).json(envInfo);
};