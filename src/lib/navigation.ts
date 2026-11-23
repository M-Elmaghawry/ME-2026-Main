import { parsePath, type Path, type To } from 'react-router-dom';
import { isLanguage, preferredLanguage, type Language } from './language';
import { localizedSearch, trailingSlash } from './urls';

const externalUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function localizedDestination(to: To, current: Path, language?: Language): To {
  if (typeof to === 'string' && externalUrl.test(to)) return to;
  const target = typeof to === 'string' ? parsePath(to) : to;
  // An in-page fragment retains the current query; a new page does not inherit it.
  const search = target.search ?? (!target.pathname ? current.search : '');
  const requested = new URLSearchParams(search).get('lang');
  const activeLanguage = language ?? (isLanguage(requested) ? requested : preferredLanguage(current.search));
  return {
    ...target,
    pathname: trailingSlash(target.pathname || current.pathname),
    search: localizedSearch(search, activeLanguage),
  };
}
