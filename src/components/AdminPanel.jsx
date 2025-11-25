import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const EditPanel = ({ section, currentData, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  // Inicializar datos del formulario
  useEffect(() => {
    if (section === 'personal' && currentData.personalData) {
      setFormData(currentData.personalData);
    } else if (section === 'experience') {
      setFormData(currentData.experience || []);
    } else if (section === 'projects') {
      setFormData(currentData.projects || []);
    } else if (section === 'skills') {
      setFormData(currentData.skills || {
        frontend: [], backend: [], basesDatos: [], devops: []
      });
    }
  }, [section, currentData]);

  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Guardar datos
  const handleSave = async () => {
    setLoading(true);
    try {
      let result;
      
      switch(section) {
        case 'personal':
          const dataToSave = { ...formData };
          delete dataToSave._id;
          result = await apiService.personalData.save(dataToSave);
          break;
          
        case 'experience':
          // Para experiencia, guardamos cada item
          for (const exp of formData) {
            if (exp._id) {
              const { _id, ...dataToUpdate } = exp;
              await apiService.experience.update(_id, dataToUpdate);
            } else {
              await apiService.experience.create(exp);
            }
          }
          result = { success: true };
          break;
          
        case 'projects':
          // Para proyectos, guardamos cada item
          for (const project of formData) {
            if (project._id) {
              const { _id, ...dataToUpdate } = project;
              await apiService.projects.update(_id, dataToUpdate);
            } else {
              await apiService.projects.create(project);
            }
          }
          result = { success: true };
          break;
          
        case 'skills':
          const skillsToSave = { ...formData };
          delete skillsToSave._id;
          result = await apiService.skills.save(skillsToSave);
          break;
          
        default:
          result = { success: false, error: 'Sección no válida' };
      }

      if (result.success) {
        showMessage('✅ Cambios guardados exitosamente');
        onSave(); // Recargar datos
        setTimeout(() => onClose(), 1000); // Cerrar después de guardar
      } else {
        showMessage(`❌ Error: ${result.error}`, true);
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar formulario según la sección
  const renderForm = () => {
    switch(section) {
      case 'personal':
        return (
          <PersonalForm 
            data={formData} 
            onChange={setFormData}
          />
        );
        
      case 'experience':
        return (
          <ExperienceForm 
            data={formData} 
            onChange={setFormData}
          />
        );
        
      case 'projects':
        return (
          <ProjectsForm 
            data={formData} 
            onChange={setFormData}
          />
        );
        
      case 'skills':
        return (
          <SkillsForm 
            data={formData} 
            onChange={setFormData}
          />
        );
        
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  const getSectionTitle = () => {
    const titles = {
      personal: '👤 Datos Personales',
      experience: '💼 Experiencia Laboral',
      projects: '🚀 Proyectos',
      skills: '🛠️ Habilidades'
    };
    return titles[section] || 'Editar';
  };

  return (
    <div className="edit-panel-overlay">
      <div className="edit-panel">
        {/* Header */}
        <div className="edit-header">
          <h2>{getSectionTitle()}</h2>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>

        {/* Mensajes */}
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Contenido del formulario */}
        <div className="edit-content">
          {renderForm()}
        </div>

        {/* Botones de acción */}
        <div className="edit-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="btn-save"
          >
            {loading ? '💾 Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .edit-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .edit-panel {
          background: white;
          border-radius: 15px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .edit-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .btn-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .btn-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .message {
          margin: 1rem 2rem;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .edit-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: #f8f9fa;
        }

        .edit-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1.5rem 2rem;
          background: white;
          border-top: 1px solid #e9ecef;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          border: 2px solid #6c757d;
          background: white;
          color: #6c757d;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #6c757d;
          color: white;
        }

        .btn-save {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .edit-panel {
            margin: 0;
            border-radius: 0;
            max-height: 100vh;
          }
          
          .edit-header {
            padding: 1rem;
          }
          
          .edit-content {
            padding: 1rem;
          }
          
          .edit-actions {
            padding: 1rem;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

// Componentes de formulario específicos
const PersonalForm = ({ data, onChange }) => (
  <div className="form-grid">
    <div className="input-group">
      <label>Nombre Completo *</label>
      <input
        type="text"
        value={data.nombre || ''}
        onChange={(e) => onChange({...data, nombre: e.target.value})}
        placeholder="Tu nombre completo"
      />
    </div>
    
    <div className="input-group">
      <label>Título Profesional *</label>
      <input
        type="text"
        value={data.titulo || ''}
        onChange={(e) => onChange({...data, titulo: e.target.value})}
        placeholder="Desarrollador Full Stack"
      />
    </div>
    
    <div className="input-group">
      <label>Ubicación *</label>
      <input
        type="text"
        value={data.ubicacion || ''}
        onChange={(e) => onChange({...data, ubicacion: e.target.value})}
        placeholder="Ciudad, País"
      />
    </div>
    
    <div className="input-group">
      <label>Teléfono *</label>
      <input
        type="text"
        value={data.telefono || ''}
        onChange={(e) => onChange({...data, telefono: e.target.value})}
        placeholder="+1 234 567 890"
      />
    </div>
    
    <div className="input-group full-width">
      <label>Email *</label>
      <input
        type="email"
        value={data.email || ''}
        onChange={(e) => onChange({...data, email: e.target.value})}
        placeholder="tu@email.com"
      />
    </div>
    
    <div className="input-group full-width">
      <label>LinkedIn</label>
      <input
        type="url"
        value={data.linkedin || ''}
        onChange={(e) => onChange({...data, linkedin: e.target.value})}
        placeholder="https://linkedin.com/in/tuperfil"
      />
    </div>
    
    <div className="input-group full-width">
      <label>Perfil Profesional *</label>
      <textarea
        value={data.perfil || ''}
        onChange={(e) => onChange({...data, perfil: e.target.value})}
        placeholder="Describe tu perfil profesional..."
        rows="4"
      />
    </div>

    <style jsx>{`
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .full-width {
        grid-column: 1 / -1;
      }
      
      label {
        font-weight: 600;
        color: #333;
      }
      
      input, textarea {
        padding: 0.75rem;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      
      input:focus, textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      textarea {
        resize: vertical;
        min-height: 100px;
      }
      
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </div>
);

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    onChange([...data, {
      empresa: '', puesto: '', periodo: '', logros: [''], tecnologias: ['']
    }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeExperience = (index) => {
    if (confirm('¿Eliminar esta experiencia?')) {
      const updated = data.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  return (
    <div className="experience-form">
      <button onClick={addExperience} className="btn-add">
        ➕ Agregar Experiencia
      </button>
      
      {data.map((exp, index) => (
        <div key={index} className="experience-card">
          <div className="card-header">
            <h4>Experiencia #{index + 1}</h4>
            <button 
              onClick={() => removeExperience(index)}
              className="btn-delete"
            >
              🗑️ Eliminar
            </button>
          </div>
          
          <div className="form-grid">
            <div className="input-group">
              <label>Empresa *</label>
              <input
                type="text"
                value={exp.empresa || ''}
                onChange={(e) => updateExperience(index, 'empresa', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>
            
            <div className="input-group">
              <label>Puesto *</label>
              <input
                type="text"
                value={exp.puesto || ''}
                onChange={(e) => updateExperience(index, 'puesto', e.target.value)}
                placeholder="Tu puesto"
              />
            </div>
            
            <div className="input-group full-width">
              <label>Periodo *</label>
              <input
                type="text"
                value={exp.periodo || ''}
                onChange={(e) => updateExperience(index, 'periodo', e.target.value)}
                placeholder="Enero 2020 - Presente"
              />
            </div>
            
            <div className="input-group full-width">
              <label>Tecnologías (separadas por coma)</label>
              <input
                type="text"
                value={Array.isArray(exp.tecnologias) ? exp.tecnologias.join(', ') : exp.tecnologias || ''}
                onChange={(e) => updateExperience(index, 'tecnologias', e.target.value.split(',').map(t => t.trim()))}
                placeholder="PHP, JavaScript, MySQL, React..."
              />
            </div>
            
            <div className="input-group full-width">
              <label>Logros y Responsabilidades</label>
              {exp.logros && exp.logros.map((logro, logroIndex) => (
                <div key={logroIndex} className="array-item">
                  <input
                    type="text"
                    value={logro || ''}
                    onChange={(e) => {
                      const updated = [...data];
                      updated[index].logros[logroIndex] = e.target.value;
                      onChange(updated);
                    }}
                    placeholder={`Logro ${logroIndex + 1}`}
                  />
                  {exp.logros.length > 1 && (
                    <button
                      onClick={() => {
                        const updated = [...data];
                        updated[index].logros.splice(logroIndex, 1);
                        onChange(updated);
                      }}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = [...data];
                  updated[index].logros.push('');
                  onChange(updated);
                }}
                className="btn-add-small"
              >
                ➕ Agregar Logro
              </button>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .experience-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .btn-add {
          background: #3498db;
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .btn-add:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }
        
        .experience-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          border: 2px solid #e1e5e9;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e1e5e9;
        }
        
        .card-header h4 {
          margin: 0;
          color: #333;
        }
        
        .btn-delete {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .btn-delete:hover {
          background: #c0392b;
        }
        
        .array-item {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }
        
        .array-item input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        
        .btn-remove {
          background: #95a5a6;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.75rem;
        }
        
        .btn-remove:hover {
          background: #7f8c8d;
        }
        
        .btn-add-small {
          background: #27ae60;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        
        .btn-add-small:hover {
          background: #219653;
        }
      `}</style>
    </div>
  );
};

// Componentes similares para ProjectsForm y SkillsForm (los puedes completar)
const ProjectsForm = ({ data, onChange }) => (
  <div>Formulario de Proyectos - Similar al de Experiencia</div>
);

const SkillsForm = ({ data, onChange }) => (
  <div>Formulario de Habilidades - Similar al PersonalForm</div>
);

export default EditPanel;