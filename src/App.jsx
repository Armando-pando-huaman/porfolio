import React, { useState, useEffect } from 'react'

function App() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test básico de conexión
    fetch('/api/profile')
      .then(response => response.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 ¡Portfolio Funcionando!</h1>
      <p>La conexión básica está funcionando correctamente.</p>
      
      {profile ? (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h2>Datos de Perfil:</h2>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Título:</strong> {profile.title}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px', padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
          <p>❌ No se pudieron cargar los datos del perfil</p>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Prueba de APIs:</h3>
        <button onClick={() => fetch('/api/profile').then(r => r.json()).then(console.log)}>
          Test Profile API
        </button>
        <button onClick={() => fetch('/api/projects').then(r => r.json()).then(console.log)}>
          Test Projects API
        </button>
      </div>
    </div>
  )
}

export default App