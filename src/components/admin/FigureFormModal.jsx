import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  Plus, 
  Check, 
  AlertCircle, 
  Link, 
  Sparkles,
  Save,
  Layers,
  Box,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FRANCHISES } from '../HeroBanner';
import { BRANDS } from '../FilterBarData';

export default function FigureFormModal({ 
  figure = null, 
  isOpen, 
  onClose, 
  onSaved 
}) {
  const { token, settings } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: figure?.name || '',
    character: figure?.character || '',
    franchise: figure?.franchise || 'Marvel',
    brand: figure?.brand || 'Hot Toys',
    line: figure?.line || '',
    scale: figure?.scale || '1/6',
    height: figure?.height || '30 cm',
    material: figure?.material || 'PVC / ABS',
    year: figure?.year || new Date().getFullYear().toString(),
    condition: figure?.condition || 'Nuevo en Caja (MIB)',
    status: figure?.status || 'Disponible',
    price: figure?.price !== undefined ? figure.price : '',
    currency: figure?.currency || settings.currency || 'USD',
    featured: Boolean(figure?.featured),
    description: figure?.description || '',
    accessories: figure?.accessories || [],
    images: figure?.images || [],
    primaryImageIndex: figure?.primaryImageIndex || 0,
  });

  const [accessoryInput, setAccessoryInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAccessory = (e) => {
    e?.preventDefault();
    if (!accessoryInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      accessories: [...prev.accessories, accessoryInput.trim()]
    }));
    setAccessoryInput('');
  };

  const handleRemoveAccessory = (index) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setError('');
      const uploadedUrls = await api.uploadImages(files, token);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      setError(err.message || 'Error al subir fotos');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, urlInput.trim()]
    }));
    setUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      let newPrimary = prev.primaryImageIndex;
      if (newPrimary >= newImages.length) {
        newPrimary = Math.max(0, newImages.length - 1);
      }
      return {
        ...prev,
        images: newImages,
        primaryImageIndex: newPrimary
      };
    });
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({ ...prev, primaryImageIndex: index }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Por favor ingresa el nombre de la figura');
      return;
    }

    if (formData.images.length === 0) {
      setError('Por favor agrega al menos una foto para la publicación');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (figure && figure.id) {
        await api.updateFigure(figure.id, formData, token);
      } else {
        await api.createFigure(formData, token);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-white rounded-[28px_8px_28px_8px] shadow-[10px_10px_0px_rgba(15,23,42,1)] border-2 border-slate-900 my-auto max-h-[92vh] flex flex-col overflow-hidden crosshair-pattern">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-900 bg-[#FAF9F6]">
          <div>
            <h2 className="font-heading text-lg font-black text-slate-900 uppercase">
              {figure ? '✏️ Modificar Registro de Figura' : '✨ Nueva Pieza de Colección'}
            </h2>
            <p className="font-mono-tech text-[10px] text-slate-500 font-bold">
              [ FICHA TÉCNICA // ARCHIVO DE EXHIBICIÓN ]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-[6px_2px_6px_2px] hover:bg-[#F0ECE4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs bg-[#FAF9F6]">
          
          {error && (
            <div className="p-3 rounded-[8px_2px_8px_2px] bg-rose-50 border-2 border-rose-300 flex items-center space-x-2 text-rose-700 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
            <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5 border-b-2 border-[#F0EBE1] pb-2">
              <FileText className="w-4 h-4" />
              <span>01 // INFORMACIÓN PRINCIPAL</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1 font-heading">
                  Nombre Oficial del Modelo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: Iron Man Mark LXXXV (Diecast) - Battle Damaged Edition"
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">
                  Personaje
                </label>
                <input
                  type="text"
                  value={formData.character}
                  onChange={(e) => handleChange('character', e.target.value)}
                  placeholder="Ej: Tony Stark / Iron Man"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">
                  Línea de Colección
                </label>
                <input
                  type="text"
                  value={formData.line}
                  onChange={(e) => handleChange('line', e.target.value)}
                  placeholder="Ej: Movie Masterpiece Series"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">
                  Franquicia / Universo *
                </label>
                <select
                  value={formData.franchise}
                  onChange={(e) => handleChange('franchise', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold text-slate-800"
                >
                  {FRANCHISES.slice(1).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">
                  Fabricante / Marca *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold text-slate-800"
                >
                  {BRANDS.slice(1).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Section 2: Technical Specs */}
          <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
            <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5 border-b-2 border-[#F0EBE1] pb-2">
              <Box className="w-4 h-4" />
              <span>02 // ESPECIFICACIONES TÉCNICAS</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Escala</label>
                <select
                  value={formData.scale}
                  onChange={(e) => handleChange('scale', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold"
                >
                  <option value="1/6">1/6 (~30 cm)</option>
                  <option value="1/12">1/12 (~15 cm)</option>
                  <option value="1/4">1/4 (~45 cm)</option>
                  <option value="1/10">1/10</option>
                  <option value="Estatua">Estatua / Diorama</option>
                  <option value="Nendoroid">Nendoroid</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Altura Exacta</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="Ej: 32.5 cm"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Año de Lanzamiento</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Ej: 2023"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Materiales</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  placeholder="Ej: Diecast, PVC, Tela"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1 font-heading">Condición de Caja</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold"
                >
                  <option value="Nuevo en Caja (MIB)">Nuevo en Caja Sellada (MIB)</option>
                  <option value="Abierto Impecable / Como Nuevo">Abierto Impecable / Como Nuevo</option>
                  <option value="En Exhibición (Sin detalles)">En Exhibición (Sin detalles)</option>
                  <option value="Suelto sin caja (Loose)">Suelto sin caja (Loose)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Status & Pricing */}
          <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
            <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5 border-b-2 border-[#F0EBE1] pb-2">
              <Layers className="w-4 h-4" />
              <span>03 // DISPONIBILIDAD & VALOR</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Estado de Publicación *</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold text-slate-800"
                >
                  <option value="Disponible">🟢 Disponible para Venta</option>
                  <option value="En Exhibición">🔵 Solo en Exhibición</option>
                  <option value="Reservado">🟡 Reservado</option>
                  <option value="Vendido">⚪ Vendido</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Precio</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="Ej: 350"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-black font-heading text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">Moneda</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  placeholder="USD, ARS, EUR..."
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-mono-tech font-bold uppercase"
                />
              </div>
            </div>

            {/* Featured Switch */}
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-[10px_3px_10px_3px] border-2 border-amber-300">
              <input
                type="checkbox"
                id="featured-check"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="featured-check" className="text-xs font-black text-slate-900 cursor-pointer flex items-center space-x-1.5 font-heading uppercase">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Destacar en Portada (Spotlight Hero)</span>
              </label>
            </div>
          </div>

          {/* Section 4: Photo Gallery Manager */}
          <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
            <div className="flex items-center justify-between border-b-2 border-[#F0EBE1] pb-2">
              <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>04 // GALERÍA DE FOTOS ({formData.images.length})</span>
              </h3>
              <span className="font-mono-tech text-[10px] text-slate-500 font-bold">
                [ ESTRELLA = PORTADA PRINCIPAL ]
              </span>
            </div>

            {/* Upload Zone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-900 bg-[#FAF9F6] hover:bg-rose-50/40 rounded-[14px_4px_14px_4px] p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center space-y-1"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <UploadCloud className="w-6 h-6 text-rose-600" />
                <span className="font-heading font-black text-slate-900 uppercase">Subir desde la computadora</span>
                <span className="font-mono-tech text-[9px] text-slate-500">JPG, PNG, WEBP (hasta 10MB)</span>
                {isUploading && <span className="font-mono-tech text-rose-600 font-bold animate-pulse">Subiendo fotos...</span>}
              </div>

              {/* Add by URL */}
              <div className="p-3 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[14px_4px_14px_4px] flex flex-col justify-center space-y-2">
                <span className="font-heading font-bold text-slate-700 flex items-center space-x-1">
                  <Link className="w-3.5 h-3.5 text-slate-400" />
                  <span>O agregar foto por enlace web:</span>
                </span>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="flex-1 px-3 py-2 text-xs bg-white border-2 border-[#E2DDD5] rounded-[6px_2px_6px_2px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="btn-mechanical px-3 py-2 bg-slate-900 text-white text-xs"
                  >
                    Añadir
                  </button>
                </div>
              </div>

            </div>

            {/* Images Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((img, idx) => {
                  const isPrimary = idx === formData.primaryImageIndex;
                  return (
                    <div 
                      key={idx}
                      className={`relative group rounded-[10px_3px_10px_3px] overflow-hidden border-2 figure-pedestal p-1 h-32 flex items-center justify-center ${
                        isPrimary ? 'border-amber-500 shadow-[3px_3px_0px_rgba(245,158,11,1)]' : 'border-[#E2DDD5]'
                      }`}
                    >
                      <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-contain relative z-10" />

                      {isPrimary && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-[4px_1px_4px_1px] bg-amber-400 text-slate-900 font-mono-tech text-[9px] font-extrabold shadow flex items-center space-x-1 z-20">
                          <Star className="w-3 h-3 fill-slate-900" />
                          <span>PORTADA</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 z-30">
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="p-1.5 rounded-[4px] bg-amber-400 text-slate-900 shadow"
                            title="Hacer foto de portada"
                          >
                            <Star className="w-4 h-4 fill-slate-900" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-[4px] bg-rose-600 text-white shadow"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 5: Accessories */}
          <div className="space-y-3 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
            <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5 border-b-2 border-[#F0EBE1] pb-2">
              <Sparkles className="w-4 h-4" />
              <span>05 // ACCESORIOS INCLUIDOS</span>
            </h3>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAccessory();
                  }
                }}
                placeholder="Ej: 3 pares de manos, Sable de luz LED, Base con logo..."
                className="flex-1 px-3.5 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-bold"
              />
              <button
                type="button"
                onClick={handleAddAccessory}
                className="btn-mechanical px-4 py-2 bg-slate-900 text-white text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {formData.accessories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.accessories.map((acc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[6px_2px_6px_2px] bg-[#FAF9F6] text-slate-800 border-2 border-[#E2DDD5] font-bold font-mono-tech text-[11px]"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{acc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAccessory(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Description */}
          <div className="space-y-2 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
            <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 border-b-2 border-[#F0EBE1] pb-2">
              06 // DESCRIPCIÓN & RESEÑA
            </h3>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detalles de pintura, acabados, articulaciones, origen..."
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 leading-relaxed font-medium"
            ></textarea>
          </div>

        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-white border-t-2 border-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="btn-mechanical px-4 py-2 text-xs bg-[#F0ECE4] text-slate-800 border border-[#DDD5C9]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="btn-mechanical flex items-center space-x-2 px-6 py-2.5 bg-rose-600 hover:bg-slate-900 text-white text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : figure ? 'Guardar Cambios' : 'Publicar Figura'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
