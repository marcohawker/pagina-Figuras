import React from 'react';
import { Shield, Sparkles, LogIn, LogOut, LayoutDashboard, Phone, Store, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenLogin,
  onOpenSettings
}) {
  const { isAuthenticated, logout, settings } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b-2 border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setCurrentView('catalog')}
            className="flex items-center space-x-3.5 cursor-pointer group select-none"
          >
            {/* Geometric Collector Hex Shield Icon */}
            <div className="relative w-11 h-11 rounded-[12px_3px_12px_3px] bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-white shadow-[3px_3px_0px_rgba(225,29,72,0.9)] group-hover:scale-105 group-hover:shadow-[4px_4px_0px_rgba(225,29,72,1)] transition-all duration-200">
              <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-slate-900"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors uppercase">
                  {settings.showroomName || 'ACTION VAULT'}
                </span>
                <span className="hud-tag px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                  SHOWROOM // v2.6
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-wide uppercase">
                {settings.showroomTagline || 'Galería de Figuras de Acción & Estatuas Premium'}
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* View Switcher if Authenticated */}
            {isAuthenticated ? (
              <div className="flex items-center bg-[#EDE7DE] p-1 rounded-[10px_3px_10px_3px] border border-[#DCD3C7]">
                <button
                  onClick={() => setCurrentView('catalog')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[8px_2px_8px_2px] text-xs font-bold font-heading transition-all ${
                    currentView === 'catalog'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-4 h-4 text-rose-600" />
                  <span className="hidden md:inline">Galería</span>
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[8px_2px_8px_2px] text-xs font-bold font-heading transition-all ${
                    currentView === 'admin'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Panel Admin</span>
                </button>
              </div>
            ) : null}

            {/* Direct WhatsApp Quick Contact */}
            {settings.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center space-x-2 text-xs font-bold text-slate-900 bg-white hover:bg-emerald-50 px-3.5 py-2 rounded-[10px_3px_10px_3px] border-2 border-emerald-500 shadow-[2px_2px_0px_rgba(16,185,129,0.3)] transition-all font-heading"
                title="Consultas por WhatsApp"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>WhatsApp Directo</span>
              </a>
            )}

            {/* Admin Access / Logout */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-[10px_3px_10px_3px] border border-rose-300 transition-colors font-heading"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="btn-mechanical flex items-center space-x-2 text-xs text-slate-800 bg-white hover:bg-slate-50 px-4 py-2 border-2 border-slate-800 hover:border-rose-600 hover:text-rose-600 transition-all"
              >
                <Shield className="w-4 h-4 text-slate-700" />
                <span>Acceso Admin</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
