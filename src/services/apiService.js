// Servicio centralizado para todas las peticiones API
const API_BASE = '/api';

const apiService = {



  personalData: {
    save: async (data) => {
      // Eliminar _id antes de enviar
      const { _id, ...dataWithoutId } = data;
      const response = await fetch('/api/personal-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithoutId),
      });
      return await response.json();
    }
  },

  // ========== EXPERIENCIA ==========
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

  // ========== PROYECTOS ==========
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

  // ========== HABILIDADES ==========
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

  // ========== CERTIFICACIONES ==========
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
  },

  // ========== FUNCIONES ESPECIALES =========

  health: {
    // Verificar estado del servidor y conexión a MongoDB
    check: async () => {
      const response = await fetch(`${API_BASE}/health`);
      return await response.json();
    }
  }
};

// Función de utilidad para manejar errores de fetch
const handleFetchError = (error) => {
  console.error('❌ Error de red:', error);
  return {
    success: false,
    error: 'Error de conexión con el servidor',
    details: error.message
  };
};

// Interceptor para manejar errores globalmente
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    return response;
  } catch (error) {
    return handleFetchError(error);
  }
};

export default apiService;