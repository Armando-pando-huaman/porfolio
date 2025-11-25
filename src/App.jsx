import React, { useState, useEffect } from 'react';
import './styles/App.css';
import AdminPanel from './components/AdminPanel';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('');
  
  // Estados para datos dinámicos
  const [personalData, setPersonalData] = useState(null);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState(null);
  const [certifications, setCertifications] = useState([]);

  // Estado para modo edición
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState('');

  // Función para cargar todos los datos desde MongoDB
  const loadAllData = async () => {
    setLoading(true);
    setDbStatus('🔄 Cargando datos desde MongoDB...');
    try {
      // Cargar datos personales
      const personalResponse = await fetch('/api/personal-data');
      const personalResult = await personalResponse.json();
      if (personalResult.success) setPersonalData(personalResult.data);

      // Cargar experiencia
      const expResponse = await fetch('/api/experience');
      const expResult = await expResponse.json();
      if (expResult.success) setExperience(expResult.data);

      // Cargar proyectos
      const projectsResponse = await fetch('/api/projects');
      const projectsResult = await projectsResponse.json();
      if (projectsResult.success) setProjects(projectsResult.data);

      // Cargar habilidades
      const skillsResponse = await fetch('/api/skills');
      const skillsResult = await skillsResponse.json();
      if (skillsResult.success) setSkills(skillsResult.data);

      // Cargar certificaciones
      const certResponse = await fetch('/api/certifications');
      const certResult = await certResponse.json();
      if (certResult.success) setCertifications(certResult.data);

      setDbStatus('✅ Datos cargados desde MongoDB');

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setDbStatus('❌ Error cargando datos desde MongoDB');
    } finally {
      setLoading(false);
    }
  };

  // Función para activar modo edición
  const enableEditMode = (section) => {
    setEditMode(true);
    setEditingSection(section);
    setActiveSection('admin');
  };

  // Función para desactivar modo edición
  const disableEditMode = () => {
    setEditMode(false);
    setEditingSection('');
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Renderizado condicional - mostrar mensajes si no hay datos
  const renderNoDataMessage = (section) => (
    <div style={{ 
      textAlign: 'center', 
      padding: '3rem',
      background: '#f8f9fa',
      borderRadius: '10px',
      border: '2px dashed #dee2e6'
    }}>
      <h3>📝 No hay {section} agregados</h3>
      <p>Ve al panel de administración para agregar tu información</p>
      <button 
        className="btn btn-primary"
        onClick={() => enableEditMode(section)}
      >
        ⚙️ Ir al Panel de Administración
      </button>
    </div>
  );

  return (
    <div className="portfolio">
      {/* Header y Navegación */}
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h1>{personalData?.nombre || "Mi Portfolio"}</h1>
            <span>{personalData?.titulo || "Desarrollador Full Stack"}</span>
          </div>
          <div className="nav-links">
            {['inicio', 'experiencia', 'proyectos', 'habilidades', 'certificaciones', 'admin'].map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(section);
                  if (section !== 'admin') disableEditMode();
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Estado de la base de datos */}
        <div className="db-status" style={{
          padding: '1rem',
          marginBottom: '2rem',
          borderRadius: '10px',
          background: dbStatus.includes('✅') ? '#d4edda' : 
                     dbStatus.includes('❌') ? '#f8d7da' : '#e2e8f0',
          color: dbStatus.includes('✅') ? '#155724' : 
                dbStatus.includes('❌') ? '#721c24' : '#475569',
          border: `2px solid ${dbStatus.includes('✅') ? '#c3e6cb' : 
                          dbStatus.includes('❌') ? '#f5c6cb' : '#cbd5e1'}`,
          textAlign: 'center',
          fontWeight: '600'
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

        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <section className="section hero">
            {personalData ? (
              <div className="hero-content">
                <div className="hero-text">
                  <h1>Hola, soy <span className="highlight">{personalData.nombre}</span></h1>
                  <h2>{personalData.titulo}</h2>
                  <p className="hero-description">{personalData.perfil}</p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <span>📍</span>
                      <span>{personalData.ubicacion}</span>
                    </div>
                    <div className="contact-item">
                      <span>📞</span>
                      <span>{personalData.telefono}</span>
                    </div>
                    <div className="contact-item">
                      <span>📧</span>
                      <span>{personalData.email}</span>
                    </div>
                  </div>
                  <div className="hero-buttons">
                    <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      💼 LinkedIn
                    </a>
                    <button className="btn btn-secondary" onClick={() => setActiveSection('proyectos')}>
                      🚀 Ver Proyectos
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveSection('certificaciones')}>
                      📜 Ver Certificaciones
                    </button>
                    <button 
                      className="btn btn-warning"
                      onClick={() => enableEditMode('personal')}
                    >
                      ✏️ Modificar Perfil
                    </button>
                  </div>
                </div>
                <div className="hero-image">
                  <div className="profile-placeholder">
                    <span>👨‍💻</span>
                  </div>
                </div>
              </div>
            ) : (
              renderNoDataMessage("datos personales")
            )}
          </section>
        )}

        {/* Sección Experiencia */}
        {activeSection === 'experiencia' && (
          <section className="section">
            <div className="section-header">
              <h2>Experiencia Laboral</h2>
              <button 
                className="btn btn-warning"
                onClick={() => enableEditMode('experience')}
              >
                ✏️ Modificar Experiencia
              </button>
            </div>
            {experience.length > 0 ? (
              <div className="experiencia-grid">
                {experience.map((exp, index) => (
                  <div key={exp._id || index} className="experiencia-card">
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
            ) : (
              renderNoDataMessage("experiencia laboral")
            )}
          </section>
        )}

        {/* Sección Proyectos */}
        {activeSection === 'proyectos' && (
          <section className="section">
            <div className="section-header">
              <h2>Proyectos Destacados</h2>
              <button 
                className="btn btn-warning"
                onClick={() => enableEditMode('projects')}
              >
                ✏️ Modificar Proyectos
              </button>
            </div>
            {projects.length > 0 ? (
              <div className="proyectos-grid">
                {projects.map((proyecto, index) => (
                  <div key={proyecto._id || index} className="proyecto-card">
                    <h3>{proyecto.nombre}</h3>
                    <p>{proyecto.descripcion}</p>
                    <div className="tecnologias">
                      {proyecto.tecnologias.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <div className="resultados">
                      <h4>🎯 Resultados Alcanzados:</h4>
                      <ul>
                        {proyecto.resultados.map((resultado, i) => (
                          <li key={i}>{resultado}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              renderNoDataMessage("proyectos")
            )}
          </section>
        )}

        {/* Sección Habilidades */}
        {activeSection === 'habilidades' && (
          <section className="section">
            <div className="section-header">
              <h2>Habilidades Técnicas</h2>
              <button 
                className="btn btn-warning"
                onClick={() => enableEditMode('skills')}
              >
                ✏️ Modificar Habilidades
              </button>
            </div>
            {skills ? (
              <div className="habilidades-grid">
                <div className="habilidad-categoria">
                  <h3>🖥️ Frontend</h3>
                  <div className="habilidades-list">
                    {skills.frontend.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="habilidad-categoria">
                  <h3>⚙️ Backend</h3>
                  <div className="habilidades-list">
                    {skills.backend.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="habilidad-categoria">
                  <h3>🗄️ Bases de Datos</h3>
                  <div className="habilidades-list">
                    {skills.basesDatos.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="habilidad-categoria">
                  <h3>🔧 DevOps & Herramientas</h3>
                  <div className="habilidades-list">
                    {skills.devops.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              renderNoDataMessage("habilidades")
            )}
          </section>
        )}

        {/* Sección Certificaciones */}
        {activeSection === 'certificaciones' && (
          <section className="section">
            <div className="section-header">
              <h2>Mis Certificaciones</h2>
              <button 
                className="btn btn-warning"
                onClick={() => enableEditMode('certifications')}
              >
                ✏️ Modificar Certificaciones
              </button>
            </div>
            {certifications.length > 0 ? (
              <>
                <div className="certificaciones-grid">
                  {certifications.map((cert, index) => (
                    <div key={cert._id || index} className="certificacion-card">
                      <h3>{cert.name}</h3>
                      <p className="institucion">{cert.institution}</p>
                      <div className="certificacion-meta">
                        <span className="categoria">{cert.category || 'Certificación'}</span>
                        <span className="año">{cert.year}</span>
                      </div>
                      <div className="certificacion-footer">
                        <span className="codigo">{cert.code}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button 
                    onClick={loadAllData}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '🔄 Cargando...' : '🔄 Actualizar desde MongoDB'}
                  </button>
                </div>
              </>
            ) : (
              renderNoDataMessage("certificaciones")
            )}
          </section>
        )}

        {/* Sección Admin */}
        {activeSection === 'admin' && (
          <section className="section">
            <AdminPanel 
              onDataUpdated={loadAllData}
              currentData={{ personalData, experience, projects, skills, certifications }}
              editMode={editMode}
              editingSection={editingSection}
              onExitEditMode={disableEditMode}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 {personalData?.nombre || "Mi Portfolio"}. Todos los derechos reservados.</p>
        <p>Desarrollado con React, Vite y MongoDB</p>
        {personalData && (
          <p>📍 {personalData.ubicacion} | 📞 {personalData.telefono} | 📧 {personalData.email}</p>
        )}
      </footer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .certificacion-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0;
        }
        
        .categoria {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .btn-warning {
          background: #ffc107;
          color: #212529;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-warning:hover {
          background: #e0a800;
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-buttons .btn {
            width: 100%;
            max-width: 280px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default App;