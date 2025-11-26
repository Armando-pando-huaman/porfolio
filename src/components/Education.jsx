import React from 'react';

const Education = ({ profile }) => {
  const educationData = [
    {
      institution: 'Universidad UTP',
      degree: 'Ingeniería de Sistemas',
      period: 'En curso',
      status: 'en-progreso'
    },
    {
      institution: 'Instituto Superior SISE',
      degree: 'Técnico en Desarrollo de Software', 
      period: 'Completado',
      status: 'completado'
    }
  ];

  return (
    <section id="educacion" className="education">
      <div className="container">
        <h2>Educación</h2>
        <div className="education-grid">
          {educationData.map((edu, index) => (
            <div key={index} className="education-card">
              <div className="education-icon">
                {edu.status === 'completado' ? '🎓' : '📚'}
              </div>
              <div className="education-content">
                <h3>{edu.institution}</h3>
                <p className="degree">{edu.degree}</p>
                <span className={`status ${edu.status}`}>
                  {edu.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;