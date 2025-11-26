import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Hero from './components/Hero.jsx';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

// Estructuras vacías por defecto
const emptyData = {
  profile: {
    name: "",
    title: "",
    location: "",
    phone: "",
    email: "",
    linkedin: "",
    description: "",
    availability: "",
    english: "",
    image: "" // Para la foto de perfil
  },
  experiences: [],
  projects: [],
  certifications: [],
  skills: {
    frontend: [],
    backend: [],
    databases: [],
    devops: [],
    infrastructure: []
  }
};

function App() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [usingDefaultData, setUsingDefaultData] = useState(false);

  const fetchData = async () => {
    try {
      const endpoints = [
        '/api/profile',
        '/api/experiences', 
        '/api/projects',
        '/api/certifications',
        '/api/skills'
      ];

      const responses = await Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(endpoint)
            .then(res => {
              if (!res.ok) throw new Error('Network response was not ok');
              return res.json();
            })
        )
      );

      const allFailed = responses.every(response => response.status === 'rejected');
      
      if (allFailed) {
        setUsingDefaultData(true);
        console.log('🔧 Modo demo: Sin conexión a MongoDB');
      } else {
        // Combinar datos vacíos con los datos de la API
        setData({
          profile: responses[0].status === 'fulfilled' && Object.keys(responses[0].value).length > 0 
            ? { ...emptyData.profile, ...responses[0].value } 
            : emptyData.profile,
          experiences: responses[1].status === 'fulfilled' && responses[1].value.length > 0 
            ? responses[1].value 
            : emptyData.experiences,
          projects: responses[2].status === 'fulfilled' && responses[2].value.length > 0 
            ? responses[2].value 
            : emptyData.projects,
          certifications: responses[3].status === 'fulfilled' && responses[3].value.length > 0 
            ? responses[3].value 
            : emptyData.certifications,
          skills: responses[4].status === 'fulfilled' && Object.keys(responses[4].value).length > 0 
            ? { ...emptyData.skills, ...responses[4].value } 
            : emptyData.skills
        });
        setUsingDefaultData(false);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setUsingDefaultData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div className="loading-text">Cargando portfolio...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {usingDefaultData && (
        <div className="demo-banner">
          <div className="demo-message">
            ⚠️ Modo demostración - Conecta MongoDB en Vercel para gestionar tu contenido
          </div>
        </div>
      )}
      <Header profile={data.profile} />
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <Experience experiences={data.experiences} />
      <Projects projects={data.projects} />
      <Skills skills={data.skills} />
      <Education profile={data.profile} />
      <Certifications certifications={data.certifications} />
      <Contact profile={data.profile} />
      {!usingDefaultData && <AdminPanel onDataUpdate={fetchData} />}
    </div>
  );
}

export default App;