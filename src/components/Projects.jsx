import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando proyectos...</div>;

  return (
    <div>
      <h2>Mis Proyectos</h2>
      {projects.map(project => (
        <div key={project._id} className="project-card">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            Ver en GitHub
          </a>
        </div>
      ))}
    </div>
  );
};

export default Projects;