import type { Language } from './language';
import { localeBase, validateBase } from './urls';

// A path-mode router belongs to one SSR document/locale. A history entry created
// with pushState before reload can later be traversed within the other document.
// Reconcile before BrowserRouter sees popstate; preserve the entry and its state.
export function installLocaleHistory(base: string, language: Language, browser = window) {
  const root = validateBase(base);
  const english = localeBase(root, 'en');
  const reconcile = (event: Event) => {
    const pathname = browser.location.pathname;
    if (!pathname.startsWith(root)) return;
    const destination = pathname === english.slice(0, -1) || pathname.startsWith(english) ? 'en' : 'ar';
    if (destination === language) return;
    event.stopImmediatePropagation();
    browser.location.reload();
  };
  const options = { capture: true };
  browser.addEventListener('popstate', reconcile, options);
  browser.addEventListener('pageshow', reconcile, options);
  return () => {
    browser.removeEventListener('popstate', reconcile, options);
    browser.removeEventListener('pageshow', reconcile, options);
  };
}
