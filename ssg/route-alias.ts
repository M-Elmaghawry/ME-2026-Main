import { indexablePages } from '@/lib/routePaths';
import { routeRegistry } from '@/lib/routes';
import { validateBase } from '@/lib/urls';

// Match the generator's directory documents, including nonindexable results.
// The shared 404.html is a file, not a /404/index.html route.
const directoryRoutes = new Set([
  ...indexablePages.map(page => page.path),
  ...routeRegistry.filter(route => !route.indexable && route.path !== '*').map(route => route.path),
].map(route => route === '/' ? '/' : `${route}/`));

export function staticAliasPathname(pathname: string, base: string): string | null {
  const root = validateBase(base);
  if (!pathname.startsWith(root) || !pathname.endsWith('/index.html')) return null;
  const canonical = pathname.slice(0, -'index.html'.length);
  const relative = canonical.slice(root.length).replace(/^en\//, '');
  return directoryRoutes.has(`/${relative}`) ? canonical : null;
}

export function installStaticRouteAliases(base: string, browser = window) {
  const normalize = () => {
    const { pathname, search, hash } = browser.location;
    const canonical = staticAliasPathname(pathname, base);
    if (canonical) browser.history.replaceState(browser.history.state, '', canonical + search + hash);
  };
  // Run before BrowserRouter reads location, including history traversal/BFCache.
  normalize();
  const options = { capture: true };
  browser.addEventListener('popstate', normalize, options);
  browser.addEventListener('pageshow', normalize, options);
  return () => {
    browser.removeEventListener('popstate', normalize, options);
    browser.removeEventListener('pageshow', normalize, options);
  };
}
