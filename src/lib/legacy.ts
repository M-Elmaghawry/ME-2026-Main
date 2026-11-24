// Self-contained so the build can put this exact, tested function in <head>,
// before a legacy URL can paint or hydrate a document in the wrong language.
export function legacyDestination(href: string, base: string): string | null {
  const current = new URL(href);
  if (!current.pathname.startsWith(base)) return null;
  let target = new URL(current.href);
  const restored = target.searchParams.get('__spa');
  if (restored) {
    const proposed = new URL(restored, target.origin);
    if (!restored.startsWith(base) || proposed.origin !== target.origin || !proposed.pathname.startsWith(base) || /\\/.test(restored)) return null;
    target = proposed;
  }
  const requested = target.searchParams.get('lang');
  if (requested === 'ar' || requested === 'en') {
    let route = target.pathname.slice(base.length);
    if (route === 'en' || route.startsWith('en/')) route = route.replace(/^en\/?/, '');
    target.pathname = `${base}${requested === 'en' ? 'en/' : ''}${route}`;
    target.searchParams.delete('lang');
  }
  return target.href === current.href ? null : target.href;
}
