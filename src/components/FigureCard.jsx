import React, { useState } from 'react';
import { Sparkles, Eye, ShieldCheck, Box, Ruler, CheckCircle2, ChevronRight } from 'lucide-react';

export function StatusBadge({ status }) {
  switch (status) {
    case 'Disponible':
      return (
        <span className="hud-tag inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>DISPONIBLE</span>
        </span>
      );
    case 'Reservado':
      return (
        <span className="hud-tag inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 font-extrabold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>RESERVADO</span>
        </span>
      );
    case 'Vendido':
      return (
        <span className="hud-tag inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>VENDIDO</span>
        </span>
      );
    case 'En Exhibición':
    default:
      return (
        <span className="hud-tag inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-300 font-extrabold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>EXHIBICIÓN</span>
        </span>
      );
  }
}

export default function FigureCard({ figure, onSelect }) {
  const images = figure.images && figure.images.length > 0 
    ? figure.images 
    : ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'];
  
  const [activeImageIndex, setActiveImageIndex] = useState(figure.primaryImageIndex || 0);

  return (
    <div className="group bg-white rounded-[20px_6px_20px_6px] border-2 border-[#E5DFD7] hover:border-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_0px_rgba(15,23,42,0.9)] transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* 1. Dedicated Top Badge Bar (Never overlaps image) */}
      <div className="px-4 py-2.5 bg-[#FAF9F6] border-b-2 border-[#EFE9DF] flex items-center justify-between">
        <StatusBadge status={figure.status} />

        <div className="flex items-center space-x-1.5">
          {figure.featured && (
            <span className="inline-flex items-center p-1 rounded-[4px] bg-amber-400 text-slate-900 border border-slate-900" title="Figura Destacada">
              <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
            </span>
          )}
          <span className="hud-tag font-bold px-2 py-0.5 bg-slate-900 text-white border border-slate-900">
            {figure.scale || '1/6'}
          </span>
        </div>
      </div>

      {/* 2. Structured Image Pedestal Viewport */}
      <div 
        onClick={() => onSelect(figure)}
        className="relative w-full h-64 bg-gradient-to-b from-[#FAF9F6] via-[#F5EFEB] to-[#EBE4DA] p-4 flex items-center justify-center overflow-hidden border-b-2 border-[#EFE9DF] cursor-pointer group/img select-none"
      >
        {/* Figure Photo (Strictly contained, crisp presentation) */}
        <img
          src={images[activeImageIndex] || images[0]}
          alt={figure.name}
          className="max-h-full max-w-full object-contain transform group-hover/img:scale-105 group-hover/img:-translate-y-1 transition-transform duration-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.18)]"
          loading="lazy"
        />

        {/* Multi-angle Mini Thumbnails Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 bg-white/95 px-2.5 py-1 rounded-[6px_2px_6px_2px] border border-slate-300 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity z-10">
            {images.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`h-2 transition-all rounded-[1px] ${
                  idx === activeImageIndex ? 'w-4 bg-rose-600' : 'w-2 bg-[#D1C7BD] hover:bg-slate-700'
                }`}
                title={`Ver ángulo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="btn-mechanical inline-flex items-center space-x-2 text-xs text-white bg-slate-900 px-4 py-2 border border-white/40 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>Ver Ficha & Galería</span>
          </span>
        </div>
      </div>

      {/* 3. Body Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        
        <div>
          {/* Brand & Franchise line */}
          <div className="flex items-center justify-between text-xs font-bold font-mono-tech mb-1">
            <span className="text-rose-600 uppercase tracking-wider">{figure.brand || 'Coleccionable'}</span>
            <span className="text-slate-400 font-medium lowercase tracking-normal">[{figure.franchise}]</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(figure)}
            className="font-heading text-sm sm:text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1 uppercase leading-snug"
            title={figure.name}
          >
            {figure.name}
          </h3>

          {/* Character subtitle */}
          {figure.character && (
            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
              Personaje: <span className="text-slate-800 font-bold">{figure.character}</span>
            </p>
          )}

          {/* Specifications Pills */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t-2 border-[#F0EBE1] text-[11px] text-slate-600">
            {figure.height && (
              <div className="p-1.5 bg-[#FAF9F6] rounded-[6px_2px_6px_2px] border border-[#E8E2D8] flex items-center space-x-1.5">
                <Ruler className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate font-mono-tech font-bold text-[10px]">ALT: {figure.height}</span>
              </div>
            )}
            {figure.condition && (
              <div className="p-1.5 bg-[#FAF9F6] rounded-[6px_2px_6px_2px] border border-[#E8E2D8] flex items-center space-x-1.5">
                <Box className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate text-[10px] font-semibold">{figure.condition}</span>
              </div>
            )}
            {figure.accessories && figure.accessories.length > 0 && (
              <div className="p-1.5 bg-emerald-50/70 rounded-[6px_2px_6px_2px] border border-emerald-200 flex items-center space-x-1.5 col-span-2 text-emerald-800 font-bold font-mono-tech text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">INCLUYE {figure.accessories.length} ACCESORIOS VERIFICADOS</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Footer: Price & Action */}
        <div className="pt-3 border-t-2 border-[#F0EBE1] flex items-center justify-between">
          <div>
            <span className="font-mono-tech text-[9px] text-slate-400 uppercase font-bold tracking-widest block">
              {figure.status === 'En Exhibición' ? 'VALOR ESTIMADO' : 'PRECIO'}
            </span>
            {figure.price > 0 ? (
              <div className="font-heading text-lg font-black text-slate-900">
                ${figure.price} <span className="font-mono-tech text-xs font-bold text-slate-500">{figure.currency || 'USD'}</span>
              </div>
            ) : (
              <div className="font-heading text-xs font-bold text-slate-600 uppercase tracking-wide">Consultar</div>
            )}
          </div>

          <button
            onClick={() => onSelect(figure)}
            className="btn-mechanical inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs bg-slate-900 hover:bg-rose-600 text-white transition-colors"
          >
            <span>Detalles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
