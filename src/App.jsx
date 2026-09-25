import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import FigureCard from './components/FigureCard';
import FigureListView from './components/FigureListView';
import FigureDetailModal from './components/FigureDetailModal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import ShowroomCustomizer from './components/admin/ShowroomCustomizer';
import { useAuth } from './context/AuthContext';
import { useTranslation } from './i18n/LanguageContext';
import { api } from './services/api';
import { Sparkles, Store, ShieldCheck, Box, HelpCircle, Phone, ArrowUp, Zap, Award } from 'lucide-react';

export default function App() {
  const { isAuthenticated, settings, activeTheme } = useAuth();
  const { t } = useTranslation();

  const [currentView, setCurrentView] = useState('catalog');
  const [figures, setFigures] = useState([]);
  const [featuredFigures, setFeaturedFigures] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    franchise: 'all',
    brand: 'all',
    scale: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchFigures();
  }, [filters]);

  const fetchFigures = async () => {
    try {
      setIsLoading(true);
      const data = await api.getFigures(filters);
      setFigures(data);
      const featured = data.filter(f => f.featured);
      setFeaturedFigures(featured.length > 0 ? featured : data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching figures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      franchise: 'all',
      brand: 'all',
      scale: 'all',
      status: 'all',
      sortBy: 'newest'
    });
  };

  const handleSelectFranchiseFromHero = (franchise) => {
    handleFilterChange('franchise', franchise);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-rose-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
      />

      {/* Main View Switcher */}
      {currentView === 'admin' && isAuthenticated ? (
        <main className="flex-1">
          <AdminDashboard
            onSelectFigure={(fig) => setSelectedFigure(fig)}
            onCatalogUpdated={fetchFigures}
          />
        </main>
      ) : (
        <main className="flex-1 pb-16">
          
          {/* Hero Showcase Spotlight */}
          <HeroBanner
            featuredFigures={featuredFigures}
            onSelectFigure={(fig) => setSelectedFigure(fig)}
            onSelectFranchise={handleSelectFranchiseFromHero}
          />

          {/* Catalog Anchor & Filter Bar */}
          <div id="catalog-section">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalResults={figures.length}
            />
          </div>

          {/* Catalog Content Grid / List */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {isLoading ? (
              <div className="py-24 text-center space-y-3">
                <div 
                  className="w-10 h-10 border-4 border-slate-900 rounded-full animate-spin mx-auto"
                  style={{ borderTopColor: activeTheme.primaryColor }}
                ></div>
                <p className="font-mono-tech text-xs font-bold text-slate-500 tracking-wider">
                  [ {t('table_no_results')} ]
                </p>
              </div>
            ) : figures.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-7">
                  {figures.map((figure) => (
                    <FigureCard
                      key={figure.id}
                      figure={figure}
                      onSelect={(fig) => setSelectedFigure(fig)}
                    />
                  ))}
                </div>
              ) : (
                <FigureListView
                  figures={figures}
                  onSelect={(fig) => setSelectedFigure(fig)}
                />
              )
            ) : (
              <div className="py-20 text-center bg-white rounded-[24px_6px_24px_6px] border-2 border-slate-900 p-8 space-y-4 max-w-lg mx-auto shadow-[6px_6px_0px_rgba(15,23,42,0.9)] crosshair-pattern">
                <div className="w-16 h-16 rounded-[14px_4px_14px_4px] bg-slate-900 text-white flex items-center justify-center mx-auto border-2 border-slate-900" style={{ boxShadow: `3px 3px 0px ${activeTheme.primaryColor}` }}>
                  <Box className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-black text-slate-900 uppercase">
                    {t('table_no_results')}
                  </h3>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="btn-mechanical px-4 py-2 bg-slate-900 text-white text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  {t('filter_reset')}
                </button>
              </div>
            )}
          </div>

        </main>
      )}

      {/* Bespoke Collector Footer */}
      <footer className="bg-white border-t-2 border-[#E8E2D8] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-[8px_2px_8px_2px] bg-slate-900 border border-slate-900 flex items-center justify-center text-white" style={{ boxShadow: `2px 2px 0px ${activeTheme.primaryColor}` }}>
                  <Zap className="w-4 h-4" style={{ fill: activeTheme.primaryColor, color: activeTheme.primaryColor }} />
                </div>
                <span className="font-heading text-lg font-black text-slate-900 uppercase tracking-tight">
                  {settings.showroomName || 'ACTION VAULT'}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium">
                {settings.footerText || t('footer_desc')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold font-heading text-slate-700">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('footer_guarantee')}</span>
              </span>
              <span className="hidden sm:inline text-slate-300 font-mono-tech">•</span>
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{t('footer_inspection')}</span>
              </span>
            </div>

            <div className="flex items-center justify-start md:justify-end space-x-3 text-xs">
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-mechanical inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white text-slate-900 border-2 border-emerald-500 hover:bg-emerald-50 transition-colors shadow-[2px_2px_0px_rgba(16,185,129,0.4)]"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('footer_whatsapp')}</span>
                </a>
              )}

              <button
                onClick={scrollToTop}
                className="btn-mechanical p-2 bg-[#F0ECE4] text-slate-800 hover:bg-slate-900 hover:text-white border border-[#DDD5C9] transition-colors"
                title={t('footer_top')}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t-2 border-[#F0EBE1] text-center font-mono-tech text-[10px] text-slate-400 font-bold">
            {t('footer_rights', { year: new Date().getFullYear().toString() })}
          </div>
        </div>
      </footer>

      {/* Figure Detail Modal */}
      {selectedFigure && (
        <FigureDetailModal
          figure={selectedFigure}
          onClose={() => setSelectedFigure(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setCurrentView('admin');
        }}
      />

      {/* Showroom Customizer Modal */}
      <ShowroomCustomizer
        isOpen={isCustomizerModalOpen}
        onClose={() => setIsCustomizerModalOpen(false)}
        onSaved={fetchFigures}
      />

    </div>
  );
}
