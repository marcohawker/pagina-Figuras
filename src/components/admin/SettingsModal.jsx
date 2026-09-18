import React, { useState } from 'react';
import { X, Settings, Phone, DollarSign, Lock, Building, Check, AlertCircle, Save } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsModal({ isOpen, onClose, onSaved }) {
  const { token, settings, setSettings } = useAuth();

  const [formData, setFormData] = useState({
    showroomName: settings.showroomName || 'ACTION VAULT',
    showroomTagline: settings.showroomTagline || 'Galería & Catálogo de Figuras de Acción',
    whatsappNumber: settings.whatsappNumber || '+5491123456789',
    currency: settings.currency || 'USD',
    adminPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError('');

      const payload = {
        showroomName: formData.showroomName,
        showroomTagline: formData.showroomTagline,
        whatsappNumber: formData.whatsappNumber,
        currency: formData.currency,
      };

      if (formData.adminPassword.trim()) {
        payload.adminPassword = formData.adminPassword.trim();
      }

      const updated = await api.updateSettings(payload, token);
      setSettings(prev => ({ ...prev, ...updated }));
      setSuccessMsg('Ajustes guardados correctamente');
      setTimeout(() => {
        if (onSaved) onSaved();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-[24px_6px_24px_6px] shadow-[8px_8px_0px_rgba(15,23,42,1)] border-2 border-slate-900 overflow-hidden crosshair-pattern">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-900 bg-[#FAF9F6]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-[8px_2px_8px_2px] bg-slate-900 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-base font-black text-slate-900 uppercase">
                Ajustes del Showroom
              </h2>
              <p className="font-mono-tech text-[10px] text-slate-500 font-bold">
                [ CONFIGURACIÓN GENERAL & CANALES DE VENTA ]
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-[6px_2px_6px_2px] hover:bg-[#F0ECE4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs bg-[#FAF9F6]">
          
          {error && (
            <div className="p-3 rounded-[8px_2px_8px_2px] bg-rose-50 border-2 border-rose-300 flex items-center space-x-2 text-rose-700 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-[8px_2px_8px_2px] bg-emerald-50 border-2 border-emerald-400 flex items-center space-x-2 text-emerald-800 font-bold font-mono-tech">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-heading">
              Nombre de la Galería / Showroom
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formData.showroomName}
                onChange={(e) => setFormData({ ...formData, showroomName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-black font-heading text-xs uppercase focus:outline-none focus:border-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-heading">
              Lema de Encabezado / Subtítulo
            </label>
            <input
              type="text"
              value={formData.showroomTagline}
              onChange={(e) => setFormData({ ...formData, showroomTagline: e.target.value })}
              className="w-full px-3 py-2 bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-heading">
              Número de WhatsApp para Consultas de Clientes
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+5491123456789"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-mono-tech font-bold focus:outline-none focus:border-slate-900"
              />
            </div>
            <p className="font-mono-tech text-[9px] text-slate-500 mt-1">
              Al hacer click en "Consultar", los visitantes iniciarán un chat con este número y el nombre de la figura.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-heading">
              Moneda Predeterminada
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                placeholder="USD, ARS, EUR, MXN"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-mono-tech font-bold uppercase focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t-2 border-[#E2DDD5]">
            <label className="block font-bold text-slate-800 mb-1 font-heading">
              Cambiar Contraseña de Administrador (opcional)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                placeholder="Dejar en blanco para mantener la clave actual"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-mechanical px-4 py-2 text-xs bg-[#F0ECE4] text-slate-800 border border-[#DDD5C9]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-mechanical flex items-center space-x-1.5 px-5 py-2.5 bg-rose-600 hover:bg-slate-900 text-white text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Ajustes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
