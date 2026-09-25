import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, X, RotateCcw } from 'lucide-react';
import { DEFAULT_FRANCHISES, DEFAULT_BRANDS, getFranchiseLabel, SCALES } from './FilterBarData';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  setViewMode,
  totalResults
}) {
  const { t } = useTranslation();
  const { settings, activeTheme } = useAuth();

  const activeFranchises = Array.isArray(settings.franchises) && settings.franchises.length > 0
    ? settings.franchises
    : DEFAULT_FRANCHISES;

  const activeBrands = Array.isArray(settings.brands) && settings.brands.length > 0
    ? settings.brands
    : DEFAULT_BRANDS;

  const isFiltered = 
    Boolean(filters.search) || 
    (filters.franchise && filters.franchise !== 'all') || 
    (filters.brand && filters.brand !== 'all') || 
    (filters.scale && filters.scale !== 'all') || 
    (filters.status && filters.status !== 'all');

  return (
    <div className="bg-[#FAF9F6]/95 backdrop-blur-md border-y-2 border-[#E8E2D8] sticky top-20 z-30 shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        
        {/* Main Search & Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder={t('filter_search_placeholder')}
              className="w-full pl-10 pr-10 py-2.5 text-xs font-semibold bg-white border-2 border-[#E2DDD5] rounded-[10px_3px_10px_3px] focus:outline-none focus:border-slate-900 focus:shadow-[2px_2px_0px_rgba(15,23,42,1)] transition-all font-heading"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Secondary Select Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Brand Dropdown */}
            <select
              value={filters.brand || 'all'}
              onChange={(e) => onFilterChange('brand', e.target.value)}
              className="text-xs font-bold font-heading bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-900 shadow-sm cursor-pointer"
            >
              <option value="all">{t('filter_brand_all')}</option>
              {activeBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {/* Scale Dropdown */}
            <select
              value={filters.scale || 'all'}
              onChange={(e) => onFilterChange('scale', e.target.value)}
              className="text-xs font-bold font-heading bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-900 shadow-sm cursor-pointer"
            >
              <option value="all">{t('filter_scale_all')}</option>
              <option value="1/6">1/6 (~30 cm)</option>
              <option value="1/12">1/12 (~15 cm)</option>
              <option value="1/4">1/4 (~45 cm)</option>
              <option value="1/10">1/10</option>
              <option value="Estatua">Estatua / Diorama</option>
              <option value="Nendoroid">Nendoroid</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={filters.status || 'all'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="text-xs font-bold font-heading bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-900 shadow-sm cursor-pointer"
            >
              <option value="all">{t('filter_status_all')}</option>
              <option value="Disponible">{t('filter_status_available')}</option>
              <option value="En Exhibición">{t('filter_status_display')}</option>
              <option value="Reservado">{t('filter_status_reserved')}</option>
              <option value="Vendido">{t('filter_status_sold')}</option>
            </select>

            {/* Sort Order */}
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="text-xs font-bold font-heading bg-white border-2 border-[#E2DDD5] rounded-[8px_2px_8px_2px] px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-900 shadow-sm cursor-pointer"
            >
              <option value="newest">{t('filter_sort_featured')}</option>
              <option value="price-asc">{t('filter_sort_price_asc')}</option>
              <option value="price-desc">{t('filter_sort_price_desc')}</option>
              <option value="name-asc">{t('filter_sort_name_asc')}</option>
              <option value="name-desc">{t('filter_sort_name_desc')}</option>
            </select>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex items-center bg-[#EBE5DC] p-1 rounded-[8px_2px_8px_2px] border border-[#D5CCC0] ml-auto sm:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[6px_2px_6px_2px] transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('filter_view_grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-[6px_2px_6px_2px] transition-all ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('filter_view_list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Horizontal Category / Franchise Quick Bar & Counter */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto no-scrollbar gap-2">
          
          <div className="flex items-center space-x-2">
            <span className="font-mono-tech text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              {t('filter_universe_label')}
            </span>

            {/* All Pill */}
            <button
              onClick={() => onFilterChange('franchise', 'all')}
              className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
                (!filters.franchise || filters.franchise === 'all' || filters.franchise === 'Todos')
                  ? 'bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
              }`}
              style={(!filters.franchise || filters.franchise === 'all' || filters.franchise === 'Todos') ? { borderColor: '#0F172A', boxShadow: `2px 2px 0px ${activeTheme.primaryColor}` } : {}}
            >
              {t('franchise_all')}
            </button>

            {/* Dynamic Category / Franchise Pills */}
            {activeFranchises.map((item) => {
              const isActive = filters.franchise === item;
              return (
                <button
                  key={item}
                  onClick={() => onFilterChange('franchise', item)}
                  className={`btn-mechanical text-xs px-3.5 py-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-slate-700 border-2 border-[#E2DDD5] hover:border-slate-800'
                  }`}
                  style={isActive ? { borderColor: '#0F172A', boxShadow: `2px 2px 0px ${activeTheme.primaryColor}` } : {}}
                >
                  {getFranchiseLabel(item, t)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500 whitespace-nowrap pl-4 font-mono-tech font-bold">
            <span className="text-slate-800 bg-white px-2.5 py-1 rounded-[6px_2px_6px_2px] border border-[#E2DDD5]">
              [ {totalResults} {t('filter_pieces_count')} ]
            </span>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('filter_reset')}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
