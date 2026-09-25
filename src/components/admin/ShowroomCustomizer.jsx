import React, { useState, useRef } from 'react';
import { 
  X, 
  Settings, 
  Palette, 
  FileText, 
  Phone, 
  Database, 
  Lock, 
  Check, 
  AlertCircle, 
  Save, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  DollarSign,
  Building,
  Layers,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { THEME_PRESETS } from '../../context/ThemePresets';

export default function ShowroomCustomizer({ isOpen, onClose, onSaved }) {
  const { token, settings, setSettings } = useAuth();
  const { t } = useTranslation();
  const fileImportRef = useRef(null);

  const [activeTab, setActiveTab] = useState('brand'); // 'brand' | 'theme' | 'contact' | 'data' | 'security'

  const [formData, setFormData] = useState({
    showroomName: settings.showroomName || 'ACTION VAULT',
    showroomTagline: settings.showroomTagline || 'High-End Action Figures & Collectibles Showroom',
    heroTitle: settings.heroTitle || '',
    heroHighlightedWord: settings.heroHighlightedWord || '',
    heroDescription: settings.heroDescription || '',
    heroAnnouncementPill: settings.heroAnnouncementPill || '',
    footerText: settings.footerText || '',
    accentColor: settings.accentColor || 'crimson',
    whatsappNumber: settings.whatsappNumber || '+5491123456789',
    whatsappTemplate: settings.whatsappTemplate || 'Hello! I am interested in "{name}" ({brand} - Scale {scale}) that I saw in your ActionVault showroom.',
    currency: settings.currency || 'USD',
    adminPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      setIsSaving(true);
      setError('');

      const payload = {
        showroomName: formData.showroomName,
        showroomTagline: formData.showroomTagline,
        heroTitle: formData.heroTitle,
        heroHighlightedWord: formData.heroHighlightedWord,
        heroDescription: formData.heroDescription,
        heroAnnouncementPill: formData.heroAnnouncementPill,
        footerText: formData.footerText,
        accentColor: formData.accentColor,
        whatsappNumber: formData.whatsappNumber,
        whatsappTemplate: formData.whatsappTemplate,
        currency: formData.currency,
      };

      if (formData.adminPassword.trim()) {
        payload.adminPassword = formData.adminPassword.trim();
      }

      const updated = await api.updateSettings(payload, token);
      setSettings(prev => ({ ...prev, ...updated }));
      setSuccessMsg(t('customizer_saved_success'));
      setTimeout(() => {
        if (onSaved) onSaved();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Export catalog as JSON
  const handleExportCatalog = async () => {
    try {
      const figures = await api.getFigures();
      const exportData = {
        version: "2.6",
        exportedAt: new Date().toISOString(),
        settings: {
          showroomName: formData.showroomName,
          currency: formData.currency
        },
        figures: figures
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `actionvault_catalog_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccessMsg('Catalog exported successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Error exporting catalog: ' + err.message);
    }
  };

  // Import catalog from JSON file
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const figuresToImport = Array.isArray(parsed) ? parsed : parsed.figures;

      if (!Array.isArray(figuresToImport) || figuresToImport.length === 0) {
        throw new Error('Invalid JSON format: No figures array found.');
      }

      if (window.confirm(`Are you sure you want to import ${figuresToImport.length} figures? This will update your catalog.`)) {
        // Save imported figures
        for (const fig of figuresToImport) {
          try {
            await api.createFigure(fig, token);
          } catch (e) {
            console.error('Error importing single figure:', e);
          }
        }
        setSuccessMsg(`Successfully imported ${figuresToImport.length} figures!`);
        if (onSaved) onSaved();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError('Error importing JSON: ' + err.message);
    } finally {
      if (fileImportRef.current) fileImportRef.current.value = '';
    }
  };

  // Reset to demo figures
  const handleResetDemo = async () => {
    if (window.confirm('Are you sure you want to reset the catalog to original demo figures?')) {
      try {
        await api.resetDemoData(token);
        setSuccessMsg('Catalog restored with demo action figures!');
        if (onSaved) onSaved();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        setError('Error resetting demo: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-[28px_8px_28px_8px] shadow-[10px_10px_0px_rgba(15,23,42,1)] border-2 border-slate-900 my-auto max-h-[92vh] flex flex-col overflow-hidden crosshair-pattern">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-900 bg-[#FAF9F6]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-[8px_2px_8px_2px] bg-slate-900 text-rose-500 shadow-sm">
              <Palette className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-slate-900 uppercase">
                {t('customizer_title')}
              </h2>
              <p className="font-mono-tech text-[10px] text-slate-500 font-bold">
                {t('customizer_sub')}
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

        {/* Tab Navigation Strip */}
        <div className="flex items-center px-6 py-2.5 bg-[#FAF9F6] border-b-2 border-[#E8E2D8] overflow-x-auto gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('brand')}
            className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
              activeTab === 'brand'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_rgba(225,29,72,1)]'
                : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
            }`}
          >
            {t('customizer_tab_brand')}
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
              activeTab === 'theme'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_rgba(225,29,72,1)]'
                : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
            }`}
          >
            {t('customizer_tab_theme')}
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
              activeTab === 'contact'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_rgba(225,29,72,1)]'
                : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
            }`}
          >
            {t('customizer_tab_contact')}
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
              activeTab === 'data'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_rgba(225,29,72,1)]'
                : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
            }`}
          >
            {t('customizer_tab_data')}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_rgba(225,29,72,1)]'
                : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
            }`}
          >
            {t('customizer_tab_security')}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs bg-[#FAF9F6]">
          
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

          {/* TAB 1: BRANDING & COPY */}
          {activeTab === 'brand' && (
            <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
              <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 border-b-2 border-[#F0EBE1] pb-2 flex items-center space-x-1.5">
                <FileText className="w-4 h-4" />
                <span>[ 01 // SHOWROOM IDENTITY & COPY ]</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_brand_name')}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.showroomName}
                      onChange={(e) => setFormData({ ...formData, showroomName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-black font-heading text-xs uppercase focus:outline-none focus:border-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_brand_tagline')}
                  </label>
                  <input
                    type="text"
                    value={formData.showroomTagline}
                    onChange={(e) => setFormData({ ...formData, showroomTagline: e.target.value })}
                    placeholder="e.g. Gallery & Catalog of Action Figures"
                    className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_hero_badge')}
                  </label>
                  <input
                    type="text"
                    value={formData.heroAnnouncementPill}
                    onChange={(e) => setFormData({ ...formData, heroAnnouncementPill: e.target.value })}
                    placeholder="e.g. ARCHIVE // 2026 EXHIBITION"
                    className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-mono-tech font-bold focus:outline-none focus:border-slate-900 uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_hero_highlight')}
                  </label>
                  <input
                    type="text"
                    value={formData.heroHighlightedWord}
                    onChange={(e) => setFormData({ ...formData, heroHighlightedWord: e.target.value })}
                    placeholder="e.g. Collectibles / Coleccionismo"
                    className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_hero_desc')}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.heroDescription}
                    onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                    placeholder="Inspect every collectible piece like in a luxury art dealership..."
                    className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 leading-relaxed font-medium"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_footer_text')}
                  </label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    placeholder="Specialized catalog for collectible scale figures and statues..."
                    className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME & COLORS */}
          {activeTab === 'theme' && (
            <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
              <div className="border-b-2 border-[#F0EBE1] pb-2">
                <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5">
                  <Palette className="w-4 h-4" />
                  <span>[ 02 // STORE ACCENT COLOR PALETTES ]</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {t('customizer_theme_accent_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = formData.accentColor === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setFormData({ ...formData, accentColor: preset.id })}
                      className={`p-3.5 rounded-[12px_3px_12px_3px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-slate-900 bg-[#FAF9F6] shadow-[4px_4px_0px_rgba(0,0,0,0.8)] scale-[1.02]'
                          : 'border-[#E2DDD5] bg-white hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-slate-900 shadow-sm flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: preset.primaryColor }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="font-heading font-black text-xs text-slate-900">{preset.name}</div>
                          <div className="font-mono-tech text-[9px] text-slate-400 font-bold">{preset.primaryColor}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & SALES */}
          {activeTab === 'contact' && (
            <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
              <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 border-b-2 border-[#F0EBE1] pb-2 flex items-center space-x-1.5">
                <Phone className="w-4 h-4" />
                <span>[ 03 // SALES CHANNELS & CURRENCY ]</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_whatsapp_num')}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="+5491123456789"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-mono-tech font-bold focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <p className="font-mono-tech text-[9px] text-slate-500 mt-1">
                    {t('customizer_whatsapp_help')}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_whatsapp_template')}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whatsappTemplate}
                    onChange={(e) => setFormData({ ...formData, whatsappTemplate: e.target.value })}
                    placeholder='Hello! I am interested in "{name}" ({brand} - Scale {scale}) that I saw in your showroom.'
                    className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-medium"
                  ></textarea>
                  <p className="font-mono-tech text-[9px] text-slate-500 mt-1">
                    {t('customizer_whatsapp_template_help')}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 font-heading">
                    {t('customizer_currency_code')}
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                      placeholder="USD, EUR, GBP, ARS, MXN"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] font-mono-tech font-bold uppercase focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA & BACKUPS */}
          {activeTab === 'data' && (
            <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
              <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 border-b-2 border-[#F0EBE1] pb-2 flex items-center space-x-1.5">
                <Database className="w-4 h-4" />
                <span>[ 04 // DATA BACKUPS & CATALOG MANAGEMENT ]</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Export Card */}
                <div className="p-4 bg-[#FAF9F6] rounded-[12px_3px_12px_3px] border-2 border-[#E2DDD5] space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase">
                      {t('customizer_backup_export_btn')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {t('customizer_backup_export_desc')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportCatalog}
                    className="btn-mechanical inline-flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-4 bg-[#FAF9F6] rounded-[12px_3px_12px_3px] border-2 border-[#E2DDD5] space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase">
                      {t('customizer_backup_import_btn')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {t('customizer_backup_import_desc')}
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileImportRef}
                      onChange={handleImportFile}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileImportRef.current?.click()}
                      className="btn-mechanical inline-flex items-center justify-center space-x-2 w-full py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-xs border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Select JSON File</span>
                    </button>
                  </div>
                </div>

                {/* Reset Demo */}
                <div className="p-4 bg-rose-50/50 rounded-[12px_3px_12px_3px] border-2 border-rose-200 space-y-2 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-heading font-black text-sm text-rose-900 uppercase">
                      {t('customizer_reset_demo_btn')}
                    </h4>
                    <p className="text-xs text-rose-700 font-medium">
                      {t('customizer_reset_demo_desc')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    className="btn-mechanical inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Catalog</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 bg-white p-5 rounded-[16px_4px_16px_4px] border-2 border-[#E2DDD5]">
              <h3 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-rose-600 border-b-2 border-[#F0EBE1] pb-2 flex items-center space-x-1.5">
                <Lock className="w-4 h-4" />
                <span>[ 05 // SECURITY & ADMIN PASSWORD ]</span>
              </h3>

              <div>
                <label className="block font-bold text-slate-800 mb-1 font-heading">
                  {t('customizer_security_pwd')}
                </label>
                <div className="relative max-w-md">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    placeholder="Leave blank to keep your current password"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] focus:outline-none focus:border-slate-900 font-bold"
                  />
                </div>
                <p className="font-mono-tech text-[9px] text-slate-500 mt-1">
                  {t('customizer_security_pwd_help')}
                </p>
              </div>
            </div>
          )}

        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-white border-t-2 border-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="btn-mechanical px-4 py-2 text-xs bg-[#F0ECE4] text-slate-800 border border-[#DDD5C9]"
          >
            {t('admin_btn_cancel')}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-mechanical flex items-center space-x-2 px-6 py-2.5 bg-rose-600 hover:bg-slate-900 text-white text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? t('form_saving') : t('customizer_btn_save')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
