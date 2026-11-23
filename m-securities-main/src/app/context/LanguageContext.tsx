'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, HTML_LANG, isLanguage, lookup, translations, type Dictionary, type Language, type TKey, type TPath, type TValue } from '../translations';

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** A text from the dictionaries: t('navbar.about'). Falls back to Mongolian, then to the key itself. */
  t: (key: TKey) => string;
  /** A list or group from the dictionaries, typed: get('about.team.list'). */
  get: <P extends TPath>(key: P) => TValue<P>;
  /** Copy kept next to its markup instead of the dictionaries: tr('Дэлгэрэнгүй', 'More', '更多'). */
  tr: <T>(mn: T, en: T, zh: T) => T;
}

const STORAGE_KEY = 'language';
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const text = (dict: Dictionary, key: string) => {
  const v = lookup(dict, key);
  return typeof v === 'string' && v ? v : undefined;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server and first client render use the default so the markup matches; a saved choice follows on mount
  const [language, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLanguage(saved)) setLang(saved);
    } catch { /* storage blocked: stay on the default */ }
  }, []);

  useEffect(() => { document.documentElement.lang = HTML_LANG[language]; }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* the choice just isn't remembered */ }
  }, []);

  const value = useMemo<LanguageContextType>(() => {
    const dict = translations[language];
    return {
      language,
      setLanguage,
      t: key => text(dict, key) ?? text(translations.mn, key) ?? key,
      get: key => (lookup(dict, key) ?? lookup(translations.mn, key)) as TValue<typeof key>,
      tr: (mn, en, zh) => (language === 'mn' ? mn : language === 'zh' ? zh : en),
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
