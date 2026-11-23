import { createInstance } from 'i18next';
import { resources } from 'virtual:poc-resources';
import type { Language } from '@/lib/language';

export async function createPageI18n(language: Language) {
  const instance = createInstance();
  await instance.init({ resources, lng: language, fallbackLng: 'ar', showSupportNotice: false, interpolation: { escapeValue: false } });
  return instance;
}
