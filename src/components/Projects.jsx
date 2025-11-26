import React from 'react';

const Projects = ({ projects }) => {
  return (
    <section id="proyectos" className="projects">
      <div className="container">
        <h2>Proyectos Destacados</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.title}</h3>
              <span className="project-date">{project.date}</span>
              <div className="technologies">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
              <ul className="project-description">
                {project.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className="project-results">
                <h4>Resultados:</h4>
                <ul>
                  {project.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>
              </div>
              {project.videoUrl && (
                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Ver Video
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;