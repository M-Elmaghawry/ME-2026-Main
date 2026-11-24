// Historical renderer retained only for the isolated regression comparison.
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import CandidateApp from '../App';
import { createPageI18n } from '@/i18n/createPageI18n';
import { localeBase } from '@/lib/urls';
import type { Bootstrap } from '../types';
export { indexablePages } from '@/lib/routePaths';
export { metadataHtml, pageMetadata, sitemapXml } from '@/lib/seo';
export { legacyDestination } from '@/lib/legacy';
export { localizedUrl, normalizeSiteUrl, validateBase } from '@/lib/urls';

export async function render(boot: Bootstrap): Promise<string> {
  const i18n = await createPageI18n(boot.language);
  const basename = localeBase(boot.base, boot.language);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let failure: Error | undefined;
    const finish = (error: unknown) => { clearTimeout(timeout); reject(error); };
    const destination = new Writable({ write(chunk, _encoding, done) { chunks.push(Buffer.from(chunk)); done(); } });
    destination.on('finish', () => { clearTimeout(timeout); if (failure) reject(failure); else resolve(Buffer.concat(chunks).toString('utf8')); });
    destination.on('error', finish);
    const stream = renderToPipeableStream(
      <StaticRouter basename={basename} location={`${basename}${boot.route.replace(/^\//, '')}`}>
        <CandidateApp boot={boot} i18n={i18n} />
      </StaticRouter>,
      {
        identifierPrefix: boot.identifierPrefix,
        onAllReady() { if (failure) finish(failure); else stream.pipe(destination); },
        onError(error) { failure = error instanceof Error ? error : new Error(String(error)); },
        onShellError: finish,
      },
    );
    const timeout = setTimeout(() => { stream.abort(); finish(new Error(`Incomplete SSR: ${boot.language}:${boot.route}`)); }, 15000);
  });
}
