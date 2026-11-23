import { createContext, useContext } from 'react';
import type { Language } from '@/lib/language';

export const LanguageContext = createContext<{
  language: Language;
  direction: 'rtl' | 'ltr';
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
} | null>(null);

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('Missing experimental language provider');
  return value;
}
