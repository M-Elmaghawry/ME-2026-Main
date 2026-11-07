import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLanguage, LANGUAGE_STORAGE_KEY, type Language } from '@/lib/language';
import { browserLanguage } from '@/lib/browserLanguage';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguageState] = useState<Language>(browserLanguage);
  const requested = new URLSearchParams(location.search).get('lang');
  const activeLanguage = isLanguage(requested) ? requested : language;
  const direction = activeLanguage === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    setLanguageState(activeLanguage);
    void i18n.changeLanguage(activeLanguage);
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = direction;
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage); } catch { /* optional persistence */ }
  }, [activeLanguage, direction, i18n]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    const search = new URLSearchParams(location.search);
    search.set('lang', lang);
    navigate({ pathname: location.pathname, search: `?${search}`, hash: location.hash }, { replace: true, state: location.state });
  }, [location.pathname, location.search, location.hash, location.state, navigate]);

  return (
    <LanguageContext.Provider value={{
      language: activeLanguage, direction, setLanguage,
      toggleLanguage: () => setLanguage(activeLanguage === 'ar' ? 'en' : 'ar'),
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
