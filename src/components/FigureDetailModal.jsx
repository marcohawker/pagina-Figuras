import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Phone, 
  Share2, 
  CheckCircle, 
  ShieldCheck, 
  Box, 
  Ruler, 
  Calendar, 
  Layers, 
  Tag, 
  Check, 
  Copy,
  Info,
  Award
} from 'lucide-react';
import { StatusBadge } from './FigureCard';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';

export default function FigureDetailModal({ figure, onClose }) {
  const { settings, activeTheme } = useAuth();
  const { t } = useTranslation();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(figure.primaryImageIndex || 0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = figure.images && figure.images.length > 0 
    ? figure.images 
    : ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=85'];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else onClose();
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, images.length, onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappUrl = () => {
    if (!settings.whatsappNumber) return '#';
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    
    // Use custom template if available or standard localized fallback
    const rawTemplate = settings.whatsappTemplate || 'Hello! I am interested in "{name}" ({brand} - Scale {scale}) that I saw in your showroom.';
    const message = rawTemplate
      .replace(/\{name\}/g, figure.name)
      .replace(/\{brand\}/g, figure.brand || 'Collector')
      .replace(/\{scale\}/g, figure.scale || '1/6');

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#FAF9F6] rounded-[28px_8px_28px_8px] shadow-[10px_10px_0px_rgba(15,23,42,0.9)] border-2 border-slate-900 overflow-hidden my-auto max-h-[92vh] flex flex-col crosshair-pattern">
        
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-900 bg-white sticky top-0 z-20">
          <div className="flex items-center space-x-2.5">
            <span className="hud-tag px-3 py-1 bg-slate-900 text-white font-extrabold">
              {figure.franchise}
            </span>
            <span className="text-slate-400 font-mono-tech">•</span>
            <span className="font-heading text-xs font-black uppercase text-slate-800 tracking-wider">
              {figure.brand}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-[6px_2px_6px_2px] text-slate-600 hover:text-slate-900 hover:bg-[#F0ECE4] border border-[#DDD5C9] transition-colors"
              title="Share / Copy Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-[6px_2px_6px_2px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1 bg-[#FAF9F6]">
          
          {/* Main Grid: Multi-Angle Gallery & Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Gallery & Angle Switcher */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Primary Large Image Viewport */}
              <div className="relative w-full h-80 sm:h-[420px] rounded-[20px_6px_20px_6px] bg-gradient-to-b from-[#FAF9F6] via-[#F5EFEB] to-[#EBE4DA] border-2 border-slate-900 p-6 flex items-center justify-center overflow-hidden group shadow-md">
                
                {/* Status Badge in gallery */}
                <div className="absolute top-4 left-4 z-10">
                  <StatusBadge status={figure.status} />
                </div>

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-[6px_2px_6px_2px] bg-white text-slate-800 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all opacity-0 group-hover:opacity-100"
                  title="Fullscreen Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Main Image */}
                <img
                  src={images[selectedPhotoIndex] || images[0]}
                  alt={`${figure.name} - View ${selectedPhotoIndex + 1}`}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)] transition-all duration-300 transform group-hover:scale-105 cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                />

                {/* Prev / Next Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-[8px_2px_8px_2px] bg-white/95 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-90 hover:opacity-100 transition-all z-20"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIndex((prev) => (prev + 1) % images.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-[8px_2px_8px_2px] bg-white/95 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-90 hover:opacity-100 transition-all z-20"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Angle counter pill */}
                <div className="absolute bottom-3 right-4 px-3 py-1 rounded-[6px_2px_6px_2px] bg-slate-900 text-white font-mono-tech text-[10px] font-bold shadow-md z-20">
                  {t('modal_photo_counter')} {selectedPhotoIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-20 h-20 rounded-[10px_3px_10px_3px] overflow-hidden flex-shrink-0 bg-gradient-to-b from-[#FAF9F6] to-[#EBE4DA] border-2 p-1 transition-all ${
                        idx === selectedPhotoIndex
                          ? 'border-slate-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-105'
                          : 'border-[#DCD3C7] hover:border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain mx-auto" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality Guarantee Callout */}
              <div className="p-4 rounded-[14px_4px_14px_4px] bg-white border-2 border-[#E2DDD5] flex items-start space-x-3 shadow-sm">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 space-y-0.5">
                  <span className="font-heading font-extrabold text-slate-900 block uppercase">
                    {t('modal_certified_inspection')}
                  </span>
                  <span>{t('modal_certified_desc')}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Title, Pricing, Specs & Contact */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Figure Title & Line */}
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono-tech font-bold uppercase tracking-wider mb-1" style={{ color: activeTheme.primaryColor }}>
                  <span>{figure.line || t('modal_official_edition')}</span>
                  {figure.featured && (
                    <span className="hud-tag px-2 py-0.5 bg-amber-400 text-slate-900 border border-slate-900 font-extrabold">
                      {t('modal_featured_star')}
                    </span>
                  )}
                </div>

                <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug uppercase">
                  {figure.name}
                </h1>

                {figure.character && (
                  <p className="text-sm font-bold text-slate-600 mt-1 font-heading">
                    {t('modal_character_label')} <span className="text-slate-900 font-black">{figure.character}</span>
                  </p>
                )}
              </div>

              {/* Price & Status Card */}
              <div className="p-5 rounded-[18px_4px_18px_4px] bg-white border-2 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {figure.status === 'En Exhibición' ? t('modal_collection_val') : t('modal_sale_price')}
                    </span>
                    {figure.price > 0 ? (
                      <div className="font-heading text-3xl font-black text-slate-900">
                        ${figure.price} <span className="font-mono-tech text-sm font-bold text-slate-500">{figure.currency || settings.currency || 'USD'}</span>
                      </div>
                    ) : (
                      <div className="font-heading text-xl font-black text-slate-800 uppercase">{t('modal_inquire_availability')}</div>
                    )}
                  </div>
                  <StatusBadge status={figure.status} />
                </div>

                {/* Direct WhatsApp Action Button */}
                {settings.whatsappNumber && (
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-mechanical w-full flex items-center justify-center space-x-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] border-2 border-slate-900 transition-all hover:scale-[1.01]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('modal_whatsapp_btn')}</span>
                  </a>
                )}
              </div>

              {/* Ficha Técnica de Concesionaria (Showroom Technical Specifications) */}
              <div className="space-y-3">
                <h3 className="font-mono-tech text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-slate-900" />
                  <span>{t('modal_specs_title')}</span>
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  
                  <div className="p-3 bg-white rounded-[10px_3px_10px_3px] border-2 border-[#E2DDD5]">
                    <span className="font-mono-tech text-slate-400 block text-[9px] uppercase font-bold">{t('modal_spec_manufacturer')}</span>
                    <span className="font-heading font-extrabold text-slate-900">{figure.brand || 'N/A'}</span>
                  </div>

                  <div className="p-3 bg-white rounded-[10px_3px_10px_3px] border-2 border-[#E2DDD5]">
                    <span className="font-mono-tech text-slate-400 block text-[9px] uppercase font-bold">{t('modal_spec_scale')}</span>
                    <span className="font-heading font-extrabold text-slate-900">{figure.scale || '1/6'}</span>
                  </div>

                  <div className="p-3 bg-white rounded-[10px_3px_10px_3px] border-2 border-[#E2DDD5]">
                    <span className="font-mono-tech text-slate-400 block text-[9px] uppercase font-bold">{t('modal_spec_height')}</span>
                    <span className="font-heading font-extrabold text-slate-900">{figure.height || 'N/A'}</span>
                  </div>

                  <div className="p-3 bg-white rounded-[10px_3px_10px_3px] border-2 border-[#E2DDD5]">
                    <span className="font-mono-tech text-slate-400 block text-[9px] uppercase font-bold">{t('modal_spec_year')}</span>
                    <span className="font-heading font-extrabold text-slate-900">{figure.year || '2023'}</span>
                  </div>

                  <div className="p-3 bg-white rounded-[10px_3px_10px_3px] border-2 border-[#E2DDD5]">
                    <span className="font-mono-tech text-slate-400 block text-[9px] uppercase font-bold">{t('modal_spec_material')}</span>
                    <span className="font-heading font-extrabold text-slate-900 truncate block" title={figure.material}>{figure.material || 'PVC / ABS'}</span>
                  </div>

                  <div className="p-3 bg-white rounded-[10px_3px_10px_3px] border-2 border-[#E2DDD5]">
                    <span className="font-mono-tech text-slate-400 block text-[9px] uppercase font-bold">{t('modal_spec_condition')}</span>
                    <span className="font-heading font-extrabold text-slate-900 truncate block" title={figure.condition}>{figure.condition || 'MIB'}</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Bottom Section: Description & Accessories Included */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t-2 border-[#E2DDD5]">
            
            {/* Description Column */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900">
                {t('modal_description_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium bg-white p-5 rounded-[14px_4px_14px_4px] border-2 border-[#E2DDD5]">
                {figure.description || t('modal_no_description')}
              </p>
            </div>

            {/* Included Accessories Column */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                <span>{t('modal_accessories_title')}</span>
                {figure.accessories && figure.accessories.length > 0 && (
                  <span className="hud-tag px-2 py-0.5 bg-slate-900 text-white font-extrabold">
                    {figure.accessories.length}
                  </span>
                )}
              </h3>

              {figure.accessories && figure.accessories.length > 0 ? (
                <ul className="space-y-2">
                  {figure.accessories.map((acc, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-800 bg-white p-2.5 rounded-[8px_2px_8px_2px] border-2 border-[#E2DDD5] font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic bg-white p-3 rounded-[8px_2px_8px_2px] border border-[#E2DDD5]">
                  {t('modal_no_accessories')}
                </p>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t-2 border-slate-900 flex items-center justify-between">
          <span className="font-mono-tech text-xs text-slate-500 font-bold">
            {t('modal_serial_label')} <span className="text-slate-900">{figure.id}</span>
          </span>

          <button
            onClick={onClose}
            className="btn-mechanical px-5 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-white"
          >
            {t('modal_close_btn')}
          </button>
        </div>

      </div>

      {/* Fullscreen Lightbox Viewport */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-60 bg-slate-950/95 flex items-center justify-center p-4 animate-fadeIn cursor-zoom-out"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-[8px_2px_8px_2px] bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedPhotoIndex] || images[0]}
            alt={figure.name}
            className="max-w-full max-h-[90vh] object-contain drop-shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}
