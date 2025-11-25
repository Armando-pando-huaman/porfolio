import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AdminPanel = ({ onDataUpdated, currentData, editMode = false, editingItem = null }) => {
  const [activeTab, setActiveTab] = useState(editMode ? editingItem.section : 'personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estados para formularios
  const [personalData, setPersonalData] = useState(currentData.personalData || {});
  const [experience, setExperience] = useState(currentData.experience || []);
  const [projects, setProjects] = useState(currentData.projects || []);
  const [skills, setSkills] = useState(currentData.skills || {
    frontend: [],
    backend: [],
    basesDatos: [],
    devops: []
  });
  const [newCertification, setNewCertification] = useState({
    name: '',
    institution: '',
    year: new Date().getFullYear().toString(),
    category: '',
    code: ''
  });

  // Efecto para cargar datos cuando cambia el modo edición
  useEffect(() => {
    if (editMode && editingItem) {
      setActiveTab(editingItem.section);
    }
  }, [editMode, editingItem]);

  // Mostrar mensajes temporales
  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // ========== DATOS PERSONALES ==========
  const savePersonalData = async () => {
    setLoading(true);
    try {
      // Crear copia sin _id para evitar el error
      const { _id, ...dataToSave } = personalData;
      const result = await apiService.personalData.save(dataToSave);
      
      if (result.success) {
        showMessage('✅ Datos personales guardados exitosamente');
        setPersonalData(result.data);
        onDataUpdated();
      } else {
        showMessage(`❌ Error: ${result.error}`, true);
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // ========== EXPERIENCIA ==========
  const addExperience = () => {
    setExperience([...experience, {
      empresa: '',
      puesto: '',
      periodo: '',
      logros: [''],
      tecnologias: ['']
    }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const updateExperienceArray = (index, field, arrayIndex, value) => {
    const updated = [...experience];
    updated[index][field][arrayIndex] = value;
    setExperience(updated);
  };

  const addExperienceArrayItem = (index, field) => {
    const updated = [...experience];
    updated[index][field].push('');
    setExperience(updated);
  };

  const removeExperienceArrayItem = (index, field, arrayIndex) => {
    const updated = [...experience];
    updated[index][field].splice(arrayIndex, 1);
    setExperience(updated);
  };

  const removeExperience = async (index) => {
    const exp = experience[index];
    if (exp._id) {
      if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) return;
      
      setLoading(true);
      try {
        const result = await apiService.experience.delete(exp._id);
        if (result.success) {
          showMessage('✅ Experiencia eliminada exitosamente');
          const updated = experience.filter((_, i) => i !== index);
          setExperience(updated);
          onDataUpdated();
        } else {
          showMessage(`❌ Error: ${result.error}`, true);
        }
      } catch (error) {
        showMessage(`❌ Error: ${error.message}`, true);
      } finally {
        setLoading(false);
      }
    } else {
      const updated = experience.filter((_, i) => i !== index);
      setExperience(updated);
    }
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      // Guardar cada experiencia
      for (const exp of experience) {
        if (exp._id) {
          // Si tiene _id, es una actualización - crear copia sin _id
          const { _id, ...dataToUpdate } = exp;
          await apiService.experience.update(_id, dataToUpdate);
        } else {
          // Si no tiene _id, es una creación
          await apiService.experience.create(exp);
        }
      }
      showMessage('✅ Experiencia guardada exitosamente');
      onDataUpdated();
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // ========== PROYECTOS ==========
  const addProject = () => {
    setProjects([...projects, {
      nombre: '',
      descripcion: '',
      tecnologias: [''],
      resultados: ['']
    }]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const updateProjectArray = (index, field, arrayIndex, value) => {
    const updated = [...projects];
    updated[index][field][arrayIndex] = value;
    setProjects(updated);
  };

  const addProjectArrayItem = (index, field) => {
    const updated = [...projects];
    updated[index][field].push('');
    setProjects(updated);
  };

  const removeProjectArrayItem = (index, field, arrayIndex) => {
    const updated = [...projects];
    updated[index][field].splice(arrayIndex, 1);
    setProjects(updated);
  };

  const removeProject = async (index) => {
    const project = projects[index];
    if (project._id) {
      if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;
      
      setLoading(true);
      try {
        const result = await apiService.projects.delete(project._id);
        if (result.success) {
          showMessage('✅ Proyecto eliminado exitosamente');
          const updated = projects.filter((_, i) => i !== index);
          setProjects(updated);
          onDataUpdated();
        } else {
          showMessage(`❌ Error: ${result.error}`, true);
        }
      } catch (error) {
        showMessage(`❌ Error: ${error.message}`, true);
      } finally {
        setLoading(false);
      }
    } else {
      const updated = projects.filter((_, i) => i !== index);
      setProjects(updated);
    }
  };

  const saveProjects = async () => {
    setLoading(true);
    try {
      for (const project of projects) {
        if (project._id) {
          // Actualización - crear copia sin _id
          const { _id, ...dataToUpdate } = project;
          await apiService.projects.update(_id, dataToUpdate);
        } else {
          await apiService.projects.create(project);
        }
      }
      showMessage('✅ Proyectos guardados exitosamente');
      onDataUpdated();
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // ========== HABILIDADES ==========
  const updateSkills = (category, value) => {
    setSkills({
      ...skills,
      [category]: value.split(',').map(skill => skill.trim()).filter(skill => skill)
    });
  };

  const saveSkills = async () => {
    setLoading(true);
    try {
      // Crear copia sin _id
      const { _id, ...dataToSave } = skills;
      const result = await apiService.skills.save(dataToSave);
      
      if (result.success) {
        showMessage('✅ Habilidades guardadas exitosamente');
        setSkills(result.data);
        onDataUpdated();
      } else {
        showMessage(`❌ Error: ${result.error}`, true);
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // ========== CERTIFICACIONES ==========
  const addCertification = async () => {
    if (!newCertification.name || !newCertification.institution) {
      showMessage('❌ Nombre e institución son requeridos', true);
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.certifications.create(newCertification);
      
      if (result.success) {
        showMessage('✅ Certificación agregada exitosamente');
        setNewCertification({
          name: '',
          institution: '',
          year: new Date().getFullYear().toString(),
          category: '',
          code: ''
        });
        onDataUpdated();
      } else {
        showMessage(`❌ Error: ${result.error}`, true);
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertification = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta certificación?')) return;
    
    setLoading(true);
    try {
      const result = await apiService.certifications.delete(id);
      
      if (result.success) {
        showMessage('✅ Certificación eliminada exitosamente');
        onDataUpdated();
      } else {
        showMessage(`❌ Error: ${result.error}`, true);
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const updateCertification = async (cert) => {
    if (!cert.name || !cert.institution) {
      showMessage('❌ Nombre e institución son requeridos', true);
      return;
    }

    setLoading(true);
    try {
      // Crear copia sin _id para la actualización
      const { _id, ...dataToUpdate } = cert;
      const result = await apiService.certifications.update(_id, dataToUpdate);
      
      if (result.success) {
        showMessage('✅ Certificación actualizada exitosamente');
        onDataUpdated();
      } else {
        showMessage(`❌ Error: ${result.error}`, true);
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      {/* Mensajes */}
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Header del Admin */}
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        {editMode && (
          <div className="edit-mode-banner">
            🎯 <strong>Modo Edición:</strong> {editingItem?.section}
          </div>
        )}
      </div>

      {/* Navegación de pestañas */}
      <div className="admin-tabs">
        {[
          { id: 'personal', label: '👤 Datos Personales' },
          { id: 'experience', label: '💼 Experiencia' },
          { id: 'projects', label: '🚀 Proyectos' },
          { id: 'skills', label: '🛠️ Habilidades' },
          { id: 'certifications', label: '📜 Certificaciones' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de las pestañas */}
      <div className="admin-content">
        
        {/* DATOS PERSONALES */}
        {activeTab === 'personal' && (
          <div className="form-section">
            <h3>Datos Personales</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nombre completo *"
                value={personalData.nombre || ''}
                onChange={(e) => setPersonalData({...personalData, nombre: e.target.value})}
              />
              <input
                type="text"
                placeholder="Título profesional *"
                value={personalData.titulo || ''}
                onChange={(e) => setPersonalData({...personalData, titulo: e.target.value})}
              />
              <input
                type="text"
                placeholder="Ubicación *"
                value={personalData.ubicacion || ''}
                onChange={(e) => setPersonalData({...personalData, ubicacion: e.target.value})}
              />
              <input
                type="text"
                placeholder="Teléfono *"
                value={personalData.telefono || ''}
                onChange={(e) => setPersonalData({...personalData, telefono: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email *"
                value={personalData.email || ''}
                onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={personalData.linkedin || ''}
                onChange={(e) => setPersonalData({...personalData, linkedin: e.target.value})}
              />
              <textarea
                placeholder="Perfil profesional *"
                value={personalData.perfil || ''}
                onChange={(e) => setPersonalData({...personalData, perfil: e.target.value})}
                rows="4"
                style={{ gridColumn: '1 / -1' }}
              />
            </div>
            <button 
              onClick={savePersonalData} 
              disabled={loading || !personalData.nombre || !personalData.email}
              className="btn btn-primary"
            >
              {loading ? '💾 Guardando...' : '💾 Guardar Datos Personales'}
            </button>
          </div>
        )}

        {/* EXPERIENCIA */}
        {activeTab === 'experience' && (
          <div className="form-section">
            <h3>Experiencia Laboral</h3>
            {experience.map((exp, index) => (
              <div key={exp._id || index} className="form-card">
                <div className="form-card-header">
                  <h4>Experiencia #{index + 1} {exp._id && <small>(ID: {exp._id})</small>}</h4>
                  <div className="form-card-actions">
                    <button 
                      onClick={() => removeExperience(index)}
                      className="btn btn-danger btn-sm"
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
                
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Empresa *"
                    value={exp.empresa || ''}
                    onChange={(e) => updateExperience(index, 'empresa', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Puesto *"
                    value={exp.puesto || ''}
                    onChange={(e) => updateExperience(index, 'puesto', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Periodo (ej: Julio 2023 - Presente) *"
                    value={exp.periodo || ''}
                    onChange={(e) => updateExperience(index, 'periodo', e.target.value)}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Logros *</label>
                    {exp.logros && exp.logros.map((logro, logroIndex) => (
                      <div key={logroIndex} className="array-item">
                        <input
                          type="text"
                          placeholder={`Logro ${logroIndex + 1}`}
                          value={logro || ''}
                          onChange={(e) => updateExperienceArray(index, 'logros', logroIndex, e.target.value)}
                        />
                        {exp.logros.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperienceArrayItem(index, 'logros', logroIndex)}
                            className="btn btn-danger btn-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addExperienceArrayItem(index, 'logros')}
                      className="btn btn-secondary btn-sm"
                    >
                      ➕ Agregar Logro
                    </button>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Tecnologías (separadas por coma)</label>
                    <input
                      type="text"
                      placeholder="PHP, JavaScript, MySQL, ..."
                      value={Array.isArray(exp.tecnologias) ? exp.tecnologias.join(', ') : exp.tecnologias || ''}
                      onChange={(e) => updateExperience(index, 'tecnologias', e.target.value.split(',').map(t => t.trim()))}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="form-actions">
              <button 
                onClick={addExperience}
                className="btn btn-secondary"
              >
                ➕ Agregar Experiencia
              </button>
              <button 
                onClick={saveExperience} 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? '💾 Guardando...' : '💾 Guardar Experiencia'}
              </button>
            </div>
          </div>
        )}

        {/* PROYECTOS */}
        {activeTab === 'projects' && (
          <div className="form-section">
            <h3>Proyectos Destacados</h3>
            {projects.map((project, index) => (
              <div key={project._id || index} className="form-card">
                <div className="form-card-header">
                  <h4>Proyecto #{index + 1} {project._id && <small>(ID: {project._id})</small>}</h4>
                  <div className="form-card-actions">
                    <button 
                      onClick={() => removeProject(index)}
                      className="btn btn-danger btn-sm"
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
                
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Nombre del proyecto *"
                    value={project.nombre || ''}
                    onChange={(e) => updateProject(index, 'nombre', e.target.value)}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <textarea
                    placeholder="Descripción del proyecto *"
                    value={project.descripcion || ''}
                    onChange={(e) => updateProject(index, 'descripcion', e.target.value)}
                    rows="3"
                    style={{ gridColumn: '1 / -1' }}
                  />
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Tecnologías utilizadas (separadas por coma)</label>
                    <input
                      type="text"
                      placeholder="PHP, MySQL, JavaScript, ..."
                      value={Array.isArray(project.tecnologias) ? project.tecnologias.join(', ') : project.tecnologias || ''}
                      onChange={(e) => updateProject(index, 'tecnologias', e.target.value.split(',').map(t => t.trim()))}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Resultados alcanzados</label>
                    {project.resultados && project.resultados.map((resultado, resultadoIndex) => (
                      <div key={resultadoIndex} className="array-item">
                        <input
                          type="text"
                          placeholder={`Resultado ${resultadoIndex + 1}`}
                          value={resultado || ''}
                          onChange={(e) => updateProjectArray(index, 'resultados', resultadoIndex, e.target.value)}
                        />
                        {project.resultados.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProjectArrayItem(index, 'resultados', resultadoIndex)}
                            className="btn btn-danger btn-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addProjectArrayItem(index, 'resultados')}
                      className="btn btn-secondary btn-sm"
                    >
                      ➕ Agregar Resultado
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="form-actions">
              <button 
                onClick={addProject}
                className="btn btn-secondary"
              >
                ➕ Agregar Proyecto
              </button>
              <button 
                onClick={saveProjects} 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? '💾 Guardando...' : '💾 Guardar Proyectos'}
              </button>
            </div>
          </div>
        )}

        {/* HABILIDADES */}
        {activeTab === 'skills' && (
          <div className="form-section">
            <h3>Habilidades Técnicas</h3>
            <div className="form-grid">
              <div style={{ gridColumn: '1 / -1' }}>
                <label>🖥️ Frontend (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="HTML5, CSS3, JavaScript, React, ..."
                  value={skills.frontend?.join(', ') || ''}
                  onChange={(e) => updateSkills('frontend', e.target.value)}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label>⚙️ Backend (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="PHP, Node.js, Python, Java, ..."
                  value={skills.backend?.join(', ') || ''}
                  onChange={(e) => updateSkills('backend', e.target.value)}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label>🗄️ Bases de Datos (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="MySQL, MongoDB, SQL Server, ..."
                  value={skills.basesDatos?.join(', ') || ''}
                  onChange={(e) => updateSkills('basesDatos', e.target.value)}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label>🔧 DevOps & Herramientas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Git, Docker, AWS, Nginx, ..."
                  value={skills.devops?.join(', ') || ''}
                  onChange={(e) => updateSkills('devops', e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={saveSkills} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '💾 Guardando...' : '💾 Guardar Habilidades'}
            </button>
          </div>
        )}

        {/* CERTIFICACIONES */}
        {activeTab === 'certifications' && (
          <div className="form-section">
            <h3>Certificaciones</h3>
            
            {/* Formulario para agregar nueva certificación */}
            <div className="form-card">
              <h4>Agregar Nueva Certificación</h4>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Nombre de la certificación *"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Institución *"
                  value={newCertification.institution}
                  onChange={(e) => setNewCertification({...newCertification, institution: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Año"
                  value={newCertification.year}
                  onChange={(e) => setNewCertification({...newCertification, year: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Categoría"
                  value={newCertification.category}
                  onChange={(e) => setNewCertification({...newCertification, category: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Código"
                  value={newCertification.code}
                  onChange={(e) => setNewCertification({...newCertification, code: e.target.value})}
                  style={{ gridColumn: '1 / -1' }}
                />
              </div>
              <button 
                onClick={addCertification}
                disabled={loading || !newCertification.name || !newCertification.institution}
                className="btn btn-primary"
              >
                {loading ? '💾 Agregando...' : '➕ Agregar Certificación'}
              </button>
            </div>

            {/* Lista de certificaciones existentes */}
            <div className="certifications-list">
              <h4>Certificaciones Existentes</h4>
              {currentData.certifications && currentData.certifications.length > 0 ? (
                currentData.certifications.map((cert, index) => (
                  <div key={cert._id || index} className="certification-item">
                    <div className="certification-info">
                      <strong>{cert.name}</strong>
                      <span>{cert.institution} - {cert.year}</span>
                      <small>ID: {cert._id} | {cert.category} | {cert.code}</small>
                    </div>
                    <div className="certification-actions">
                      <button
                        onClick={() => deleteCertification(cert._id)}
                        disabled={loading}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay certificaciones agregadas</p>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-panel {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 10px;
          border: 2px solid #007bff;
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #dee2e6;
        }
        
        .edit-mode-banner {
          background: #fff3cd;
          color: #856404;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          border: 1px solid #ffeaa7;
        }
        
        .message {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
          font-weight: 600;
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
        
        .admin-tabs {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid #dee2e6;
          flex-wrap: wrap;
        }
        
        .tab-button {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .tab-button:hover {
          background: #e9ecef;
        }
        
        .tab-button.active {
          border-bottom-color: #007bff;
          color: #007bff;
          background: #e7f3ff;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .form-card {
          padding: 1.5rem;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .form-card-actions {
          display: flex;
          gap: 0.5rem;
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
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          margin-top: 1rem;
        }
        
        .certifications-list {
          margin-top: 2rem;
        }
        
        .certification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          margin-bottom: 0.5rem;
          background: white;
        }
        
        .certification-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .certification-info strong {
          margin-bottom: 0.25rem;
        }
        
        .certification-info span {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .certification-info small {
          color: #888;
          font-size: 0.8rem;
        }
        
        .certification-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
        }
        
        .btn-danger {
          background: #dc3545;
          color: white;
        }
        
        .btn-danger:hover:not(:disabled) {
          background: #c82333;
        }
        
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        input, textarea {
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 5px;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
          color: #495057;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .admin-tabs {
            flex-direction: column;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .tab-button {
            text-align: left;
            border-bottom: 1px solid #dee2e6;
            border-left: 3px solid transparent;
          }
          
          .tab-button.active {
            border-left-color: #007bff;
            border-bottom-color: #dee2e6;
          }
          
          .admin-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .certification-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .certification-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;