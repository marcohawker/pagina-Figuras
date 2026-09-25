export const DEFAULT_FRANCHISES = [
  'Marvel',
  'DC Comics',
  'Star Wars',
  'Anime / Manga',
  'Videojuegos',
  'Cine / TV',
  'Otros'
];

export const DEFAULT_BRANDS = [
  'Hot Toys',
  'Bandai SH Figuarts',
  'NECA',
  'Kotobukiya',
  'Mezco Toyz',
  'Figma (Max Factory)',
  'Iron Studios',
  'Prime 1 Studio',
  'Hasbro Black Series',
  'McFarlane Toys',
  'Otros'
];

export const FRANCHISES = ['Todos', ...DEFAULT_FRANCHISES];
export const BRANDS = ['Todos', ...DEFAULT_BRANDS];

export const SCALES = [
  'Todos',
  '1/6 (aprox 30cm)',
  '1/12 (aprox 15cm)',
  '1/4 (aprox 45cm)',
  '1/10',
  'Estatua / Diorama',
  'Nendoroid / Chibi'
];

export const STATUSES = [
  { value: 'all', label: 'Todos los Estados' },
  { value: 'Disponible', label: '🟢 Disponibles para Compra' },
  { value: 'En Exhibición', label: '🔵 Solo en Exhibición' },
  { value: 'Reservado', label: '🟡 Reservados' },
  { value: 'Vendido', label: '⚪ Vendidos' }
];

export function getFranchiseLabel(name, t) {
  if (!name || name === 'all' || name === 'Todos') return t('franchise_all');
  const mapping = {
    'Marvel': 'franchise_marvel',
    'DC Comics': 'franchise_dc',
    'Star Wars': 'franchise_starwars',
    'Anime / Manga': 'franchise_anime',
    'Videojuegos': 'franchise_videogames',
    'Video Games': 'franchise_videogames',
    'Jeux Vidéo': 'franchise_videogames',
    'Cine / TV': 'franchise_movies',
    'Movies / TV': 'franchise_movies',
    'Cinéma / TV': 'franchise_movies',
    'Otros': 'franchise_others',
    'Others': 'franchise_others',
    'Autres': 'franchise_others'
  };
  const key = mapping[name];
  if (key && typeof t === 'function') {
    return t(key);
  }
  return name;
}
