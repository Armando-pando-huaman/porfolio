// Servicio centralizado para todas las peticiones API
const API_BASE = '/api';

export const apiService = {
  // Datos Personales
  personalData: {
    get: async () => {
      const response = await fetch(`${API_BASE}/personal-data`);
      return await response.json();
    },
    save: async (data) => {
      const response = await fetch(`${API_BASE}/personal-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    }
  },

  // Experiencia
  experience: {
    get: async () => {
      const response = await fetch(`${API_BASE}/experience`);
      return await response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE}/experience`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...data }),
      });
      return await response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE}/experience`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      return await response.json();
    }
  },

  // Proyectos
  projects: {
    get: async () => {
      const response = await fetch(`${API_BASE}/projects`);
      return await response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...data }),
      });
      return await response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      return await response.json();
    }
  },

  // Habilidades
  skills: {
    get: async () => {
      const response = await fetch(`${API_BASE}/skills`);
      return await response.json();
    },
    save: async (data) => {
      const response = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    }
  },

  // Certificaciones
  certifications: {
    get: async () => {
      const response = await fetch(`${API_BASE}/certifications`);
      return await response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE}/certifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE}/certifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...data }),
      });
      return await response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE}/certifications`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      return await response.json();
    }
  }
};