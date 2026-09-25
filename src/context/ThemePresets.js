export const THEME_PRESETS = [
  {
    id: 'crimson',
    name: 'Cyber Crimson (Red)',
    primaryColor: '#E11D48',
    primaryHover: '#BE123C',
    lightBg: 'bg-rose-50',
    lightBorder: 'border-rose-200',
    textPrimary: 'text-rose-600',
    btnBg: 'bg-rose-600',
    btnHover: 'hover:bg-rose-700',
    badgeBorder: 'border-rose-500',
    shadowColor: 'rgba(225,29,72,1)'
  },
  {
    id: 'cobalt',
    name: 'Cobalt Blue',
    primaryColor: '#2563EB',
    primaryHover: '#1D4ED8',
    lightBg: 'bg-blue-50',
    lightBorder: 'border-blue-200',
    textPrimary: 'text-blue-600',
    btnBg: 'bg-blue-600',
    btnHover: 'hover:bg-blue-700',
    badgeBorder: 'border-blue-500',
    shadowColor: 'rgba(37,99,235,1)'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    primaryColor: '#059669',
    primaryHover: '#047857',
    lightBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-200',
    textPrimary: 'text-emerald-600',
    btnBg: 'bg-emerald-600',
    btnHover: 'hover:bg-emerald-700',
    badgeBorder: 'border-emerald-500',
    shadowColor: 'rgba(5,150,105,1)'
  },
  {
    id: 'violet',
    name: 'Cyberpunk Violet',
    primaryColor: '#7C3AED',
    primaryHover: '#6D28D9',
    lightBg: 'bg-purple-50',
    lightBorder: 'border-purple-200',
    textPrimary: 'text-purple-600',
    btnBg: 'bg-purple-600',
    btnHover: 'hover:bg-purple-700',
    badgeBorder: 'border-purple-500',
    shadowColor: 'rgba(124,58,237,1)'
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    primaryColor: '#D97706',
    primaryHover: '#B45309',
    lightBg: 'bg-amber-50',
    lightBorder: 'border-amber-200',
    textPrimary: 'text-amber-600',
    btnBg: 'bg-amber-600',
    btnHover: 'hover:bg-amber-700',
    badgeBorder: 'border-amber-500',
    shadowColor: 'rgba(217,119,6,1)'
  },
  {
    id: 'titanium',
    name: 'Titanium Graphite',
    primaryColor: '#0F172A',
    primaryHover: '#1E293B',
    lightBg: 'bg-slate-100',
    lightBorder: 'border-slate-300',
    textPrimary: 'text-slate-900',
    btnBg: 'bg-slate-900',
    btnHover: 'hover:bg-slate-800',
    badgeBorder: 'border-slate-900',
    shadowColor: 'rgba(15,23,42,1)'
  }
];

export function getThemePreset(id) {
  return THEME_PRESETS.find(p => p.id === id) || THEME_PRESETS[0];
}
