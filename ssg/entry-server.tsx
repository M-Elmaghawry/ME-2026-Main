import { StaticRouter } from 'react-router-dom/server';
import CandidateApp from './App';
import { createPageI18n } from '@/i18n/createPageI18n';
import { localeBase } from '@/lib/urls';
import { renderReadable } from './render-readable';
import type { Bootstrap } from './types';
export { indexablePages } from '@/lib/routePaths';
export { metadataHtml, pageMetadata, sitemapXml } from '@/lib/seo';
export { legacyDestination } from '@/lib/legacy';
export { localizedUrl, normalizeSiteUrl, validateBase } from '@/lib/urls';

export async function render(boot: Bootstrap): Promise<string> {
  const i18n = await createPageI18n(boot.language);
  const basename = localeBase(boot.base, boot.language);
  return renderReadable(
    <StaticRouter basename={basename} location={basename + boot.route.replace(/^\//, '')}>
      <CandidateApp boot={boot} i18n={i18n} />
    </StaticRouter>, boot.identifierPrefix,
  );
}
