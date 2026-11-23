import type { Language } from './language';

export function normalizeSiteUrl(value: string): string {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) site URL without credentials, query or fragment.');
  }
  return url.href.endsWith('/') ? url.href : `${url.href}/`;
}

// Keep route IDs and case intact. Router destinations may also be relative.
export function trailingSlash(pathname: string): string {
  return pathname ? `${pathname.replace(/\/+$/, '')}/` : '/';
}

export function localizedSearch(search: string, language: Language): string {
  const params = new URLSearchParams(search);
  params.delete('lang');
  if (language === 'en') params.set('lang', 'en');
  const query = params.toString();
  return query ? `?${query}` : '';
}

// Canonicals deliberately omit unrelated query parameters and fragments.
// siteUrl includes the deployment base; route is relative to the application.
export function localizedUrl(siteUrl: string, route: string, language: Language): string {
  const base = normalizeSiteUrl(siteUrl);
  const pathname = route.split(/[?#]/, 1)[0] || '/';
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(pathname) || pathname.includes('\\')) {
    throw new Error('SEO routes must be application-relative paths.');
  }
  const url = new URL(trailingSlash(pathname).replace(/^\//, ''), base);
  if (!url.href.startsWith(base)) throw new Error('SEO route escapes the deployment base.');
  url.search = localizedSearch('', language);
  return url.href;
}
