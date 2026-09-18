import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  Star, 
  Search, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Box, 
  AlertTriangle,
  RotateCcw,
  Eye,
  Zap
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FigureFormModal from './FigureFormModal';
import SettingsModal from './SettingsModal';

export default function AdminDashboard({ onSelectFigure, onCatalogUpdated }) {
  const { token, settings } = useAuth();
  const [figures, setFigures] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [editingFigure, setEditingFigure] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deletingFigure, setDeletingFigure] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [figsData, statsData] = await Promise.all([
        api.getFigures(),
        api.getAdminStats(token)
      ]);
      setFigures(figsData);
      setStats(statsData);
      if (onCatalogUpdated) onCatalogUpdated();
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await api.updateFigure(id, { status: newStatus }, token);
      loadData();
    } catch (err) {
      alert('Error al cambiar el estado: ' + err.message);
    }
  };

  const handleToggleFeatured = async (figure) => {
    try {
      await api.updateFigure(figure.id, { featured: !figure.featured }, token);
      loadData();
    } catch (err) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deletingFigure) return;
    try {
      await api.deleteFigure(deletingFigure.id, token);
      setDeletingFigure(null);
      loadData();
    } catch (err) {
      alert('Error al eliminar figura: ' + err.message);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('¿Estás seguro de restablecer el catálogo a las figuras de demostración originales?')) {
      try {
        await api.resetDemoData(token);
        loadData();
      } catch (err) {
        alert('Error al restaurar: ' + err.message);
      }
    }
  };

  const filteredFigures = figures.filter(fig => {
    const matchesSearch = 
      !searchTerm ||
      fig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fig.character?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fig.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fig.franchise?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || fig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px_6px_24px_6px] border-2 border-slate-900 shadow-[6px_6px_0px_rgba(15,23,42,0.9)] crosshair-pattern">
        <div>
          <div className="hud-tag inline-flex items-center space-x-2 px-3 py-1 bg-slate-900 text-rose-500 font-extrabold mb-2">
            <Zap className="w-3.5 h-3.5 fill-rose-500" />
            <span>CONTROL DE INVENTARIO & PUBLICACIONES</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            Panel del Curador
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Crea, modifica o elimina publicaciones de figuras de acción, administra fotos y especificaciones.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingFigure(null);
              setIsFormOpen(true);
            }}
            className="btn-mechanical inline-flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-slate-900 text-white text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Publicación</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="btn-mechanical inline-flex items-center space-x-2 px-3.5 py-2.5 bg-white hover:bg-[#F0ECE4] text-slate-800 text-xs border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            title="Configuración de la tienda y WhatsApp"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Ajustes</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="btn-mechanical inline-flex items-center space-x-2 px-3.5 py-2.5 bg-[#FAF9F6] hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs border border-[#D1C7BD]"
            title="Restaurar catálogo inicial de figuras demo"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Restaurar Demo</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          <div className="p-4 rounded-[14px_4px_14px_4px] bg-white border-2 border-[#E2DDD5] shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-[8px_2px_8px_2px] bg-slate-900 text-white font-mono-tech">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono-tech text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Figuras</span>
              <span className="font-heading text-2xl font-black text-slate-900">{stats.total}</span>
            </div>
          </div>

          <div className="p-4 rounded-[14px_4px_14px_4px] bg-white border-2 border-emerald-500 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-[8px_2px_8px_2px] bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono-tech text-[9px] font-bold text-emerald-600 uppercase tracking-widest block">Disponibles</span>
              <span className="font-heading text-2xl font-black text-emerald-600">{stats.available}</span>
            </div>
          </div>

          <div className="p-4 rounded-[14px_4px_14px_4px] bg-white border-2 border-amber-400 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-[8px_2px_8px_2px] bg-amber-100 text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono-tech text-[9px] font-bold text-amber-600 uppercase tracking-widest block">Reservadas</span>
              <span className="font-heading text-2xl font-black text-amber-600">{stats.reserved}</span>
            </div>
          </div>

          <div className="p-4 rounded-[14px_4px_14px_4px] bg-white border-2 border-blue-400 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-[8px_2px_8px_2px] bg-blue-100 text-blue-800">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono-tech text-[9px] font-bold text-blue-600 uppercase tracking-widest block">Exhibición</span>
              <span className="font-heading text-2xl font-black text-blue-600">{stats.displayOnly}</span>
            </div>
          </div>

          <div className="p-4 rounded-[14px_4px_14px_4px] bg-white border-2 border-slate-900 shadow-sm flex items-center space-x-3 col-span-2 lg:col-span-1">
            <div className="p-2.5 rounded-[8px_2px_8px_2px] bg-slate-900 text-rose-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono-tech text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Valor Total</span>
              <span className="font-heading text-xl font-black text-slate-900">${stats.totalInventoryValue} <span className="font-mono-tech text-[10px] text-slate-500">{settings.currency || 'USD'}</span></span>
            </div>
          </div>

        </div>
      )}

      {/* Publications Management Table */}
      <div className="bg-white rounded-[24px_6px_24px_6px] border-2 border-slate-900 shadow-[6px_6px_0px_rgba(15,23,42,0.9)] overflow-hidden space-y-4 p-6 crosshair-pattern">
        
        {/* Table Filter / Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nombre, personaje, marca..."
              className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-heading"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold font-heading bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] px-3 py-2 text-slate-800"
            >
              <option value="all">Todos los estados</option>
              <option value="Disponible">🟢 Solo Disponibles</option>
              <option value="Reservado">🟡 Reservados</option>
              <option value="Vendido">⚪ Vendidos</option>
              <option value="En Exhibición">🔵 En Exhibición</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-y-2 border-slate-900 text-[10px] font-mono-tech font-extrabold uppercase tracking-widest text-slate-600">
                <th className="py-3 px-4">FIGURA & FOTOS</th>
                <th className="py-3 px-4">UNIVERSO / MARCA</th>
                <th className="py-3 px-4">ESCALA & ALTURA</th>
                <th className="py-3 px-4">PRECIO</th>
                <th className="py-3 px-4">ESTADO</th>
                <th className="py-3 px-4 text-center">DESTACADA</th>
                <th className="py-3 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#F0EBE1] text-xs">
              {filteredFigures.length > 0 ? (
                filteredFigures.map((fig) => {
                  const mainImg = fig.images?.[fig.primaryImageIndex || 0] || fig.images?.[0];
                  return (
                    <tr key={fig.id} className="hover:bg-rose-50/30 transition-colors">
                      
                      {/* Media & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-14 h-14 rounded-[8px_2px_8px_2px] figure-pedestal border-2 border-[#E2DDD5] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={mainImg} alt={fig.name} className="w-full h-full object-contain relative z-10" />
                            {fig.images?.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-slate-900 text-[9px] text-white px-1 font-mono-tech font-bold z-20">
                                {fig.images.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <span 
                              onClick={() => onSelectFigure(fig)}
                              className="font-heading font-black text-slate-900 hover:text-rose-600 cursor-pointer block line-clamp-1 uppercase"
                              title={fig.name}
                            >
                              {fig.name}
                            </span>
                            {fig.character && (
                              <span className="font-mono-tech text-[10px] text-slate-500 font-bold">
                                // {fig.character}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Franchise / Brand */}
                      <td className="py-3 px-4">
                        <div className="font-heading font-black text-slate-900">{fig.brand}</div>
                        <div className="font-mono-tech text-[10px] text-slate-500">[{fig.franchise}]</div>
                      </td>

                      {/* Scale / Height */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">Escala {fig.scale}</div>
                        <div className="font-mono-tech text-[10px] text-slate-400">{fig.height || 'N/A'}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-heading font-black text-slate-900 whitespace-nowrap">
                        {fig.price > 0 ? (
                          <span>${fig.price} <span className="font-mono-tech text-[10px] text-slate-500">{fig.currency || 'USD'}</span></span>
                        ) : (
                          <span className="text-slate-400 font-mono-tech text-[10px]">CONSULTAR</span>
                        )}
                      </td>

                      {/* Quick Status Selector */}
                      <td className="py-3 px-4">
                        <select
                          value={fig.status}
                          onChange={(e) => handleQuickStatusChange(fig.id, e.target.value)}
                          className={`text-xs font-bold rounded-[6px_2px_6px_2px] px-2.5 py-1.5 border-2 focus:outline-none transition-colors font-mono-tech ${
                            fig.status === 'Disponible'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                              : fig.status === 'Reservado'
                              ? 'bg-amber-50 text-amber-800 border-amber-500'
                              : fig.status === 'Vendido'
                              ? 'bg-slate-100 text-slate-600 border-slate-300'
                              : 'bg-blue-50 text-blue-800 border-blue-500'
                          }`}
                        >
                          <option value="Disponible">🟢 Disponible</option>
                          <option value="En Exhibición">🔵 En Exhibición</option>
                          <option value="Reservado">🟡 Reservado</option>
                          <option value="Vendido">⚪ Vendido</option>
                        </select>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(fig)}
                          className={`p-1.5 rounded-[6px_2px_6px_2px] border-2 transition-all ${
                            fig.featured
                              ? 'bg-amber-400 text-slate-900 border-slate-900 shadow-sm'
                              : 'text-slate-300 hover:text-slate-700 border-transparent hover:border-slate-300'
                          }`}
                          title={fig.featured ? 'Destacada en portada' : 'Hacer destacada'}
                        >
                          <Star className={`w-4 h-4 ${fig.featured ? 'fill-slate-900' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingFigure(fig);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-[6px_2px_6px_2px] text-slate-800 bg-[#F0ECE4] hover:bg-slate-900 hover:text-white border border-[#DDD5C9] transition-colors"
                            title="Editar publicación"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingFigure(fig)}
                            className="p-1.5 rounded-[6px_2px_6px_2px] text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors"
                            title="Eliminar publicación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono-tech">
                    [ NO SE ENCONTRARON PUBLICACIONES ]
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Form Modal */}
      <FigureFormModal
        figure={editingFigure}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFigure(null);
        }}
        onSaved={loadData}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={loadData}
      />

      {/* Delete Confirmation Modal */}
      {deletingFigure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[24px_6px_24px_6px] p-6 max-w-sm w-full border-2 border-slate-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 rounded-[12px_3px_12px_3px] bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border-2 border-rose-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-base font-black text-slate-900 uppercase">¿Eliminar publicación?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Estás por eliminar <b>"{deletingFigure.name}"</b>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeletingFigure(null)}
                className="btn-mechanical px-4 py-2 text-xs bg-[#F0ECE4] text-slate-800 border border-[#DDD5C9]"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-mechanical px-4 py-2 text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
