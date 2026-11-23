import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { Language } from '@/lib/language';
import { localizedSearch, trailingSlash } from '@/lib/urls';
import { localeBase } from './routes';
import { LanguageContext } from './language';

export function LanguageProvider({ language, base, children }: { language: Language; base: string; children: ReactNode }) {
  const location = useLocation();
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);
  const setLanguage = (next: Language) => {
    // A deliberate document navigation fetches the correct SSR document.
    // The deployment base remains independent of the locale prefix.
    const target = `${localeBase(base, next)}${trailingSlash(location.pathname).replace(/^\//, '')}${localizedSearch(location.search, 'ar')}${location.hash}`;
    window.location.assign(target);
  };
  return <LanguageContext.Provider value={{ language, direction, setLanguage, toggleLanguage: () => setLanguage(language === 'ar' ? 'en' : 'ar') }}>{children}</LanguageContext.Provider>;
}
