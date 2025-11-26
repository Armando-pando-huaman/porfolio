import React from 'react';

const Skills = ({ skills }) => {
  const skillCategories = [
    { title: 'Frontend', skills: skills.frontend },
    { title: 'Backend', skills: skills.backend },
    { title: 'Bases de Datos', skills: skills.databases },
    { title: 'DevOps & Herramientas', skills: skills.devops },
    { title: 'Infraestructura', skills: skills.infrastructure }
  ];

  return (
    <section id="habilidades" className="skills">
      <div className="container">
        <h2>Habilidades Técnicas</h2>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3>{category.title}</h3>
              <div className="skills-list">
                {category.skills && category.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;