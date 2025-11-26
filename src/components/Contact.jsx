import React, { useState } from 'react';

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario, por ejemplo, a un API route
    console.log(formData);
    alert('Mensaje enviado (esto es una simulación)');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contacto" className="contact">
      <div className="container">
        <h2>Contacto</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Información de Contacto</h3>
            <p><strong>Teléfono:</strong> {profile?.phone}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Ubicación:</strong> {profile?.location}</p>
            <p><strong>LinkedIn:</strong> <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer">Ver perfil</a></p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;