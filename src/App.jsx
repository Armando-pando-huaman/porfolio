import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Test API connection
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Cargando Portfolio...</h1>
      </div>
    )
  }

  return (
    <div className="App">
      <header style={{ padding: '20px', background: '#f5f5f5' }}>
        <h1>Portfolio de {profile?.name || 'Armando Pando'}</h1>
        <p>{profile?.title || 'Desarrollador Full Stack'}</p>
        {profile ? (
          <div>
            <p>Email: {profile.email}</p>
            <p>Teléfono: {profile.phone}</p>
            <p>Ubicación: {profile.location}</p>
          </div>
        ) : (
          <p>No se pudieron cargar los datos del perfil</p>
        )}
      </header>

      <main style={{ padding: '20px' }}>
        <section>
          <h2>Proyectos Destacados</h2>
          <p>Los proyectos se cargarán pronto...</p>
        </section>

        <section>
          <h2>Habilidades Técnicas</h2>
          <p>Las habilidades se cargarán pronto...</p>
        </section>

        <section>
          <h2>Experiencia</h2>
          <p>La experiencia se cargará pronto...</p>
        </section>
      </main>

      <footer style={{ padding: '20px', background: '#333', color: 'white', textAlign: 'center' }}>
        <p>&copy; 2024 Armando Pando. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App