import React from 'react';
import { Eye, Ruler, Box, Sparkles, ChevronRight } from 'lucide-react';
import { StatusBadge } from './FigureCard';

export default function FigureListView({ figures, onSelect }) {
  if (figures.length === 0) return null;

  return (
    <div className="bg-white rounded-[20px_6px_20px_6px] border-2 border-slate-900 shadow-[6px_6px_0px_rgba(15,23,42,0.9)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b-2 border-slate-900 text-[10px] font-mono-tech font-extrabold uppercase tracking-widest text-slate-600">
              <th className="py-4 px-4">FIGURA / MODELO</th>
              <th className="py-4 px-4">UNIVERSO</th>
              <th className="py-4 px-4">FABRICANTE & ESCALA</th>
              <th className="py-4 px-4">CONDICIÓN</th>
              <th className="py-4 px-4">ESTADO</th>
              <th className="py-4 px-4">PRECIO</th>
              <th className="py-4 px-4 text-right">ACCIÓN</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#F0EBE1] text-xs">
            {figures.map((figure) => {
              const mainImg = figure.images?.[figure.primaryImageIndex || 0] || figure.images?.[0];
              return (
                <tr 
                  key={figure.id}
                  onClick={() => onSelect(figure)}
                  className="hover:bg-rose-50/40 cursor-pointer transition-colors group"
                >
                  {/* Media & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-[8px_2px_8px_2px] figure-pedestal border-2 border-[#E2DDD5] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={mainImg} 
                          alt={figure.name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          {figure.featured && (
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          )}
                          <span className="font-heading font-black text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 uppercase">
                            {figure.name}
                          </span>
                        </div>
                        {figure.character && (
                          <span className="font-mono-tech text-[11px] text-slate-500 font-bold">
                            // {figure.character}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Franchise */}
                  <td className="py-3.5 px-4">
                    <span className="hud-tag px-2.5 py-1 bg-[#FAF9F6] text-slate-800 border border-[#DDD5C9] font-bold">
                      {figure.franchise}
                    </span>
                  </td>

                  {/* Brand & Scale */}
                  <td className="py-3.5 px-4">
                    <div className="font-heading font-black text-slate-900">{figure.brand}</div>
                    <div className="font-mono-tech text-[10px] text-slate-500 font-bold">ESCALA {figure.scale} • {figure.height || 'N/A'}</div>
                  </td>

                  {/* Condition */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    <span className="inline-flex items-center space-x-1">
                      <Box className="w-3.5 h-3.5 text-slate-400" />
                      <span>{figure.condition || 'En Caja'}</span>
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={figure.status} />
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-heading font-black text-slate-900 whitespace-nowrap text-sm">
                    {figure.price > 0 ? (
                      <span>${figure.price} <span className="font-mono-tech text-xs font-bold text-slate-500">{figure.currency || 'USD'}</span></span>
                    ) : (
                      <span className="font-mono-tech text-xs font-bold text-slate-500 uppercase">Consultar</span>
                    )}
                  </td>

                  {/* CTA Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(figure);
                      }}
                      className="btn-mechanical inline-flex items-center space-x-1 px-3 py-1.5 text-xs bg-slate-900 hover:bg-rose-600 text-white transition-all"
                    >
                      <span>Ver</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
