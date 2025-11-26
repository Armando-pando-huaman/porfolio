import React from 'react';
const Hero = ({ profile }) => {
  const hasProfileData = profile && profile.name;
  
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{hasProfileData ? profile.name : "Tu Nombre Completo"}</h1>
          <h2>{hasProfileData ? profile.title : "Tu Título Profesional"}</h2>
          <p className="location">{hasProfileData ? profile.location : "Tu Ubicación"}</p>
          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary">Contactar</a>
            {hasProfileData && profile.cv && (
              <a 
                href={profile.cv} 
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver CV
              </a>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img 
            src={profile?.image || '/default-avatar.jpg'} 
            alt={hasProfileData ? profile.name : "Foto de perfil"} 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;