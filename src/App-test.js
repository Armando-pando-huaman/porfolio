import React, { useEffect, useState } from 'react';
import { testMongoDBConnection } from './services/testConnection.js';

function AppTest() {
  const [connectionStatus, setConnectionStatus] = useState('Probando...');
  const [data, setData] = useState(null);

  useEffect(() => {
    async function testConnection() {
      const result = await testMongoDBConnection();
      setConnectionStatus(result.success ? '✅ CONEXIÓN EXITOSA' : '❌ ERROR');
      setData(result);
    }
    
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔌 Prueba de Conexión MongoDB</h1>
      <h2>Estado: {connectionStatus}</h2>
      
      {data && data.success && (
        <div>
          <h3>📊 Datos encontrados: {data.count} certificaciones</h3>
          <pre>{JSON.stringify(data.certifications, null, 2)}</pre>
        </div>
      )}
      
      {data && !data.success && (
        <div>
          <h3>❌ Error:</h3>
          <p>{data.error}</p>
        </div>
      )}
    </div>
  );
}

export default AppTest;