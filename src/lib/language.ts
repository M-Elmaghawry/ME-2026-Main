export type Language = 'ar' | 'en';

export function isLanguage(value: unknown): value is Language {
  return value === 'ar' || value === 'en';
}

export function preferredLanguage(search: string): Language {
  const requested = new URLSearchParams(search).get('lang');
  if (isLanguage(requested)) return requested;
  return 'ar';
}

