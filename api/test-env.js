export default async function handler(req, res) {
  try {
    res.status(200).json({
      message: "Test de variables de entorno",
      mongodb_url: process.env.MONGODB_URL ? "✅ EXISTE" : "❌ NO EXISTE",
      node_env: process.env.NODE_ENV,
      // No muestres la URL completa por seguridad
      url_length: process.env.MONGODB_URL ? process.env.MONGODB_URL.length : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}