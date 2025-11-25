import React, { useState, useEffect } from 'react';
import './styles/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('');

  // Datos estáticos
  const datosPersonales = {
    nombre: "Armando Edgardo Pando Huaman",
    titulo: "Desarrollador Full Stack Junior",
    ubicacion: "Lima, Perú",
    telefono: "+51 904 683 731",
    email: "armandopando27@gmail.com",
    linkedin: "https://www.linkedin.com/in/armando-pando-huaman",
    perfil: "Desarrollador Full Stack Junior con experiencia en más de 18 proyectos de desarrollo web utilizando arquitectura MVC, APIs RESTful y bases de datos relacionales. Especializado en crear soluciones end-to-end, desde el diseño de bases de datos hasta interfaces de usuario responsivas."
  };

  const experiencia = [
    {
      empresa: "OROCOM SAC",
      puesto: "Desarrollador Full Stack Junior",
      periodo: "Julio 2023 - Presente",
      logros: [
        "Desarrollé e implementé 18+ proyectos utilizando arquitectura MVC con PHP, .NET y JavaScript",
        "Diseñé y construí 10+ APIs RESTful para integración de servicios",
        "Optimicé el rendimiento en 30% de aplicaciones web mediante técnicas SEO",
        "Implementé sistemas de autenticación y autorización en 8 aplicaciones web"
      ],
      tecnologias: ["PHP", ".NET", "JavaScript", "MySQL", "APIs RESTful", "SEO"]
    },
    {
      empresa: "Freelancer",
      puesto: "Desarrollador de Software Independiente",
      periodo: "Enero 2022 - Julio 2023",
      logros: [
        "Desarrollé 7+ proyectos full stack para diversos clientes",
        "Diseñé y construí bases de datos relacionales optimizadas para 5+ aplicaciones",
        "Creé interfaces responsivas adaptadas a dispositivos móviles"
      ],
      tecnologias: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript"]
    }
  ];

  const proyectos = [
    {
      nombre: "Sistema de Gestión de Vacaciones",
      descripcion: "Sistema automatizado de acumulación de días de vacaciones con cálculo progresivo",
      tecnologias: ["PHP", "MySQL", "JavaScript", "Bootstrap", "APIs RESTful"],
      resultados: ["Reduje en 90% el tiempo de procesamiento manual", "Mejoré la precisión en el cálculo de días"]
    },
    {
      nombre: "Sistema de Diagnóstico de Infraestructura",
      descripcion: "Sistema de monitoreo y optimización de infraestructura con Docker",
      tecnologias: ["Docker", "Linux", "Bash", "Herramientas de monitoreo"],
      resultados: ["Aumenté la estabilidad del sistema en 70%", "Reduje tiempos de inactividad en 85%"]
    }
  ];

  const habilidades = {
    frontend: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Tailwind CSS", "jQuery", "React.js"],
    backend: ["PHP", "Java", ".NET", "Python", "Node.js", "APIs RESTful"],
    basesDatos: ["MySQL", "SQL Server", "MongoDB", "Diseño de esquemas"],
    devops: ["Git", "Docker", "CI/CD", "Apache", "Nginx", "Metodologías Ágiles"]
  };

  // Función para cargar certificaciones desde MongoDB
  const loadCertifications = async () => {
    setLoading(true);
    setDbStatus('🔄 Cargando certificaciones...');
    
    try {
      const response = await fetch('/api/certifications');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCertifications(result.data);
        setDbStatus(`✅ ${result.count} certificaciones cargadas desde MongoDB`);
      } else {
        setDbStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cargando certificaciones:', error);
      setDbStatus(`❌ Error de conexión: ${error.message}`);
      
      // Datos de ejemplo si falla la conexión
      setCertifications([
        {
          _id: { $oid: "1" },
          name: "Especialista en Administración de Bases de Datos Oracle",
          institution: "Instituto SISE",
          year: "2022",
          code: "COD-12345"
        },
        {
          _id: { $oid: "2" },
          name: "Desarrollador Web con Base de Datos",
          institution: "Instituto SISE", 
          year: "2022",
          code: "COD-12346"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar certificaciones cuando se monta el componente
  useEffect(() => {
    loadCertifications();
  }, []);

  return (
    <div className="portfolio">
      {/* Header y Navegación */}
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h1>Armando Pando</h1>
            <span>Desarrollador Full Stack</span>
          </div>
          <div className="nav-links">
            {['inicio', 'experiencia', 'proyectos', 'habilidades', 'certificaciones'].map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <section className="section hero">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Hola, soy <span className="highlight">{datosPersonales.nombre}</span></h1>
                <h2>{datosPersonales.titulo}</h2>
                <p className="hero-description">{datosPersonales.perfil}</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <span>📍</span>
                    <span>{datosPersonales.ubicacion}</span>
                  </div>
                  <div className="contact-item">
                    <span>📞</span>
                    <span>{datosPersonales.telefono}</span>
                  </div>
                  <div className="contact-item">
                    <span>📧</span>
                    <span>{datosPersonales.email}</span>
                  </div>
                </div>
                <div className="hero-buttons">
                  <a href={datosPersonales.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    LinkedIn
                  </a>
                  <button className="btn btn-secondary" onClick={() => setActiveSection('certificaciones')}>
                    Ver Certificaciones
                  </button>
                </div>
              </div>
              <div className="hero-image">
                <div className="profile-placeholder">
                  <span>👨‍💻</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sección Experiencia */}
        {activeSection === 'experiencia' && (
          <section className="section">
            <h2>Experiencia Laboral</h2>
            <div className="experiencia-grid">
              {experiencia.map((exp, index) => (
                <div key={index} className="experiencia-card">
                  <div className="experiencia-header">
                    <h3>{exp.empresa}</h3>
                    <span className="periodo">{exp.periodo}</span>
                  </div>
                  <h4>{exp.puesto}</h4>
                  <ul className="logros-list">
                    {exp.logros.map((logro, i) => (
                      <li key={i}>{logro}</li>
                    ))}
                  </ul>
                  <div className="tecnologias">
                    {exp.tecnologias.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sección Proyectos */}
        {activeSection === 'proyectos' && (
          <section className="section">
            <h2>Proyectos Destacados</h2>
            <div className="proyectos-grid">
              {proyectos.map((proyecto, index) => (
                <div key={index} className="proyecto-card">
                  <h3>{proyecto.nombre}</h3>
                  <p>{proyecto.descripcion}</p>
                  <div className="tecnologias">
                    {proyecto.tecnologias.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="resultados">
                    <h4>Resultados:</h4>
                    <ul>
                      {proyecto.resultados.map((resultado, i) => (
                        <li key={i}>{resultado}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sección Habilidades */}
        {activeSection === 'habilidades' && (
          <section className="section">
            <h2>Habilidades Técnicas</h2>
            <div className="habilidades-grid">
              <div className="habilidad-categoria">
                <h3>🖥️ Frontend</h3>
                <div className="habilidades-list">
                  {habilidades.frontend.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="habilidad-categoria">
                <h3>⚙️ Backend</h3>
                <div className="habilidades-list">
                  {habilidades.backend.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="habilidad-categoria">
                <h3>🗄️ Bases de Datos</h3>
                <div className="habilidades-list">
                  {habilidades.basesDatos.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="habilidad-categoria">
                <h3>🔧 DevOps & Herramientas</h3>
                <div className="habilidades-list">
                  {habilidades.devops.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sección Certificaciones */}
        {activeSection === 'certificaciones' && (
          <section className="section">
            <h2>Certificaciones</h2>
            
            {/* Estado de la base de datos */}
            <div className="db-status" style={{
              padding: '1rem',
              marginBottom: '2rem',
              borderRadius: '10px',
              background: dbStatus.includes('✅') ? '#d4edda' : 
                         dbStatus.includes('❌') ? '#f8d7da' : '#fff3cd',
              color: dbStatus.includes('✅') ? '#155724' : 
                    dbStatus.includes('❌') ? '#721c24' : '#856404',
              border: `1px solid ${dbStatus.includes('✅') ? '#c3e6cb' : 
                              dbStatus.includes('❌') ? '#f5c6cb' : '#ffeaa7'}`,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {dbStatus}
              {loading && (
                <div style={{ 
                  display: 'inline-block',
                  marginLeft: '10px',
                  width: '20px',
                  height: '20px',
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
            </div>

            <div className="certificaciones-grid">
              {certifications.map((cert, index) => (
                <div key={cert._id?.$oid || index} className="certificacion-card">
                  <h3>{cert.name}</h3>
                  <p className="institucion">{cert.institution}</p>
                  <div className="certificacion-footer">
                    <span className="año">{cert.year}</span>
                    <span className="codigo">{cert.code}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón para recargar */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button 
                onClick={loadCertifications}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '🔄 Cargando...' : '🔄 Actualizar Certificaciones'}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Armando Pando Huaman. Todos los derechos reservados.</p>
        <p>Desarrollado con React, Vite y MongoDB</p>
      </footer>

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