import React, { useState, useEffect } from 'react';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences');
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando experiencias...</div>;

  return (
    <div>
      <h2>Experiencia Laboral</h2>
      {experiences.map(exp => (
        <div key={exp._id} className="experience-item">
          <h3>{exp.position} - {exp.company}</h3>
          <p>{exp.period}</p>
          <p>{exp.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Experience;