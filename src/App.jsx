import React, { useState, useEffect } from 'react';
import './styles/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');

  // Datos estáticos por ahora - después vendrán de MongoDB
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
    },
    {
      nombre: "Sistema de Gestión de Inventario",
      descripcion: "Aplicación web CRUD completa con informes en tiempo real y sistema de alertas",
      tecnologias: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
      resultados: ["Reduje errores de inventario en 45%", "Mejoré la precisión del stock en 60%"]
    }
  ];

  const habilidades = {
    frontend: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Tailwind CSS", "jQuery", "React.js"],
    backend: ["PHP", "Java", ".NET", "Python", "Node.js", "APIs RESTful"],
    basesDatos: ["MySQL", "SQL Server", "MongoDB", "Diseño de esquemas"],
    devops: ["Git", "Docker", "CI/CD", "Apache", "Nginx", "Metodologías Ágiles"]
  };

  const certificaciones = [
    {
      nombre: "Especialista en Administración de Bases de Datos Oracle",
      institucion: "Instituto SISE",
      año: "2022",
      codigo: "COD-12345"
    },
    {
      nombre: "Desarrollador Web con Base de Datos",
      institucion: "Instituto SISE", 
      año: "2022",
      codigo: "COD-12346"
    },
    {
      nombre: "Networking Essentials CISCO",
      institucion: "Instituto SISE",
      año: "2018",
      codigo: "COD-12347"
    }
  ];

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
                  <button className="btn btn-secondary" onClick={() => setActiveSection('proyectos')}>
                    Ver Proyectos
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
            <div className="certificaciones-grid">
              {certificaciones.map((cert, index) => (
                <div key={index} className="certificacion-card">
                  <h3>{cert.nombre}</h3>
                  <p className="institucion">{cert.institucion}</p>
                  <div className="certificacion-footer">
                    <span className="año">{cert.año}</span>
                    <span className="codigo">{cert.codigo}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Armando Pando Huaman. Todos los derechos reservados.</p>
        <p>Desarrollado con React y Vite</p>
      </footer>
    </div>
  );
}

export default App;