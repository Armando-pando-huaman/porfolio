import React from 'react';

const Skills = ({ skills }) => {
  const skillCategories = [
    { title: 'Frontend', skills: skills?.frontend || [] },
    { title: 'Backend', skills: skills?.backend || [] },
    { title: 'Bases de Datos', skills: skills?.databases || [] },
    { title: 'DevOps & Herramientas', skills: skills?.devops || [] },
    { title: 'Infraestructura', skills: skills?.infrastructure || [] }
  ];

  const hasSkills = skillCategories.some(category => 
    category.skills && category.skills.length > 0
  );

  if (!hasSkills) {
    return (
      <section id="habilidades" className="skills">
        <div className="container">
          <h2>Habilidades Técnicas</h2>
          <div className="empty-state">
            <p>No hay habilidades registradas. Agrega tus habilidades desde el panel de administración.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="habilidades" className="skills">
      <div className="container">
        <h2>Habilidades Técnicas</h2>
        <div className="skills-container">
          {skillCategories.map((category, index) => (
            category.skills && category.skills.length > 0 && (
              <div key={index} className="skill-category">
                <h3>{category.title}</h3>
                <div className="skills-list">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="skill-item">
                      <span className="skill-name">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;