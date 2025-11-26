import React from 'react';

const About = ({ profile }) => {
  return (
    <section id="sobre-mi" className="about">
      <div className="container">
        <h2>Sobre Mí</h2>
        <div className="about-content">
          <p>{profile?.description || "Completa tu descripción profesional en el panel de administración."}</p>
          
          <div className="about-details">
            <div className="detail-item">
              <strong>Disponibilidad:</strong>
              <span>{profile?.availability || "Por definir"}</span>
            </div>
            <div className="detail-item">
              <strong>Inglés:</strong>
              <span>{profile?.english || "Por definir"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;