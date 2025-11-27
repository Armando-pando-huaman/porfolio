module.exports = async function handler(req, res) {
  const envInfo = {
    hasMongoDB: !!process.env.MONGODB_URL,
    mongoUrlPreview: process.env.MONGODB_URL ? 
      process.env.MONGODB_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
      'NO CONFIGURADA',
    allEnvVars: Object.keys(process.env),
    apiPackageJson: 'COMMONJS',
    rootPackageJson: 'MODULE'
  };

  res.status(200).json(envInfo);
};