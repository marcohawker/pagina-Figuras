import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Box, Award, ChevronRight, Eye, Flame, Compass, Crosshair } from 'lucide-react';

export const FRANCHISES = [
  'Todos',
  'Marvel',
  'DC Comics',
  'Star Wars',
  'Anime / Manga',
  'Videojuegos',
  'Cine / TV',
  'Otros'
];

export default function HeroBanner({ 
  featuredFigures = [], 
  onSelectFigure, 
  onSelectFranchise 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredFigures.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredFigures.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [featuredFigures.length]);

  const currentFigure = featuredFigures[currentIndex] || featuredFigures[0];

  return (
    <div className="relative overflow-hidden bg-[#FAF9F6] border-b-2 border-[#E8E2D8] pt-10 pb-14">
      
      {/* Subtle Studio Glow background */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[100px] pointer-events-none -z-10 transform -translate-y-1/2"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & High-Impact Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top HUD Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-[8px_2px_8px_2px] bg-white text-slate-900 text-xs font-bold font-heading border-2 border-slate-900 shadow-[2px_2px_0px_rgba(225,29,72,1)]">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span className="uppercase tracking-wider font-mono-tech text-[11px]">ARCHIVE // 2026 EXHIBITION</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] uppercase">
              Showroom de <br />
              <span className="relative inline-block text-slate-900">
                <span className="relative z-10 text-rose-600 underline decoration-amber-400 decoration-wavy decoration-2">
                  Coleccionismo
                </span>
              </span> & Figuras
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              Inspecciona cada pieza como en una concesionaria de arte: fotografías hiperdetalladas desde todos los ángulos, especificaciones de escala, estado de caja verificado y accesorios incluidos.
            </p>

            {/* Quality Specs Pill Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              
              <div className="p-3 bg-white rounded-[14px_3px_14px_3px] border-2 border-[#E8E2D8] hover:border-slate-800 transition-colors shadow-sm">
                <div className="hud-tag text-rose-600 font-bold mb-1">01 // ORIGIN</div>
                <div className="font-heading text-xs font-extrabold text-slate-900">100% Auténticas</div>
                <div className="text-[11px] text-slate-500 font-medium">Marcas oficiales</div>
              </div>

              <div className="p-3 bg-white rounded-[14px_3px_14px_3px] border-2 border-[#E8E2D8] hover:border-slate-800 transition-colors shadow-sm">
                <div className="hud-tag text-blue-600 font-bold mb-1">02 // SCALE</div>
                <div className="font-heading text-xs font-extrabold text-slate-900">1/6, 1/12 y 1/4</div>
                <div className="text-[11px] text-slate-500 font-medium">Diecast & PVC</div>
              </div>

              <div className="p-3 bg-white rounded-[14px_3px_14px_3px] border-2 border-[#E8E2D8] hover:border-slate-800 transition-colors shadow-sm col-span-2 sm:col-span-1">
                <div className="hud-tag text-amber-600 font-bold mb-1">03 // INSPECT</div>
                <div className="font-heading text-xs font-extrabold text-slate-900">Ficha Técnica</div>
                <div className="text-[11px] text-slate-500 font-medium">Inspección de caja</div>
              </div>

            </div>

            {/* Franchise Quick Filter Strip */}
            <div className="pt-2">
              <span className="font-mono-tech text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                [ UNIVERSOS DESTACADOS ]
              </span>
              <div className="flex flex-wrap gap-2">
                {FRANCHISES.slice(1, 6).map((franchise) => (
                  <button
                    key={franchise}
                    onClick={() => onSelectFranchise(franchise)}
                    className="btn-mechanical text-xs px-3.5 py-1.5 bg-white text-slate-800 border-2 border-[#DCD3C7] hover:border-slate-900 hover:text-rose-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.06)]"
                  >
                    {franchise}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Featured Interactive Collector Spotlight Card */}
          <div className="lg:col-span-5">
            {currentFigure ? (
              <div className="relative group">
                
                {/* Mechanical Collector Showcase Plaque */}
                <div className="relative bg-white rounded-[24px_6px_24px_6px] border-2 border-slate-900 shadow-[6px_6px_0px_rgba(15,23,42,0.9)] overflow-hidden p-5 crosshair-pattern">
                  
                  {/* Spotlight Header Bar */}
                  <div className="flex items-center justify-between mb-3 border-b-2 border-[#F0EBE1] pb-3">
                    <span className="hud-tag px-2.5 py-1 bg-rose-600 text-white font-extrabold shadow-sm flex items-center space-x-1.5">
                      <Sparkles className="w-3 h-3 fill-white" />
                      <span>PIEZA DESTACADA</span>
                    </span>

                    <span className="font-mono-tech text-xs font-bold text-slate-700 bg-[#F0ECE4] px-2.5 py-1 rounded-[6px_2px_6px_2px] border border-[#DDD5C9]">
                      ESCALA {currentFigure.scale || '1/6'}
                    </span>
                  </div>

                  {/* Figure Studio Pedestal Viewport */}
                  <div 
                    onClick={() => onSelectFigure(currentFigure)}
                    className="relative w-full h-72 sm:h-80 rounded-[16px_4px_16px_4px] figure-pedestal cursor-pointer border-2 border-[#EFE9DF] group/img flex items-center justify-center p-4 overflow-hidden"
                  >
                    <img
                      src={currentFigure.images?.[currentFigure.primaryImageIndex || 0] || currentFigure.images?.[0]}
                      alt={currentFigure.name}
                      className="w-full h-full object-contain transform group-hover/img:scale-108 group-hover/img:-translate-y-1 transition-transform duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)] relative z-10"
                    />

                    {/* Quick Peek Badge */}
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-center p-4 z-20">
                      <span className="btn-mechanical inline-flex items-center space-x-2 text-xs text-white bg-rose-600 px-4 py-2 border border-white/40 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir Ficha & Galería</span>
                      </span>
                    </div>
                  </div>

                  {/* Figure Meta */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="hud-tag font-bold text-rose-600">
                        {currentFigure.brand} // {currentFigure.franchise}
                      </span>
                      {currentFigure.price > 0 && (
                        <span className="font-heading text-lg font-black text-slate-900">
                          ${currentFigure.price} <span className="text-xs font-mono-tech font-bold text-slate-500">{currentFigure.currency || 'USD'}</span>
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => onSelectFigure(currentFigure)}
                      className="font-heading text-lg font-black text-slate-900 line-clamp-1 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      {currentFigure.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                      {currentFigure.description}
                    </p>

                    <div className="pt-3 flex items-center justify-between border-t-2 border-[#F0EBE1]">
                      {/* Featured Indicators */}
                      <div className="flex space-x-1.5">
                        {featuredFigures.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 transition-all duration-300 rounded-[2px] ${
                              idx === currentIndex ? 'w-7 bg-slate-900' : 'w-2 bg-[#DCD3C7] hover:bg-slate-400'
                            }`}
                            aria-label={`Ver figura destacada ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => onSelectFigure(currentFigure)}
                        className="btn-mechanical inline-flex items-center space-x-1 text-xs px-3 py-1.5 bg-slate-900 hover:bg-rose-600 text-white transition-colors"
                      >
                        <span>Explorar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
