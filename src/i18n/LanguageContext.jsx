import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' }
];

export function LanguageProvider({ children }) {
  // Default to English ('en') as requested
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('actionvault_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem('actionvault_lang', langCode);
    }
  };

  const t = (key, params = {}) => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key] || translations['en'][key] || key;

    // Interpolate dynamic variables e.g. {name}, {year}
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramVal);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      languages: AVAILABLE_LANGUAGES,
      currentLanguageMeta: AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0]
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
