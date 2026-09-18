import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialFigures } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'figures.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize figures data if not exists
function getFigures() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialFigures, null, 2), 'utf-8');
      return initialFigures;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialFigures, null, 2), 'utf-8');
      return initialFigures;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading figures database:', error);
    return initialFigures;
  }
}

function saveFigures(figures) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(figures, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving figures database:', error);
    return false;
  }
}

function getSettings() {
  const defaultSettings = {
    adminPassword: 'admin', // Default password, editable in settings
    showroomName: 'ActionVault',
    showroomTagline: 'Exhibición & Venta de Figuras de Acción de Alta Gama',
    whatsappNumber: '+5491123456789',
    currency: 'USD',
  };

  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      return defaultSettings;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (err) {
    return defaultSettings;
  }
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

export const db = {
  getAll: (filters = {}) => {
    let figures = getFigures();
    
    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      figures = figures.filter(f => 
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.character && f.character.toLowerCase().includes(q)) ||
        (f.franchise && f.franchise.toLowerCase().includes(q)) ||
        (f.brand && f.brand.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q))
      );
    }

    // Franchise filter
    if (filters.franchise && filters.franchise !== 'all') {
      figures = figures.filter(f => f.franchise === filters.franchise);
    }

    // Brand / Manufacturer filter
    if (filters.brand && filters.brand !== 'all') {
      figures = figures.filter(f => f.brand === filters.brand);
    }

    // Scale filter
    if (filters.scale && filters.scale !== 'all') {
      figures = figures.filter(f => f.scale === filters.scale);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      figures = figures.filter(f => f.status === filters.status);
    }

    // Featured only filter
    if (filters.featured === true || filters.featured === 'true') {
      figures = figures.filter(f => f.featured);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          figures.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
          break;
        case 'price-desc':
          figures.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
          break;
        case 'name-asc':
          figures.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          figures.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
        default:
          figures.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
      }
    } else {
      // Default: featured first, then newest
      figures.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    }

    return figures;
  },

  getById: (id) => {
    const figures = getFigures();
    return figures.find(f => f.id === id || f.id === Number(id)) || null;
  },

  create: (data) => {
    const figures = getFigures();
    const newFigure = {
      id: 'fig_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: data.name || 'Sin Título',
      character: data.character || '',
      franchise: data.franchise || 'Otros',
      brand: data.brand || 'Otros',
      line: data.line || '',
      scale: data.scale || '1/6',
      height: data.height || '',
      material: data.material || 'PVC / ABS',
      year: data.year || new Date().getFullYear().toString(),
      condition: data.condition || 'Nuevo en Caja (MIB)',
      status: data.status || 'Disponible', // Disponible, Reservado, Vendido, En Exhibición
      price: data.price !== undefined ? Number(data.price) : 0,
      currency: data.currency || 'USD',
      featured: Boolean(data.featured),
      description: data.description || '',
      accessories: Array.isArray(data.accessories) ? data.accessories : [],
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'],
      primaryImageIndex: Number(data.primaryImageIndex) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    figures.unshift(newFigure);
    saveFigures(figures);
    return newFigure;
  },

  update: (id, data) => {
    const figures = getFigures();
    const index = figures.findIndex(f => f.id === id || f.id === Number(id));
    if (index === -1) return null;

    const existing = figures[index];
    const updated = {
      ...existing,
      ...data,
      id: existing.id, // Preserve ID
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    figures[index] = updated;
    saveFigures(figures);
    return updated;
  },

  delete: (id) => {
    const figures = getFigures();
    const filtered = figures.filter(f => f.id !== id && f.id !== Number(id));
    if (filtered.length === figures.length) return false;
    saveFigures(filtered);
    return true;
  },

  getStats: () => {
    const figures = getFigures();
    return {
      total: figures.length,
      available: figures.filter(f => f.status === 'Disponible').length,
      reserved: figures.filter(f => f.status === 'Reservado').length,
      sold: figures.filter(f => f.status === 'Vendido').length,
      displayOnly: figures.filter(f => f.status === 'En Exhibición').length,
      featured: figures.filter(f => f.featured).length,
      totalInventoryValue: figures.reduce((acc, f) => acc + (Number(f.price) || 0), 0)
    };
  },

  getSettings,
  saveSettings,
  resetToDefault: () => {
    saveFigures(initialFigures);
    return initialFigures;
  }
};
