import { createContext, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { preferredLanguage, type Language } from '@/lib/language';
import { localizedDestination } from '@/lib/navigation';
import { useRouting } from './RoutingContext';
import { localeBase, localizedSearch, trailingSlash } from '@/lib/urls';

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
  const routing = useRouting();
  const activeLanguage = routing.language ?? preferredLanguage(location.search);
  const direction = activeLanguage === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // SSR initializes the candidate's i18n before hydration. Emitting another
    // languageChanged event here can update a still-hydrating lazy boundary.
    if (routing.mode !== 'path' || i18n.language !== activeLanguage) void i18n.changeLanguage(activeLanguage);
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = direction;
  }, [activeLanguage, direction, i18n, routing.mode]);

  const setLanguage = useCallback((lang: Language) => {
    if (routing.mode === 'path') {
      const target = `${localeBase(routing.base, lang)}${trailingSlash(location.pathname).replace(/^\//, '')}${localizedSearch(location.search, 'ar')}${location.hash}`;
      if (location.state != null) {
        // Fetch the counterpart SSR document while preserving the same history
        // state as the legacy language switch. Never put drafts in the URL or storage.
        const previous = window.history.state;
        window.history.pushState({ ...previous, usr: location.state, key: Math.random().toString(36).slice(2, 10), idx: (previous?.idx ?? 0) + 1 }, '', target);
        window.location.reload();
      } else window.location.assign(target);
      return;
    }
    navigate(localizedDestination(location, location, lang), { state: location.state });
  }, [location, navigate, routing]);

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
