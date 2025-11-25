import React, { useEffect, useState } from 'react';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Iniciando prueba...');
  const [certifications, setCertifications] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        setConnectionStatus('🔌 Cargando módulo MongoDB...');
        
        // Importación dinámica para mejor debug
        const { MongoClient } = await import('mongodb');
        setDebugInfo('Paso 1: MongoDB importado');
        
        const uri = "mongodb+srv://Armandopando:Nino.1412@cluster0.pmy61xe.mongodb.net/porfolio";
        setConnectionStatus('🔌 Conectando a: ' + uri.substring(0, 30) + '...');
        
        const client = new MongoClient(uri);
        setDebugInfo('Paso 2: Cliente creado, intentando conexión...');
        
        await client.connect();
        setDebugInfo('Paso 3: ✅ Conexión exitosa!');
        
        const db = client.db("porfolio");
        setDebugInfo('Paso 4: DB obtenida, buscando certificaciones...');
        
        const certifications = await db.collection("certifications")
          .find({})
          .sort({ order: 1 })
          .toArray();
        
        setDebugInfo(`Paso 5: Encontradas ${certifications.length} certificaciones`);
        setConnectionStatus(`✅ CONEXIÓN EXITOSA - ${certifications.length} certificaciones`);
        setCertifications(certifications);
        
        await client.close();
        
      } catch (error) {
        setConnectionStatus('❌ Error de conexión');
        setDebugInfo(`Error: ${error.message}`);
        console.error('Error completo:', error);
        
        // Información específica del error
        if (error.message.includes('auth failed')) {
          setDebugInfo('Error: Autenticación falló - Verifica usuario/contraseña');
        } else if (error.message.includes('ENOTFOUND')) {
          setDebugInfo('Error: No se puede encontrar el servidor de MongoDB');
        } else if (error.message.includes('network')) {
          setDebugInfo('Error: Problema de red - Verifica tu conexión');
        }
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Armando Pando - Portfolio</h1>
      <h2>Estado: {connectionStatus}</h2>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '14px', 
        color: '#666',
        margin: '10px 0'
      }}>
        {debugInfo}
      </div>
      
      {certifications.length > 0 && (
        <div>
          <h3>📊 Certificaciones encontradas: {certifications.length}</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
            {certifications.map((cert, index) => (
              <div key={cert._id?.$oid || index} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{cert.name}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>{cert.institution}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: '14px' }}>{cert.year}</span>
                  <span style={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {cert.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;