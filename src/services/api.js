import { initialFigures } from '../../server/seed.js';
import { DEFAULT_FRANCHISES, DEFAULT_BRANDS } from '../components/FilterBarData.js';

const API_BASE = '/api';

// Local storage fallback helper for static hosting (like GitHub Pages)
const LOCAL_STORAGE_KEY = 'actionvault_figures_db';
const SETTINGS_KEY = 'actionvault_settings_db';

function getLocalFigures() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialFigures));
    return initialFigures;
  } catch (e) {
    return initialFigures;
  }
}

function saveLocalFigures(figs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(figs));
  } catch (e) {
    console.error('Local storage save error:', e);
  }
}

function getLocalSettings() {
  const defaults = {
    showroomName: 'ACTION VAULT',
    showroomTagline: 'Exhibición & Catálogo de Figuras de Acción de Alta Gama',
    whatsappNumber: '+5491123456789',
    currency: 'USD',
    franchises: DEFAULT_FRANCHISES,
    brands: DEFAULT_BRANDS
  };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch (e) {
    return defaults;
  }
}

export const api = {
  // Public figures list with filters
  getFigures: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'all') {
          params.append(key, val);
        }
      });
      const queryString = params.toString();
      const res = await fetch(`${API_BASE}/figures${queryString ? `?${queryString}` : ''}`);
      if (!res.ok) throw new Error('API server unavailable');
      const data = await res.json();
      return data.data;
    } catch (err) {
      // Static Fallback (GitHub Pages mode)
      let figures = getLocalFigures();

      if (filters.search) {
        const q = filters.search.toLowerCase();
        figures = figures.filter(f => 
          (f.name && f.name.toLowerCase().includes(q)) ||
          (f.character && f.character.toLowerCase().includes(q)) ||
          (f.franchise && f.franchise.toLowerCase().includes(q)) ||
          (f.brand && f.brand.toLowerCase().includes(q))
        );
      }

      if (filters.franchise && filters.franchise !== 'all') {
        figures = figures.filter(f => f.franchise === filters.franchise);
      }

      if (filters.brand && filters.brand !== 'all') {
        figures = figures.filter(f => f.brand === filters.brand);
      }

      if (filters.scale && filters.scale !== 'all') {
        figures = figures.filter(f => f.scale === filters.scale);
      }

      if (filters.status && filters.status !== 'all') {
        figures = figures.filter(f => f.status === filters.status);
      }

      if (filters.sortBy === 'price-asc') {
        figures.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      } else if (filters.sortBy === 'price-desc') {
        figures.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      } else if (filters.sortBy === 'name-asc') {
        figures.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filters.sortBy === 'name-desc') {
        figures.sort((a, b) => b.name.localeCompare(a.name));
      }

      return figures;
    }
  },

  // Single figure
  getFigureById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/figures/${id}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      const figures = getLocalFigures();
      return figures.find(f => f.id === id || f.id === Number(id)) || null;
    }
  },

  // Public settings
  getSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return getLocalSettings();
    }
  },

  // Admin login
  login: async (password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (err) {
      // Static Fallback
      if (password === 'admin') {
        return {
          success: true,
          token: 'demo_static_token_2026',
          user: { role: 'admin', name: 'Administrador' }
        };
      }
      throw new Error('Contraseña incorrecta');
    }
  },

  // Upload image files (In static mode, converts to data URLs)
  uploadImages: async (files, token) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('API upload failed');
      const data = await res.json();
      return data.urls;
    } catch (err) {
      // Fallback: Convert to Base64 data URLs for client-side storage
      const promises = Array.from(files).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });
      return await Promise.all(promises);
    }
  },

  // Admin Create figure
  createFigure: async (figureData, token) => {
    try {
      const res = await fetch(`${API_BASE}/admin/figures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(figureData),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      const figures = getLocalFigures();
      const newFig = {
        ...figureData,
        id: 'fig_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      figures.unshift(newFig);
      saveLocalFigures(figures);
      return newFig;
    }
  },

  // Admin Update figure
  updateFigure: async (id, figureData, token) => {
    try {
      const res = await fetch(`${API_BASE}/admin/figures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(figureData),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      const figures = getLocalFigures();
      const idx = figures.findIndex(f => f.id === id);
      if (idx !== -1) {
        figures[idx] = { ...figures[idx], ...figureData };
        saveLocalFigures(figures);
        return figures[idx];
      }
      return figureData;
    }
  },

  // Admin Delete figure
  deleteFigure: async (id, token) => {
    try {
      const res = await fetch(`${API_BASE}/admin/figures/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API error');
      return true;
    } catch (err) {
      const figures = getLocalFigures();
      const filtered = figures.filter(f => f.id !== id);
      saveLocalFigures(filtered);
      return true;
    }
  },

  // Admin Dashboard stats
  getAdminStats: async (token) => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      const figures = getLocalFigures();
      return {
        total: figures.length,
        available: figures.filter(f => f.status === 'Disponible').length,
        reserved: figures.filter(f => f.status === 'Reservado').length,
        sold: figures.filter(f => f.status === 'Vendido').length,
        displayOnly: figures.filter(f => f.status === 'En Exhibición').length,
        featured: figures.filter(f => f.featured).length,
        totalInventoryValue: figures.reduce((acc, f) => acc + (Number(f.price) || 0), 0)
      };
    }
  },

  // Admin Update settings
  updateSettings: async (settingsData, token) => {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsData)
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsData));
      return settingsData;
    }
  },

  // Admin Reset to demo
  resetDemoData: async (token) => {
    try {
      const res = await fetch(`${API_BASE}/admin/reset-demo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      saveLocalFigures(initialFigures);
      return initialFigures;
    }
  }
};
