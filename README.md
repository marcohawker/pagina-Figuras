# ⚡ ActionVault — Showroom de Figuras de Acción & Coleccionables

Plataforma web moderna, elegante y luminosa (tema claro) con estética **Showroom de Coleccionismo / Concesionaria**, diseñada para exhibir figuras de acción y estatuas de alta gama con catálogo interactivo, fichas técnicas completas, galerías multi-ángulo y un panel administrativo integral.

---

## 🚀 Cómo Iniciar la Aplicación

Para iniciar tanto el **Backend (API + almacenamiento de imágenes)** como el **Frontend (Vite + React)** simultáneamente con un solo comando:

```bash
npm run dev
```

- **Frontend (Galería)**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 🌟 Características Destacadas

### 1. 🏎️ Galería Pública (Estilo Concesionaria)
- **Tema Claro & Moderno**: Fondos blancos y grises suaves, iluminación de estudio, acabados visuales limpios y badges de alta visibilidad.
- **Hero Showcase**: Carrusel de piezas destacadas con estadísticas clave.
- **Buscador & Filtros en Tiempo Real**:
  - Búsqueda por personaje, nombre o palabra clave.
  - Filtros por **Franquicia** (*Marvel, DC Comics, Star Wars, Anime, Videojuegos, etc.*).
  - Filtro por **Fabricante / Marca** (*Hot Toys, Bandai SH Figuarts, NECA, Kotobukiya, etc.*).
  - Filtro por **Escala** (*1/6, 1/12, 1/4, Estatuas, etc.*).
  - Filtro por **Disponibilidad** (*🟢 Disponible, 🔵 En Exhibición, 🟡 Reservado, ⚪ Vendido*).
  - Ordenamiento por precio, novedades y orden alfabético.
  - Conmutador de vista: **Cuadrícula de Exhibición** o **Tabla Ficha Técnica**.

### 2. 🔍 Ficha Técnica & Galería Multi-Ángulo
- Al hacer clic en cualquier figura, se abre la vista detallada con:
  - **Galería interactiva**: visor principal, carrusel de miniaturas, navegación con flechas/teclado y modo pantalla completa (Lightbox).
  - **Ficha Técnica Oficial**: Fabricante, Línea, Escala, Altura en cm, Materiales, Año y Condición de caja.
  - **Accesorios Incluidos**: Lista visual con checkmarks de partes intercambiables y extras.
  - **Botón de Consulta por WhatsApp**: Abre directamente un chat con mensaje pre-armado de la figura consultada.

### 3. 🛡️ Panel de Administración (Gestión Completa)
- **Acceso Protegido**: Botón *Acceso Admin* en la barra superior (Contraseña predeterminada: `admin`, configurable).
- **Dashboard de Métricas**: Total de figuras, disponibles, reservadas, exhibición y valor de inventario.
- **Gestión de Publicaciones (CRUD)**:
  - **Crear y Modificar**: Nombre, personaje, universo, escala, altura, material, condición, precio y descripción.
  - **Subida de Múltiples Fotos**: Arrastrar y soltar archivos locales (guardados en `/server/uploads`) y/o URLs externas, con selector de foto de portada.
  - **Accesorios Dinámicos**: Añadir y quitar ítems en tiempo real.
  - **Acciones Rápidas**: Cambiar estado con un clic, marcar como destacada o eliminar publicaciones.
  - **Configuración**: Cambiar nombre del showroom, número de WhatsApp para ventas, moneda y clave de acceso.
  - **Restaurar Demo**: Opción para restaurar el catálogo de prueba cuando se desee.

---

## 📁 Estructura del Proyecto

```
pagina/
├── package.json
├── server/
│   ├── index.js          # Servidor Express y API REST
│   ├── db.js             # Base de datos JSON con persistencia
│   ├── seed.js           # Figuras de demostración iniciales
│   └── uploads/          # Directorio de fotos locales subidas
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Barra de navegación
│   │   ├── HeroBanner.jsx        # Banner interactivo destacado
│   │   ├── FilterBar.jsx         # Filtros y buscador
│   │   ├── FigureCard.jsx        # Tarjeta de figura con mini-hover
│   │   ├── FigureListView.jsx    # Vista en tabla
│   │   ├── FigureDetailModal.jsx # Ficha técnica y galería multi-ángulo
│   │   └── admin/
│   │       ├── AdminLoginModal.jsx # Modal de autenticación
│   │       ├── AdminDashboard.jsx  # Panel de administración
│   │       ├── FigureFormModal.jsx # Formulario con subida de fotos
│   │       └── SettingsModal.jsx   # Ajustes de tienda y WhatsApp
│   ├── context/
│   │   └── AuthContext.jsx       # Estado de sesión y configuración
│   ├── services/
│   │   └── api.js                # Cliente de conexión con API
│   ├── App.jsx                   # Componente principal
│   ├── index.css                 # Estilos Tailwind CSS
│   └── main.jsx
├── index.html
└── vite.config.js
```
