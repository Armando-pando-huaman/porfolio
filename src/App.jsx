import React, { useEffect, useState } from 'react';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Probando conexión...');
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('🔌 Iniciando prueba de conexión...');
        
        // Usar la ruta correcta de la API
        const response = await fetch('/api/test');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setConnectionStatus('✅ CONECTADO A MONGODB');
          setCertifications(data.certifications || []);
        } else {
          setConnectionStatus('❌ Error: ' + data.error);
        }
      } catch (error) {
        setConnectionStatus('❌ Error: ' + error.message);
        console.error('Error completo:', error);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Armando Pando - Portfolio</h1>
      <h2>Estado: {connectionStatus}</h2>
      
      {certifications.length > 0 && (
        <div>
          <h3>📊 Certificaciones encontradas: {certifications.length}</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
            {certifications.map((cert, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <h4>{cert.name}</h4>
                <p>{cert.institution} - {cert.year}</p>
                <small>Código: {cert.code}</small>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {connectionStatus.includes('✅') && certifications.length === 0 && (
        <p>✅ Conexión exitosa pero no hay certificaciones cargadas</p>
      )}
    </div>
  );
}

export default App;