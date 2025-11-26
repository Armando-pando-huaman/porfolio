import React, { useState } from 'react';

const AdminPanel = ({ onDataUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Estados para los formularios
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    description: '',
    availability: '',
    english: ''
  });

  const [experience, setExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ['']
  });

  const [project, setProject] = useState({
    title: '',
    date: '',
    technologies: [''],
    description: [''],
    results: [''],
    videoUrl: ''
  });

  const [certification, setCertification] = useState({
    name: '',
    institution: '',
    date: '',
    image: ''
  });

  const [skills, setSkills] = useState({
    frontend: [''],
    backend: [''],
    databases: [''],
    devops: [''],
    infrastructure: ['']
  });

  // Funciones para manejar cambios en formularios
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (field, value) => {
    setExperience(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationChange = (field, value) => {
    setCertification(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (category, index, value) => {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].map((skill, i) => i === index ? value : skill)
    }));
  };

  // Funciones para agregar elementos a arrays
  const addArrayItem = (setter, field) => {
    setter(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  // Funciones para enviar datos
  const saveProfile = async () => {
    setLoading(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      onDataUpdate();
      alert('Perfil actualizado correctamente');
    } catch (error) {
      alert('Error al guardar perfil');
    } finally {
      setLoading(false);
    }
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience)
      });
      onDataUpdate();
      setExperience({ company: '', position: '', startDate: '', endDate: '', description: [''] });
      alert('Experiencia guardada correctamente');
    } catch (error) {
      alert('Error al guardar experiencia');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    setLoading(true);
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      onDataUpdate();
      setProject({ title: '', date: '', technologies: [''], description: [''], results: [''], videoUrl: '' });
      alert('Proyecto guardado correctamente');
    } catch (error) {
      alert('Error al guardar proyecto');
    } finally {
      setLoading(false);
    }
  };

  const saveCertification = async () => {
    setLoading(true);
    try {
      await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certification)
      });
      onDataUpdate();
      setCertification({ name: '', institution: '', date: '', image: '' });
      alert('Certificación guardada correctamente');
    } catch (error) {
      alert('Error al guardar certificación');
    } finally {
      setLoading(false);
    }
  };

  const saveSkills = async () => {
    setLoading(true);
    try {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills)
      });
      onDataUpdate();
      alert('Habilidades guardadas correctamente');
    } catch (error) {
      alert('Error al guardar habilidades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <button 
        className="admin-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ Admin
      </button>
      
      {isOpen && (
        <div className="admin-modal">
          <div className="admin-content">
            <div className="admin-header">
              <h3>Panel de Administración</h3>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-tabs">
              <button 
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                Perfil
              </button>
              <button 
                className={activeTab === 'experience' ? 'active' : ''}
                onClick={() => setActiveTab('experience')}
              >
                Experiencia
              </button>
              <button 
                className={activeTab === 'projects' ? 'active' : ''}
                onClick={() => setActiveTab('projects')}
              >
                Proyectos
              </button>
              <button 
                className={activeTab === 'certifications' ? 'active' : ''}
                onClick={() => setActiveTab('certifications')}
              >
                Certificaciones
              </button>
              <button 
                className={activeTab === 'skills' ? 'active' : ''}
                onClick={() => setActiveTab('skills')}
              >
                Habilidades
              </button>
            </div>

            <div className="admin-forms">
              {activeTab === 'profile' && (
                <div className="form-section">
                  <h4>Editar Perfil</h4>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Título profesional"
                    value={profile.title}
                    onChange={(e) => handleProfileChange('title', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Ubicación"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={profile.linkedin}
                    onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                  />
                  <textarea
                    placeholder="Descripción profesional"
                    value={profile.description}
                    onChange={(e) => handleProfileChange('description', e.target.value)}
                    rows="4"
                  />
                  <button onClick={saveProfile} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Perfil'}
                  </button>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="form-section">
                  <h4>Agregar Experiencia</h4>
                  <input
                    type="text"
                    placeholder="Empresa"
                    value={experience.company}
                    onChange={(e) => handleExperienceChange('company', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Cargo"
                    value={experience.position}
                    onChange={(e) => handleExperienceChange('position', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Fecha inicio (Ej: Julio 2023)"
                    value={experience.startDate}
                    onChange={(e) => handleExperienceChange('startDate', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Fecha fin (Ej: Presente)"
                    value={experience.endDate}
                    onChange={(e) => handleExperienceChange('endDate', e.target.value)}
                  />
                  <div>
                    <label>Descripción (una por línea):</label>
                    {experience.description.map((desc, index) => (
                      <textarea
                        key={index}
                        value={desc}
                        onChange={(e) => {
                          const newDesc = [...experience.description];
                          newDesc[index] = e.target.value;
                          handleExperienceChange('description', newDesc);
                        }}
                        placeholder={`Punto ${index + 1} de la descripción`}
                        rows="2"
                      />
                    ))}
                    <button 
                      type="button"
                      onClick={() => addArrayItem(setExperience, 'description')}
                    >
                      + Agregar punto
                    </button>
                  </div>
                  <button onClick={saveExperience} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Experiencia'}
                  </button>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="form-section">
                  <h4>Agregar Proyecto</h4>
                  <input
                    type="text"
                    placeholder="Título del proyecto"
                    value={project.title}
                    onChange={(e) => handleProjectChange('title', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Fecha (Ej: Enero - Marzo 2025)"
                    value={project.date}
                    onChange={(e) => handleProjectChange('date', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="URL de video (YouTube)"
                    value={project.videoUrl}
                    onChange={(e) => handleProjectChange('videoUrl', e.target.value)}
                  />
                  <div>
                    <label>Tecnologías (una por línea):</label>
                    {project.technologies.map((tech, index) => (
                      <input
                        key={index}
                        type="text"
                        value={tech}
                        onChange={(e) => {
                          const newTech = [...project.technologies];
                          newTech[index] = e.target.value;
                          handleProjectChange('technologies', newTech);
                        }}
                        placeholder={`Tecnología ${index + 1}`}
                      />
                    ))}
                    <button 
                      type="button"
                      onClick={() => addArrayItem(setProject, 'technologies')}
                    >
                      + Agregar tecnología
                    </button>
                  </div>
                  <div>
                    <label>Descripción (una por línea):</label>
                    {project.description.map((desc, index) => (
                      <textarea
                        key={index}
                        value={desc}
                        onChange={(e) => {
                          const newDesc = [...project.description];
                          newDesc[index] = e.target.value;
                          handleProjectChange('description', newDesc);
                        }}
                        placeholder={`Punto ${index + 1} de la descripción`}
                        rows="2"
                      />
                    ))}
                    <button 
                      type="button"
                      onClick={() => addArrayItem(setProject, 'description')}
                    >
                      + Agregar punto
                    </button>
                  </div>
                  <div>
                    <label>Resultados (una por línea):</label>
                    {project.results.map((result, index) => (
                      <textarea
                        key={index}
                        value={result}
                        onChange={(e) => {
                          const newResults = [...project.results];
                          newResults[index] = e.target.value;
                          handleProjectChange('results', newResults);
                        }}
                        placeholder={`Resultado ${index + 1}`}
                        rows="2"
                      />
                    ))}
                    <button 
                      type="button"
                      onClick={() => addArrayItem(setProject, 'results')}
                    >
                      + Agregar resultado
                    </button>
                  </div>
                  <button onClick={saveProject} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Proyecto'}
                  </button>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="form-section">
                  <h4>Agregar Certificación</h4>
                  <input
                    type="text"
                    placeholder="Nombre de la certificación"
                    value={certification.name}
                    onChange={(e) => handleCertificationChange('name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Institución"
                    value={certification.institution}
                    onChange={(e) => handleCertificationChange('institution', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Fecha (Ej: 2023)"
                    value={certification.date}
                    onChange={(e) => handleCertificationChange('date', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="URL de la imagen del certificado"
                    value={certification.image}
                    onChange={(e) => handleCertificationChange('image', e.target.value)}
                  />
                  <button onClick={saveCertification} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Certificación'}
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="form-section">
                  <h4>Gestionar Habilidades</h4>
                  {Object.keys(skills).map(category => (
                    <div key={category} className="skill-category-form">
                      <h5>{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                      {skills[category].map((skill, index) => (
                        <input
                          key={index}
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(category, index, e.target.value)}
                          placeholder={`Habilidad ${index + 1} en ${category}`}
                        />
                      ))}
                      <button 
                        type="button"
                        onClick={() => addArrayItem(setSkills, category)}
                      >
                        + Agregar habilidad en {category}
                      </button>
                    </div>
                  ))}
                  <button onClick={saveSkills} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Habilidades'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;