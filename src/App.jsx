import React, { useState, useEffect } from 'react';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🔄 Probando conexión a MongoDB...</h1>
        <p>Verificando que todo funcione correctamente</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>❌ Error de conexión</h1>
        <p><strong>Error:</strong> {error}</p>
        <button 
          onClick={testConnection}
          style={{ padding: '10px 20px', marginTop: '10px' }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 ¡Conexión exitosa!</h1>
      <p>MongoDB + React + Vercel funcionando correctamente</p>
      
      {profile && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '10px',
          textAlign: 'left',
          maxWidth: '500px',
          margin: '30px auto'
        }}>
          <h2>📊 Datos cargados desde MongoDB:</h2>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Título:</strong> {profile.title}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Ubicación:</strong> {profile.location}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>✅ Próximos pasos:</h3>
        <p>1. Agregar componentes Header y Hero</p>
        <p>2. Conectar más APIs (projects, skills, etc.)</p>
        <p>3. Agregar estilos y diseño</p>
      </div>
    </div>
  );
}

export default App;