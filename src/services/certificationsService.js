const API_BASE = '/api';

export const certificationsService = {
  // Obtener todas las certificaciones
  getCertifications: async () => {
    const response = await fetch(`${API_BASE}/certifications`);
    return await response.json();
  },

  // Crear una nueva certificación
  createCertification: async (certification) => {
    const response = await fetch(`${API_BASE}/certifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certification),
    });
    return await response.json();
  },

  // Actualizar una certificación existente
  updateCertification: async (id, certification) => {
    const response = await fetch(`${API_BASE}/certifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: id, ...certification }),
    });
    return await response.json();
  },

  // Eliminar una certificación
  deleteCertification: async (id) => {
    const response = await fetch(`${API_BASE}/certifications`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: id }),
    });
    return await response.json();
  }
};