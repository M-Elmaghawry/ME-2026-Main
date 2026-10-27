import { preferredLanguage, type Language } from './language';

export function browserLanguage(): Language {
  try {
    return preferredLanguage(window.location.search, window.localStorage);
  } catch {
    return preferredLanguage(window.location.search);
  }
}
