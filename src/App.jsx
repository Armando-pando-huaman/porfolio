import React, { useEffect, useState } from 'react';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('🔄 Iniciando aplicación...');
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        setLoading(true);
        setConnectionStatus('🔌 Conectando con la base de datos...');
        
        console.log('🔄 Iniciando fetch a /api/test');
        
        const response = await fetch('/api/test');
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 Datos recibidos:', data);
        
        if (data.success) {
          setConnectionStatus(`✅ CONEXIÓN EXITOSA - ${data.count} certificaciones encontradas`);
          setCertifications(data.certifications || []);
        } else {
          setConnectionStatus(`❌ Error en la API: ${data.error}`);
        }
        
      } catch (error) {
        console.error('❌ Error completo:', error);
        setConnectionStatus(`❌ Error de conexión: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>Armando Pando Huaman</h1>
          <p style={{ color: '#666', fontSize: '18px', margin: '0' }}>Desarrollador Full Stack Junior</p>
        </header>

        {/* Status Section */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Estado de la Conexión</h2>
          <div style={{ 
            padding: '15px', 
            borderRadius: '8px', 
            backgroundColor: loading ? '#fff3cd' : connectionStatus.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${loading ? '#ffeaa7' : connectionStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            color: loading ? '#856404' : connectionStatus.includes('✅') ? '#155724' : '#721c24'
          }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #f3f3f3', borderTop: '2px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>{connectionStatus}</span>
              </div>
            ) : (
              connectionStatus
            )}
          </div>
        </section>

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <section>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
              📊 Mis Certificaciones ({certifications.length})
            </h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {certifications.map((cert, index) => (
                <div key={index} style={{ 
                  border: '1px solid #e0e0e0', 
                  padding: '20px', 
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>
                    {cert.name}
                  </h3>
                  <p style={{ margin: '0 0 8px 0', color: '#7f8c8d', fontSize: '16px' }}>
                    🏛️ {cert.institution}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#95a5a6', fontSize: '14px' }}>📅 {cert.year}</span>
                    <span style={{ 
                      backgroundColor: '#3498db', 
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {cert.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && certifications.length === 0 && connectionStatus.includes('✅') && (
          <section style={{ textAlign: 'center', padding: '40px 20px', color: '#7f8c8d' }}>
            <p>✅ La conexión a MongoDB funciona correctamente</p>
            <p>Pero no se encontraron certificaciones en la base de datos.</p>
            <p>Verifica que la colección "certifications" tenga documentos.</p>
          </section>
        )}

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;