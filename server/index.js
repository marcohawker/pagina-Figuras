import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per photo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WebP, etc.)'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple admin token simulation for safety
const ADMIN_SESSION_SECRET = 'actionvault_admin_secret_token_2026';

// Auth middleware for protected routes
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SESSION_SECRET}`) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado. Inicia sesión como administrador.' });
  }
  next();
}

// --- PUBLIC ROUTES ---

// Get all figures with optional filters
app.get('/api/figures', (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      franchise: req.query.franchise,
      brand: req.query.brand,
      scale: req.query.scale,
      status: req.query.status,
      featured: req.query.featured,
      sortBy: req.query.sortBy
    };
    const figures = db.getAll(filters);
    res.json({ success: true, data: figures });
  } catch (error) {
    console.error('Error fetching figures:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el catálogo' });
  }
});

// Get single figure by ID
app.get('/api/figures/:id', (req, res) => {
  try {
    const figure = db.getById(req.params.id);
    if (!figure) {
      return res.status(404).json({ success: false, message: 'Figura no encontrada' });
    }
    res.json({ success: true, data: figure });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la figura' });
  }
});

// Get public settings (showroom name, WhatsApp, currency)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    // Exclude admin password from public settings
    const { adminPassword, ...publicSettings } = settings;
    res.json({ success: true, data: publicSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener configuración' });
  }
});

// Admin Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { password } = req.body;
    const settings = db.getSettings();
    if (password === settings.adminPassword) {
      res.json({
        success: true,
        token: ADMIN_SESSION_SECRET,
        user: { role: 'admin', name: 'Administrador' }
      });
    } else {
      res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor de autenticación' });
  }
});

// --- PROTECTED ADMIN ROUTES ---

// Image Upload Endpoint (multiple files)
app.post('/api/admin/upload', requireAdmin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No se recibieron archivos de imagen' });
    }
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ success: true, urls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error al subir las imágenes' });
  }
});

// Create new figure
app.post('/api/admin/figures', requireAdmin, (req, res) => {
  try {
    const created = db.create(req.body);
    res.status(201).json({ success: true, data: created, message: 'Figura publicada con éxito' });
  } catch (error) {
    console.error('Error creating figure:', error);
    res.status(500).json({ success: false, message: 'Error al crear la publicación' });
  }
});

// Update figure
app.put('/api/admin/figures/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Figura no encontrada' });
    }
    res.json({ success: true, data: updated, message: 'Publicación actualizada correctamente' });
  } catch (error) {
    console.error('Error updating figure:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la figura' });
  }
});

// Delete figure
app.delete('/api/admin/figures/:id', requireAdmin, (req, res) => {
  try {
    const deleted = db.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Figura no encontrada' });
    }
    res.json({ success: true, message: 'Publicación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la figura' });
  }
});

// Get Dashboard Statistics
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
});

// Update Admin Settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const current = db.getSettings();
    const updated = { ...current, ...req.body };
    db.saveSettings(updated);
    const { adminPassword, ...safe } = updated;
    res.json({ success: true, data: safe, message: 'Configuración guardada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar configuración' });
  }
});

// Reset catalog to demo figures
app.post('/api/admin/reset-demo', requireAdmin, (req, res) => {
  try {
    const resetData = db.resetToDefault();
    res.json({ success: true, data: resetData, message: 'Catálogo restaurado con figuras de prueba' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al restaurar catálogo' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API de ActionVault ejecutándose en http://localhost:${PORT}`);
});
