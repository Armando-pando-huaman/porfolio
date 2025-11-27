import React, { useState, useEffect } from 'react';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`${data.error}: ${data.message}`);
      }
      
      setProfile(data);
    } catch (err) {
      setError(err.message);
      // Intentar obtener más detalles
      try {
        const detailResponse = await fetch('/api/profile');
        const detailData = await detailResponse.json();
        setErrorDetails(detailData);
      } catch (e) {
        setErrorDetails({ message: 'No se pudieron obtener detalles del error' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🔄 Probando conexión a MongoDB...</h1>
        <p>Esto puede tomar unos segundos</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>❌ Error de conexión a MongoDB</h1>
        <p><strong>Error:</strong> {error}</p>
        
        {errorDetails && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#fff0f0', 
            borderRadius: '8px',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '20px auto'
          }}>
            <h3>Detalles técnicos:</h3>
            <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <h3>🔧 Posibles soluciones:</h3>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <li>Verifica que la variable MONGODB_URL esté configurada en Vercel</li>
            <li>Revisa que la contraseña de MongoDB sea correcta</li>
            <li>Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas</li>
            <li>Verifica que el cluster esté activo en MongoDB Atlas</li>
          </ul>
        </div>
        
        <button 
          onClick={testConnection}
          style={{ 
            padding: '10px 20px', 
            marginTop: '20px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 ¡Conexión exitosa a MongoDB!</h1>
      <p>Los datos se están cargando correctamente desde la base de datos</p>
      
      {profile && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f0f8f0', 
          borderRadius: '10px',
          textAlign: 'left',
          maxWidth: '500px',
          margin: '30px auto'
        }}>
          <h2>📊 Datos cargados desde MongoDB:</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;