import React, { useState } from 'react';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Proyecto agregado exitosamente!');
        setFormData({ title: '', description: '', category: '' });
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2>Agregar Nuevo Proyecto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título del proyecto"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={formData.category}
          onChange={handleChange}
        />
        <button type="submit">Agregar Proyecto</button>
      </form>
    </div>
  );
};

export default AdminPanel;  