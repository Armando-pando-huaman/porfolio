import React from 'react';

const Education = ({ profile }) => {
  // Asumimos que la educación está en el perfil, o podríamos tener una colección aparte
  // Por ahora, usaremos datos estáticos basados en el CV o los pasamos por el perfil
  const education = [
    {
      institution: 'Universidad UTP',
      degree: 'Ingeniería de Sistemas',
      status: 'En curso'
    },
    {
      institution: 'Instituto Superior SISE',
      degree: 'Técnico en Desarrollo de Software',
      status: 'Completado'
    }
  ];

  return (
    <section id="educacion" className="education">
      <div className="container">
        <h2>Educación</h2>
        <div className="education-list">
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <h3>{edu.institution}</h3>
              <p>{edu.degree}</p>
              <span className={`status ${edu.status === 'Completado' ? 'completed' : 'in-progress'}`}>
                {edu.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;