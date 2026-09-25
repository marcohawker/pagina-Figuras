import React, { useState } from 'react';
import { Shield, Sparkles, LogIn, LogOut, LayoutDashboard, Phone, Store, Zap, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation, AVAILABLE_LANGUAGES } from '../i18n/LanguageContext';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenLogin,
  onOpenCustomizer
}) {
  const { isAuthenticated, logout, settings, activeTheme } = useAuth();
  const { language, setLanguage, t, currentLanguageMeta } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b-2 border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setCurrentView('catalog')}
            className="flex items-center space-x-3.5 cursor-pointer group select-none"
          >
            {/* Geometric Collector Hex Shield Icon with active theme color */}
            <div 
              className="relative w-11 h-11 rounded-[12px_3px_12px_3px] bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-white transition-all duration-200 group-hover:scale-105"
              style={{ boxShadow: `3px 3px 0px ${activeTheme.primaryColor}` }}
            >
              <Zap className="w-5 h-5" style={{ fill: activeTheme.primaryColor, color: activeTheme.primaryColor }} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-slate-900"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors uppercase">
                  {settings.showroomName || 'ACTION VAULT'}
                </span>
                <span className="hud-tag px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                  {t('showroom_badge')}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-wide uppercase">
                {settings.showroomTagline || 'High-End Action Figures & Collectibles Showroom'}
              </p>
            </div>
          </div>

          {/* Navigation, Language Switcher & Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="btn-mechanical flex items-center space-x-1.5 px-3 py-1.5 bg-white text-slate-800 text-xs border-2 border-[#DCD3C7] hover:border-slate-900 shadow-sm"
                title={t('language_select')}
              >
                <span className="text-sm">{currentLanguageMeta.flag}</span>
                <span className="font-mono-tech font-bold">{currentLanguageMeta.short}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isLangOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-36 bg-white rounded-[12px_3px_12px_3px] border-2 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] p-1 z-50 animate-fadeIn"
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold font-heading rounded-[6px_2px_6px_2px] transition-colors ${
                        language === lang.code
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <span className="text-[10px] text-amber-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                  <span className="hidden md:inline">{t('nav_gallery')}</span>
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[8px_2px_8px_2px] text-xs font-bold font-heading transition-all ${
                    currentView === 'admin'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav_admin_panel')}</span>
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
                title={t('nav_whatsapp')}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{t('nav_whatsapp')}</span>
              </a>
            )}

            {/* Admin Access / Logout */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-[10px_3px_10px_3px] border border-rose-300 transition-colors font-heading"
                title={t('nav_logout')}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav_logout')}</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="btn-mechanical flex items-center space-x-2 text-xs text-slate-800 bg-white hover:bg-slate-50 px-3.5 py-2 border-2 border-slate-800 hover:border-rose-600 hover:text-rose-600 transition-all"
              >
                <Shield className="w-4 h-4 text-slate-700" />
                <span>{t('nav_admin_access')}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
