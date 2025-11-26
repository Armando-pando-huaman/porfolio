import React from 'react';

const About = ({ profile }) => {
  return (
    <section id="sobre-mi" className="about">
      <div className="container">
        <h2>Sobre Mí</h2>
        <div className="about-content">
          <p>{profile?.description || 'Desarrollador Full Stack Junior con experiencia en más de 15 proyectos de desarrollo web utilizando arquitectura MVC, APIs RESTful y bases de datos relacionales...'}</p>
          
          <div className="about-details">
            <div className="detail-item">
              <strong>Disponibilidad:</strong>
              <span>{profile?.availability || 'Inmediata'}</span>
            </div>
            <div className="detail-item">
              <strong>Inglés:</strong>
              <span>{profile?.english || 'Básico – Técnico'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;