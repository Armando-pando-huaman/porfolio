import React, { useEffect, useState } from 'react';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Iniciando prueba...');
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    async function testConnection() {
      try {
        setConnectionStatus('🔌 Probando conexión simple...');
        
        // Conexión DIRECTA sin clientPromise
        const response = await fetch('/api/test-connection');
        const data = await response.json();
        
        if (data.success) {
          setConnectionStatus(`✅ CONEXIÓN EXITOSA - ${data.count} certificaciones`);
          setCertifications(data.certifications || []);
        } else {
          setConnectionStatus('❌ Error: ' + data.error);
        }
        
      } catch (error) {
        setConnectionStatus('❌ Error de conexión');
        console.error('Error:', error);
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
              <div key={index} style={{ 
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