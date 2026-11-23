import { createContext, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { preferredLanguage, type Language } from '@/lib/language';
import { localizedDestination } from '@/lib/navigation';

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
  const activeLanguage = preferredLanguage(location.search);
  const direction = activeLanguage === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    void i18n.changeLanguage(activeLanguage);
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = direction;
  }, [activeLanguage, direction, i18n]);

  const setLanguage = useCallback((lang: Language) => {
    navigate(localizedDestination(location, location, lang), { state: location.state });
  }, [location, navigate]);

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
