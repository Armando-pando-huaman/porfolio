import React from 'react';
import Certifications from './components/Certifications.js';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header style={{
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Armando Edgardo Pando Huaman</h1>
        <p>Desarrollador Full Stack Junior</p>
      </header>
      
      <section style={{ padding: '40px 20px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333'
        }}>
          Mis Certificaciones
        </h2>
        <Certifications />
      </section>
    </div>
  );
}

export default App;