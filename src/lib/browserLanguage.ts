import { preferredLanguage, type Language } from './language';

export function browserLanguage(): Language {
  return preferredLanguage(typeof window === 'undefined' ? '' : window.location.search);
}
