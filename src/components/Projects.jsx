import React from 'react';

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <section id="proyectos" className="projects">
        <div className="container">
          <h2>Proyectos Destacados</h2>
          <div className="empty-state">
            <p>No hay proyectos registrados. Agrega tus proyectos desde el panel de administración.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="proyectos" className="projects">
      <div className="container">
        <h2>Proyectos Destacados</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className="project-date">{project.date}</span>
              </div>
              <div className="technologies">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-description">
                <h4>Descripción:</h4>
                <ul>
                  {project.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="project-results">
                <h4>Resultados:</h4>
                <ul>
                  {project.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>
              </div>
              {project.videoUrl && (
                <div className="project-video">
                  <a 
                    href={project.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    📹 Ver Video del Proyecto
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;