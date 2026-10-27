export type Language = 'ar' | 'en';
export const LANGUAGE_STORAGE_KEY = 'elmekawy-language';

export function isLanguage(value: unknown): value is Language {
  return value === 'ar' || value === 'en';
}

export function preferredLanguage(search: string, storage?: Pick<Storage, 'getItem'>): Language {
  const requested = new URLSearchParams(search).get('lang');
  if (isLanguage(requested)) return requested;
  try {
    const saved = storage?.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch { /* Storage can be disabled by the browser. */ }
  return 'en';
}

