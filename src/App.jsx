import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import './styles/App.css';

// URL base de las APIs
const API_URL = import.meta.env.PROD 
  ? '/api'  // En producción (Vercel)
  : '/api'; // En desarrollo (Vite proxy)

function App() {
  // Estados para cada sección
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  // Función para cargar todos los datos
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamar a todas las APIs en paralelo
      const [
        profileRes,
        experiencesRes,
        projectsRes,
        skillsRes,
        educationRes,
        certificationsRes
      ] = await Promise.all([
        fetch(`${API_URL}/profile`),
        fetch(`${API_URL}/experiences`),
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/skills`),
        fetch(`${API_URL}/education`),
        fetch(`${API_URL}/certifications`)
      ]);

      // Convertir respuestas a JSON
      const [
        profileData,
        experiencesData,
        projectsData,
        skillsData,
        educationData,
        certificationsData
      ] = await Promise.all([
        profileRes.json(),
        experiencesRes.json(),
        projectsRes.json(),
        skillsRes.json(),
        educationRes.json(),
        certificationsRes.json()
      ]);

      // Actualizar estados
      setProfile(profileData);
      setExperiences(experiencesData);
      setProjects(projectsData);
      setSkills(skillsData);
      setEducation(educationData);
      setCertifications(certificationsData);

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  // Mientras carga
  if (loading) {
    return (
      <div className="loading">
        <h2>Cargando portfolio...</h2>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="error">
        <h2>{error}</h2>
        <button onClick={loadAllData}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Education education={education} />
      <Certifications certifications={certifications} />
      <Contact profile={profile} />
    </div>
  );
}

export default App;