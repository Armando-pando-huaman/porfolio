import React from 'react';

const Experience = ({ experiences }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <section id="experiencia" className="experience">
        <div className="container">
          <h2>Experiencia Laboral</h2>
          <div className="empty-state">
            <p>No hay experiencias registradas. Agrega tu experiencia laboral desde el panel de administración.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experiencia" className="experience">
      <div className="container">
        <h2>Experiencia Laboral</h2>
        <div className="experiences-grid">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-card">
              <div className="experience-header">
                <h3>{exp.company}</h3>
                <span className="date">{exp.startDate} - {exp.endDate}</span>
              </div>
              <h4 className="position">{exp.position}</h4>
              <ul className="experience-list">
                {exp.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;