import React, { useEffect, useState } from 'react';
import { getCertifications } from '../services/certificationsService.js';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertifications() {
      const data = await getCertifications();
      setCertifications(data);
      setLoading(false);
    }
    
    loadCertifications();
  }, []);

  if (loading) return <div>Cargando certificaciones...</div>;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {certifications.map((cert) => (
        <div key={cert._id.$oid} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{cert.name}</h3>
          <p style={{ margin: '0 0 10px 0', color: '#666' }}>{cert.institution}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {cert.year}
            </span>
            <span style={{ fontSize: '14px', color: '#999' }}>{cert.code}</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {cert.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Certifications;