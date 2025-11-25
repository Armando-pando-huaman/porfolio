import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AdminPanel = ({ onDataUpdated, currentData, editMode = false, editingSection = '', onExitEditMode }) => {
  const [activeTab, setActiveTab] = useState(editMode ? editingSection : 'personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Estados para formularios
  const [personalData, setPersonalData] = useState(currentData.personalData || {});
  const [experience, setExperience] = useState(currentData.experience || []);
  const [projects, setProjects] = useState(currentData.projects || []);
  const [skills, setSkills] = useState(currentData.skills || {
    frontend: [], backend: [], basesDatos: [], devops: []
  });
  const [certifications, setCertifications] = useState(currentData.certifications || []);
  const [newCertification, setNewCertification] = useState({
    name: '', institution: '', year: new Date().getFullYear().toString(), category: '', code: ''
  });

  // Efectos para cargar datos
  useEffect(() => {
    setPersonalData(currentData.personalData || {});
    setExperience(currentData.experience || []);
    setProjects(currentData.projects || []);
    setSkills(currentData.skills || { frontend: [], backend: [], basesDatos: [], devops: [] });
    setCertifications(currentData.certifications || []);
  }, [currentData]);

  useEffect(() => {
    if (editMode && editingSection) {
      setActiveTab(editingSection);
    }
  }, [editMode, editingSection]);

  // Mostrar mensajes
  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // ========== FUNCIONES PRINCIPALES ==========
  const savePersonalData = async () => {
    setLoading(true);
    try {
      const dataToSave = { ...personalData };
      delete dataToSave._id;
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

  const addExperience = () => {
    setExperience([...experience, {
      empresa: '', puesto: '', periodo: '', logros: [''], tecnologias: ['']
    }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const removeExperience = async (index) => {
    const exp = experience[index];
    if (exp._id && confirm('¿Estás seguro de eliminar esta experiencia?')) {
      setLoading(true);
      try {
        const result = await apiService.experience.delete(exp._id);
        if (result.success) {
          showMessage('✅ Experiencia eliminada');
          const updated = experience.filter((_, i) => i !== index);
          setExperience(updated);
          onDataUpdated();
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
      for (const exp of experience) {
        if (exp._id) {
          const { _id, ...dataToUpdate } = exp;
          await apiService.experience.update(_id, dataToUpdate);
        } else {
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

  const addProject = () => {
    setProjects([...projects, {
      nombre: '', descripcion: '', tecnologias: [''], resultados: ['']
    }]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const removeProject = async (index) => {
    const project = projects[index];
    if (project._id && confirm('¿Estás seguro de eliminar este proyecto?')) {
      setLoading(true);
      try {
        const result = await apiService.projects.delete(project._id);
        if (result.success) {
          showMessage('✅ Proyecto eliminado');
          const updated = projects.filter((_, i) => i !== index);
          setProjects(updated);
          onDataUpdated();
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

  const updateSkills = (category, value) => {
    setSkills({
      ...skills,
      [category]: value.split(',').map(skill => skill.trim()).filter(skill => skill)
    });
  };

  const saveSkills = async () => {
    setLoading(true);
    try {
      const dataToSave = { ...skills };
      delete dataToSave._id;
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
          name: '', institution: '', year: new Date().getFullYear().toString(), category: '', code: ''
        });
        onDataUpdated();
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertification = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta certificación?')) return;
    
    setLoading(true);
    try {
      const result = await apiService.certifications.delete(id);
      if (result.success) {
        showMessage('✅ Certificación eliminada');
        onDataUpdated();
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // Componente de Input Reutilizable
  const InputField = ({ label, value, onChange, type = "text", placeholder, required = false, multiline = false }) => (
    <div className="input-field">
      <label>{label} {required && <span className="required">*</span>}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          rows="4"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="admin-panel-modern">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h2>Panel de Administración</h2>
        </div>
        {editMode && (
          <div className="edit-mode-banner">
            <span>🎯 Editando: {editingSection}</span>
            <button onClick={onExitEditMode} className="btn-exit">
              ↩️ Salir
            </button>
          </div>
        )}
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-layout">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            {[
              { id: 'personal', icon: '👤', label: 'Datos Personales' },
              { id: 'experience', icon: '💼', label: 'Experiencia' },
              { id: 'projects', icon: '🚀', label: 'Proyectos' },
              { id: 'skills', icon: '🛠️', label: 'Habilidades' },
              { id: 'certifications', icon: '📜', label: 'Certificaciones' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="main-content">
          
          {/* DATOS PERSONALES */}
          {activeTab === 'personal' && (
            <div className="content-section">
              <div className="section-header">
                <h3>👤 Datos Personales</h3>
                <button 
                  onClick={savePersonalData} 
                  disabled={loading}
                  className="btn-save"
                >
                  {loading ? '💾 Guardando...' : '💾 Guardar'}
                </button>
              </div>
              
              <div className="form-grid">
                <InputField
                  label="Nombre Completo"
                  value={personalData.nombre}
                  onChange={(e) => setPersonalData({...personalData, nombre: e.target.value})}
                  placeholder="Tu nombre completo"
                  required
                />
                <InputField
                  label="Título Profesional"
                  value={personalData.titulo}
                  onChange={(e) => setPersonalData({...personalData, titulo: e.target.value})}
                  placeholder="Ej: Desarrollador Full Stack"
                  required
                />
                <InputField
                  label="Ubicación"
                  value={personalData.ubicacion}
                  onChange={(e) => setPersonalData({...personalData, ubicacion: e.target.value})}
                  placeholder="Ciudad, País"
                  required
                />
                <InputField
                  label="Teléfono"
                  value={personalData.telefono}
                  onChange={(e) => setPersonalData({...personalData, telefono: e.target.value})}
                  placeholder="+1 234 567 890"
                  required
                />
                <InputField
                  label="Email"
                  value={personalData.email}
                  onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
                <InputField
                  label="LinkedIn"
                  value={personalData.linkedin}
                  onChange={(e) => setPersonalData({...personalData, linkedin: e.target.value})}
                  type="url"
                  placeholder="https://linkedin.com/in/tuperfil"
                />
                <div className="full-width">
                  <InputField
                    label="Perfil Profesional"
                    value={personalData.perfil}
                    onChange={(e) => setPersonalData({...personalData, perfil: e.target.value})}
                    placeholder="Describe tu perfil profesional..."
                    multiline
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCIA */}
          {activeTab === 'experience' && (
            <div className="content-section">
              <div className="section-header">
                <h3>💼 Experiencia Laboral</h3>
                <div className="section-actions">
                  <button onClick={addExperience} className="btn-add">
                    ➕ Nueva Experiencia
                  </button>
                  <button onClick={saveExperience} disabled={loading} className="btn-save">
                    {loading ? '💾 Guardando...' : '💾 Guardar Todo'}
                  </button>
                </div>
              </div>

              {experience.map((exp, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <h4>Experiencia #{index + 1}</h4>
                    <button 
                      onClick={() => removeExperience(index)}
                      className="btn-delete"
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <InputField
                      label="Empresa"
                      value={exp.empresa}
                      onChange={(e) => updateExperience(index, 'empresa', e.target.value)}
                      placeholder="Nombre de la empresa"
                      required
                    />
                    <InputField
                      label="Puesto"
                      value={exp.puesto}
                      onChange={(e) => updateExperience(index, 'puesto', e.target.value)}
                      placeholder="Tu puesto en la empresa"
                      required
                    />
                    <InputField
                      label="Periodo"
                      value={exp.periodo}
                      onChange={(e) => updateExperience(index, 'periodo', e.target.value)}
                      placeholder="Ej: Enero 2020 - Presente"
                      required
                    />
                    <div className="full-width">
                      <InputField
                        label="Tecnologías (separadas por coma)"
                        value={Array.isArray(exp.tecnologias) ? exp.tecnologias.join(', ') : exp.tecnologias || ''}
                        onChange={(e) => updateExperience(index, 'tecnologias', e.target.value.split(',').map(t => t.trim()))}
                        placeholder="PHP, JavaScript, MySQL, React..."
                      />
                    </div>
                    <div className="full-width">
                      <label>Logros y Responsabilidades</label>
                      {exp.logros && exp.logros.map((logro, logroIndex) => (
                        <div key={logroIndex} className="array-item">
                          <input
                            type="text"
                            value={logro || ''}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index].logros[logroIndex] = e.target.value;
                              setExperience(updated);
                            }}
                            placeholder={`Logro ${logroIndex + 1}`}
                          />
                          {exp.logros.length > 1 && (
                            <button
                              onClick={() => {
                                const updated = [...experience];
                                updated[index].logros.splice(logroIndex, 1);
                                setExperience(updated);
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
                          const updated = [...experience];
                          updated[index].logros.push('');
                          setExperience(updated);
                        }}
                        className="btn-add-small"
                      >
                        ➕ Agregar Logro
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROYECTOS */}
          {activeTab === 'projects' && (
            <div className="content-section">
              <div className="section-header">
                <h3>🚀 Proyectos Destacados</h3>
                <div className="section-actions">
                  <button onClick={addProject} className="btn-add">
                    ➕ Nuevo Proyecto
                  </button>
                  <button onClick={saveProjects} disabled={loading} className="btn-save">
                    {loading ? '💾 Guardando...' : '💾 Guardar Todo'}
                  </button>
                </div>
              </div>

              {projects.map((project, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <h4>Proyecto #{index + 1}</h4>
                    <button 
                      onClick={() => removeProject(index)}
                      className="btn-delete"
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <InputField
                      label="Nombre del Proyecto"
                      value={project.nombre}
                      onChange={(e) => updateProject(index, 'nombre', e.target.value)}
                      placeholder="Nombre del proyecto"
                      required
                    />
                    <div className="full-width">
                      <InputField
                        label="Descripción"
                        value={project.descripcion}
                        onChange={(e) => updateProject(index, 'descripcion', e.target.value)}
                        placeholder="Describe el proyecto..."
                        multiline
                        required
                      />
                    </div>
                    <div className="full-width">
                      <InputField
                        label="Tecnologías (separadas por coma)"
                        value={Array.isArray(project.tecnologias) ? project.tecnologias.join(', ') : project.tecnologias || ''}
                        onChange={(e) => updateProject(index, 'tecnologias', e.target.value.split(',').map(t => t.trim()))}
                        placeholder="React, Node.js, MongoDB..."
                      />
                    </div>
                    <div className="full-width">
                      <label>Resultados Alcanzados</label>
                      {project.resultados && project.resultados.map((resultado, resultadoIndex) => (
                        <div key={resultadoIndex} className="array-item">
                          <input
                            type="text"
                            value={resultado || ''}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].resultados[resultadoIndex] = e.target.value;
                              setProjects(updated);
                            }}
                            placeholder={`Resultado ${resultadoIndex + 1}`}
                          />
                          {project.resultados.length > 1 && (
                            <button
                              onClick={() => {
                                const updated = [...projects];
                                updated[index].resultados.splice(resultadoIndex, 1);
                                setProjects(updated);
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
                          const updated = [...projects];
                          updated[index].resultados.push('');
                          setProjects(updated);
                        }}
                        className="btn-add-small"
                      >
                        ➕ Agregar Resultado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HABILIDADES */}
          {activeTab === 'skills' && (
            <div className="content-section">
              <div className="section-header">
                <h3>🛠️ Habilidades Técnicas</h3>
                <button 
                  onClick={saveSkills} 
                  disabled={loading}
                  className="btn-save"
                >
                  {loading ? '💾 Guardando...' : '💾 Guardar'}
                </button>
              </div>

              <div className="skills-grid">
                <div className="skill-category">
                  <h4>🖥️ Frontend</h4>
                  <InputField
                    label=""
                    value={skills.frontend?.join(', ') || ''}
                    onChange={(e) => updateSkills('frontend', e.target.value)}
                    placeholder="React, JavaScript, HTML5, CSS3..."
                  />
                </div>
                <div className="skill-category">
                  <h4>⚙️ Backend</h4>
                  <InputField
                    label=""
                    value={skills.backend?.join(', ') || ''}
                    onChange={(e) => updateSkills('backend', e.target.value)}
                    placeholder="Node.js, PHP, Python, Java..."
                  />
                </div>
                <div className="skill-category">
                  <h4>🗄️ Bases de Datos</h4>
                  <InputField
                    label=""
                    value={skills.basesDatos?.join(', ') || ''}
                    onChange={(e) => updateSkills('basesDatos', e.target.value)}
                    placeholder="MySQL, MongoDB, PostgreSQL..."
                  />
                </div>
                <div className="skill-category">
                  <h4>🔧 DevOps & Herramientas</h4>
                  <InputField
                    label=""
                    value={skills.devops?.join(', ') || ''}
                    onChange={(e) => updateSkills('devops', e.target.value)}
                    placeholder="Git, Docker, AWS, Nginx..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* CERTIFICACIONES */}
          {activeTab === 'certifications' && (
            <div className="content-section">
              <div className="section-header">
                <h3>📜 Certificaciones</h3>
              </div>

              {/* Formulario para nueva certificación */}
              <div className="card">
                <h4>Agregar Nueva Certificación</h4>
                <div className="form-grid">
                  <InputField
                    label="Nombre de la Certificación"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                    placeholder="Ej: AWS Certified Developer"
                    required
                  />
                  <InputField
                    label="Institución"
                    value={newCertification.institution}
                    onChange={(e) => setNewCertification({...newCertification, institution: e.target.value})}
                    placeholder="Ej: Amazon Web Services"
                    required
                  />
                  <InputField
                    label="Año"
                    value={newCertification.year}
                    onChange={(e) => setNewCertification({...newCertification, year: e.target.value})}
                    placeholder="2024"
                  />
                  <InputField
                    label="Categoría"
                    value={newCertification.category}
                    onChange={(e) => setNewCertification({...newCertification, category: e.target.value})}
                    placeholder="Cloud Computing"
                  />
                  <InputField
                    label="Código de Certificación"
                    value={newCertification.code}
                    onChange={(e) => setNewCertification({...newCertification, code: e.target.value})}
                    placeholder="Código único (opcional)"
                  />
                </div>
                <button 
                  onClick={addCertification}
                  disabled={loading || !newCertification.name || !newCertification.institution}
                  className="btn-add"
                >
                  {loading ? '➕ Agregando...' : '➕ Agregar Certificación'}
                </button>
              </div>

              {/* Lista de certificaciones existentes */}
              <div className="certifications-list">
                <h4>Certificaciones Existentes</h4>
                {certifications.length > 0 ? (
                  certifications.map((cert, index) => (
                    <div key={cert._id || index} className="certification-item">
                      <div className="cert-info">
                        <strong>{cert.name}</strong>
                        <span>{cert.institution} • {cert.year}</span>
                        {cert.category && <small>Categoría: {cert.category}</small>}
                        {cert.code && <small>Código: {cert.code}</small>}
                      </div>
                      <button
                        onClick={() => deleteCertification(cert._id)}
                        disabled={loading}
                        className="btn-delete-small"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No hay certificaciones agregadas</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-panel-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .menu-toggle:hover {
          background: rgba(0,0,0,0.1);
        }

        .edit-mode-banner {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
        }

        .btn-exit {
          background: rgba(255,255,255,0.8);
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .btn-exit:hover {
          background: white;
          transform: translateY(-1px);
        }

        .message {
          margin: 1rem 2rem;
          padding: 1rem;
          border-radius: 10px;
          font-weight: 600;
          text-align: center;
          animation: slideIn 0.3s ease;
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

        .admin-layout {
          display: flex;
          min-height: calc(100vh - 80px);
        }

        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          border-right: 1px solid rgba(255,255,255,0.2);
        }

        .sidebar.closed {
          width: 0;
          overflow: hidden;
        }

        .sidebar-content {
          padding: 2rem 1rem;
        }

        .sidebar-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border: none;
          background: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          color: #333;
        }

        .sidebar-item:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(5px);
        }

        .sidebar-item.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .sidebar-item .icon {
          font-size: 1.2rem;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .content-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }

        .section-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }

        .section-actions {
          display: flex;
          gap: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-field label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .required {
          color: #e74c3c;
        }

        .input-field input,
        .input-field textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e8e8e8;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.8);
        }

        .input-field input:focus,
        .input-field textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .card {
          background: rgba(248, 249, 250, 0.8);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h4 {
          margin: 0;
          color: #333;
        }

        .array-item {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        .array-item input {
          flex: 1;
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .skill-category {
          background: rgba(255,255,255,0.6);
          padding: 1.5rem;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .skill-category h4 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .certifications-list {
          margin-top: 2rem;
        }

        .certification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          margin-bottom: 0.5rem;
          background: rgba(248, 249, 250, 0.8);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .cert-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cert-info strong {
          color: #333;
        }

        .cert-info span {
          color: #666;
          font-size: 0.9rem;
        }

        .cert-info small {
          color: #888;
          font-size: 0.8rem;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 2rem;
        }

        /* Botones */
        .btn-save {
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-add {
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-add:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .btn-add-small {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .btn-add-small:hover {
          background: #2980b9;
          transform: translateY(-1px);
        }

        .btn-delete {
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-delete:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        .btn-delete-small {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.3s ease;
        }

        .btn-delete-small:hover:not(:disabled) {
          background: #c0392b;
          transform: scale(1.05);
        }

        .btn-remove {
          background: #95a5a6;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transition: all 0.3s ease;
        }

        .btn-remove:hover {
          background: #7f8c8d;
          transform: scale(1.1);
        }

        /* Animaciones */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .sidebar {
            position: fixed;
            height: 100vh;
            z-index: 1000;
            transform: translateX(0);
          }

          .sidebar.closed {
            transform: translateX(-100%);
          }

          .main-content {
            padding: 1rem;
          }

          .content-section {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .section-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;