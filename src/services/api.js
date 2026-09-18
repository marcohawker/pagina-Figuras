const API_BASE = '/api';

export const api = {
  // Public figures list with filters
  getFigures: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        params.append(key, val);
      }
    });
    const queryString = params.toString();
    const url = `${API_BASE}/figures${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al obtener figuras');
    return data.data;
  },

  // Single figure
  getFigureById: async (id) => {
    const res = await fetch(`${API_BASE}/figures/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Figura no encontrada');
    return data.data;
  },

  // Public settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al obtener configuración');
    return data.data;
  },

  // Admin login
  login: async (password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
    return data;
  },

  // Upload image files
  uploadImages: async (files, token) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al subir fotos');
    return data.urls;
  },

  // Admin Create figure
  createFigure: async (figureData, token) => {
    const res = await fetch(`${API_BASE}/admin/figures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(figureData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al crear la figura');
    return data.data;
  },

  // Admin Update figure
  updateFigure: async (id, figureData, token) => {
    const res = await fetch(`${API_BASE}/admin/figures/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(figureData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al actualizar figura');
    return data.data;
  },

  // Admin Delete figure
  deleteFigure: async (id, token) => {
    const res = await fetch(`${API_BASE}/admin/figures/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al eliminar figura');
    return true;
  },

  // Admin Dashboard stats
  getAdminStats: async (token) => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al obtener estadísticas');
    return data.data;
  },

  // Admin Update settings
  updateSettings: async (settingsData, token) => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al actualizar configuración');
    return data.data;
  },

  // Admin Reset to demo
  resetDemoData: async (token) => {
    const res = await fetch(`${API_BASE}/admin/reset-demo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al restaurar catálogo demo');
    return data.data;
  }
};
