import React from 'react';

const Hero = ({ profile }) => {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{profile?.name || 'Armando Edgardo Pando Huaman'}</h1>
          <h2>{profile?.title || 'Desarrollador Full Stack Junior'}</h2>
          <p className="location">{profile?.location || 'Lima, Perú'}</p>
          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary">Contactar</a>
            <a 
              href="/ARMANDOEDGARDOPANDOHUAMAN.pdf" 
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver CV
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src={profile?.image || '/default-avatar.jpg'} 
            alt="Armando Pando" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;