import React from 'react';

const Header = ({ profile }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <h1>{profile?.name || "A.P."}</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>Inicio</a></li>
          <li><a href="#sobre-mi" onClick={(e) => { e.preventDefault(); scrollToSection('sobre-mi'); }}>Sobre Mí</a></li>
          <li><a href="#experiencia" onClick={(e) => { e.preventDefault(); scrollToSection('experiencia'); }}>Experiencia</a></li>
          <li><a href="#proyectos" onClick={(e) => { e.preventDefault(); scrollToSection('proyectos'); }}>Proyectos</a></li>
          <li><a href="#habilidades" onClick={(e) => { e.preventDefault(); scrollToSection('habilidades'); }}>Habilidades</a></li>
          <li><a href="#educacion" onClick={(e) => { e.preventDefault(); scrollToSection('educacion'); }}>Educación</a></li>
          <li><a href="#certificaciones" onClick={(e) => { e.preventDefault(); scrollToSection('certificaciones'); }}>Certificaciones</a></li>
          <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;