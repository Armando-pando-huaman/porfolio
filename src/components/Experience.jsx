import React from 'react';

const Experience = ({ experiences }) => {
  return (
    <section id="experiencia" className="experience">
      <div className="container">
        <h2>Experiencia Laboral</h2>
        <div className="experiences-list">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3>{exp.company}</h3>
                <span className="date">{exp.startDate} - {exp.endDate}</span>
              </div>
              <h4>{exp.position}</h4>
              <ul className="experience-description">
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