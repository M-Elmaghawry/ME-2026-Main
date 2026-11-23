import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import PrototypeApp from './App';
import { createPageI18n } from './i18n';
import { pages, localeBase, metadata, headHtml, type Bootstrap } from './routes';

export { pages, metadata, headHtml };

export async function render(boot: Bootstrap): Promise<string> {
  const instance = await createPageI18n(boot.language);
  const basename = localeBase(boot.base, boot.language);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let failed: Error | undefined;
    const destination = new Writable({ write(chunk, _encoding, done) { chunks.push(Buffer.from(chunk)); done(); } });
    destination.on('finish', () => { clearTimeout(timeout); if (failed) reject(failed); else resolve(Buffer.concat(chunks).toString('utf8')); });
    destination.on('error', reject);
    const stream = renderToPipeableStream(
      <StaticRouter basename={basename} location={`${basename}${boot.route.replace(/^\//, '')}`}><PrototypeApp boot={boot} i18n={instance} /></StaticRouter>,
      {
        identifierPrefix: boot.identifierPrefix,
        onAllReady() { if (failed) { clearTimeout(timeout); reject(failed); } else stream.pipe(destination); },
        onError(error) { failed = error instanceof Error ? error : new Error(String(error)); },
        onShellError(error) { clearTimeout(timeout); reject(error); },
      },
    );
    const timeout = setTimeout(() => { failed = new Error(`SSR timeout: ${boot.route} (${boot.language})`); stream.abort(); reject(failed); }, 15000);
  });
}
