import React, { useState } from 'react';
import { certificationsService } from '../services/certificationsService';

const AdminCertifications = ({ onCertificationAdded, loading, setLoading, setDbStatus }) => {
  const [adminMode, setAdminMode] = useState(false);
  const [newCertification, setNewCertification] = useState({
    name: '',
    institution: '',
    year: new Date().getFullYear().toString(),
    category: '',
    code: ''
  });

  const addCertification = async () => {
    try {
      setLoading(true);
      const result = await certificationsService.createCertification(newCertification);
      
      if (result.success) {
        setDbStatus('✅ Certificación agregada exitosamente');
        setNewCertification({
          name: '',
          institution: '',
          year: new Date().getFullYear().toString(),
          category: '',
          code: ''
        });
        // Llamar a la función para recargar las certificaciones
        onCertificationAdded();
      } else {
        setDbStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error agregando certificación:', error);
      setDbStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!adminMode) {
    return (
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => setAdminMode(true)}
        >
          ⚙️ Modo Administración
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel" style={{
      padding: '2rem',
      marginBottom: '2rem',
      background: '#f8f9fa',
      borderRadius: '10px',
      border: '2px solid #007bff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>⚙️ Panel de Administración</h3>
        <button
          className="btn btn-secondary"
          onClick={() => setAdminMode(false)}
        >
          🔒 Cerrar Admin
        </button>
      </div>
      
      <div className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre de la certificación *"
          value={newCertification.name}
          onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
          style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="Institución *"
          value={newCertification.institution}
          onChange={(e) => setNewCertification({...newCertification, institution: e.target.value})}
          style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Año"
            value={newCertification.year}
            onChange={(e) => setNewCertification({...newCertification, year: e.target.value})}
            style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newCertification.category}
            onChange={(e) => setNewCertification({...newCertification, category: e.target.value})}
            style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
          />
          <input
            type="text"
            placeholder="Código"
            value={newCertification.code}
            onChange={(e) => setNewCertification({...newCertification, code: e.target.value})}
            style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
          />
        </div>
        <button 
          onClick={addCertification}
          disabled={loading || !newCertification.name || !newCertification.institution}
          className="btn btn-success"
          style={{ 
            padding: '0.75rem 1.5rem',
            opacity: (loading || !newCertification.name || !newCertification.institution) ? 0.6 : 1
          }}
        >
          {loading ? '🔄 Agregando...' : '➕ Agregar Certificación'}
        </button>
      </div>
    </div>
  );
};

export default AdminCertifications;