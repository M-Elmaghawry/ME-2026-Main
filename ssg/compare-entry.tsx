// Diagnostic entry only. The production candidate never imports the old renderer.
import { StaticRouter } from 'react-router-dom/server';
import CandidateApp from './App';
import { createPageI18n } from '@/i18n/createPageI18n';
import { localeBase } from '@/lib/urls';
import { renderReadable } from './render-readable';
import type { Bootstrap } from './types';

export { render as renderPipeable } from './diagnostics/entry-pipeable';
export { pageMetadata, metadataHtml } from '@/lib/seo';
export async function renderWeb(boot: Bootstrap) {
  const i18n = await createPageI18n(boot.language);
  const basename = localeBase(boot.base, boot.language);
  return renderReadable(<StaticRouter basename={basename} location={`${basename}${boot.route.replace(/^\//, '')}`}>
    <CandidateApp boot={boot} i18n={i18n} />
  </StaticRouter>, boot.identifierPrefix);
}
