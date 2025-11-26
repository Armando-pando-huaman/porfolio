import React from 'react';

const Header = ({ profile }) => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <h1>{profile?.name || 'Armando Pando'}</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#sobre-mi">Sobre Mí</a></li>
          <li><a href="#experiencia">Experiencia</a></li>
          <li><a href="#proyectos">Proyectos</a></li>
          <li><a href="#habilidades">Habilidades</a></li>
          <li><a href="#certificaciones">Certificaciones</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;