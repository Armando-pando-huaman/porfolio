import React from 'react';

const Certifications = ({ certifications }) => {
  return (
    <section id="certificaciones" className="certifications">
      <div className="container">
        <h2>Certificaciones</h2>
        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <div key={index} className="certification-card">
              <h3>{cert.name}</h3>
              <p>{cert.institution}</p>
              <span className="cert-date">{cert.date}</span>
              {cert.image && (
                <img src={cert.image} alt={cert.name} className="cert-image" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;