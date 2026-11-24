import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { build } from 'vite';
import { prepareImages } from './optimize-images.mjs';
import { validateHtml, validateSitemap } from './ssg-html.mjs';
import { validateUtf8 } from './ssg-integrity.mjs';

const { values } = parseArgs({ options: { base: { type: 'string', default: '/ME-2026-Main/' }, 'site-url': { type: 'string' }, variant: { type: 'string', default: 'repo' }, config: { type: 'string', default: 'ssg/vite.config.ts' } } });
assert.match(values.variant, /^[a-z0-9-]+$/);
const output = path.resolve('dist-ssr/candidate', values.variant);
assert.equal(path.dirname(output), path.resolve('dist-ssr/candidate'));
const base = values.base;
process.env.SSG_BASE_PATH = base;
assert.ok(['ssg/vite.config.ts', 'ssg/diagnostics/vite.contact.config.ts'].includes(values.config));
if (values.config.includes('diagnostics')) assert.equal(values.variant, 'contact-fixture', 'Mock integration builds must stay separate');
const configFile = path.resolve(values.config);
await prepareImages();
await build({ configFile, logLevel: 'warn', build: { outDir: path.join(output, 'site') } });
await build({ configFile, publicDir: false, logLevel: 'warn', build: {
  outDir: path.join(output, 'server'), manifest: false, ssr: path.resolve('ssg/entry-server.tsx'),
  rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
} });
const api = await import(pathToFileURL(path.join(output, 'server/entry-server.mjs')).href);
assert.equal(api.validateBase(base), base, 'base must include its final slash');
const siteUrl = api.normalizeSiteUrl(values['site-url'] || new URL(base, 'https://m-elmaghawry.github.io/').href);
assert.equal(new URL(siteUrl).pathname, base, 'canonical base must match asset and router base');
assert.equal(api.indexablePages.length, 26);
assert.equal(new Set(api.indexablePages.map(page => page.path)).size, 26);
const renderedAt = Date.now();
const snapshot = { renderedAt, year: new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'Asia/Riyadh' }).format(renderedAt), dates: Object.fromEntries(['ar', 'en'].map(language => [language, new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Riyadh' }).format(renderedAt)])) };
const template = await readFile(path.join(output, 'site/index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(output, 'site/.vite/manifest.json'), 'utf8'));
const fontSources = JSON.parse(await readFile('src/assets/fonts/sources.json', 'utf8'));
const primaryFonts = fontSources.files.filter(font => font.preload).map(font => {
  const entry = Object.values(manifest).find(entry => path.posix.basename(entry.file).startsWith(font.file.slice(0, -6)));
  assert.ok(entry, `Missing primary font asset: ${font.file}`);
  return { family: font.family, url: `${base}${entry.file}` };
});
const fontPreloads = primaryFonts.map(font => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${font.url}" />`).join('\n');
// Downloaded preloads may not be decoded until first text layout. Start decoding
// the same files early, without waiting, hiding content, or changing font faces.
const fontWarmup = `<script>if('FontFace' in window)for(const f of ${JSON.stringify(primaryFonts)})new FontFace(f.family,'url("'+f.url+'")',{weight:'300 800',display:'swap'}).load().catch(error=>console.error('Font decode failed:',error));</script>`;
const report = { generatedAt: new Date().toISOString(), base, siteUrl, snapshot, documents: [], sitemapUrls: 0 };
const pages = [...api.indexablePages, { id: 'ContactResult', path: '/thank-you' }, { id: 'NotFound', path: '/404', fallback404: true }];
for (const language of ['ar', 'en']) for (const page of pages) {
  const route = page.path === '/' ? '/' : `${page.path}/`;
  const boot = { language, route, pageId: page.id, base, siteUrl, snapshot, identifierPrefix: `ssg-${language}-${page.id}-${report.documents.length}-`, fallback404: !!page.fallback404 };
  const body = await api.render(boot);
  const meta = api.pageMetadata(route, language, siteUrl, 'path');
  const entry = Object.keys(manifest).find(key => key.endsWith(`/src/pages/${page.id}.tsx`));
  assert.ok(entry, `missing manifest entry: ${page.id}`);
  const dependencies = new Set();
  function visit(key) { if (dependencies.has(key)) return; assert.ok(manifest[key]); dependencies.add(key); (manifest[key].imports || []).forEach(visit); }
  visit(entry);
  // ContactResult's empty-state SSR reuses Contact; include its dependency CSS.
  const css = [...new Set([...dependencies].flatMap(key => manifest[key].css || []))];
  const resources = css.filter(file => !template.includes(`${base}${file}`)).map(file => `<link rel="stylesheet" href="${base}${file}" />`).join('\n') + '\n' + [...dependencies].map(key => `<link rel="modulepreload" href="${base}${manifest[key].file}" />`).join('\n');
  const redirect = `<script>var legacyTarget=(${api.legacyDestination.toString()})(location.href,${JSON.stringify(base)});if(legacyTarget)location.replace(legacyTarget);</script>`;
  const html = template.replace('<html lang="ar" dir="rtl">', `<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace('<!--SSG_HEAD-->', () => `${fontPreloads}\n${fontWarmup}\n${redirect}\n${api.metadataHtml(meta)}\n${resources}`)
    .replace('<!--SSG_BODY-->', () => body)
    .replace('__SSG_STATE__', () => JSON.stringify(boot).replace(/</g, '\\u003c'));
  if (/[\u0000\ufffd]/.test(html)) {
    await writeFile(path.join(output, 'debug-body.html'), body);
    throw new Error(`Invalid SSR characters in ${language}:${route}; see docs/PHASE-5C2.md. Candidate publication is blocked.`);
  }
  const checks = validateHtml(html, { boot, meta, css });
  for (const asset of checks.assets) await access(path.join(output, 'site', decodeURIComponent(asset.slice(base.length))));
  const prefix = language === 'en' ? 'en/' : '';
  const file = page.fallback404 ? `${prefix}404.html` : `${prefix}${route.replace(/^\//, '')}index.html`;
  await mkdir(path.dirname(path.join(output, 'site', file)), { recursive: true });
  await writeFile(path.join(output, 'site', file), html);
  const integrity = validateUtf8(await readFile(path.join(output, 'site', file)), file);
  report.documents.push({ id: page.id, route, language, file, url: base + file.replace(/index\.html$/, ''), indexable: meta.indexable, canonical: meta.canonical, alternates: meta.alternates, css, ...checks, integrity, ssr: 'passed' });
}
const sitemap = api.sitemapXml(siteUrl, 'path');
report.sitemapUrls = validateSitemap(sitemap, report.documents);
await writeFile(path.join(output, 'site/sitemap.xml'), sitemap);
await writeFile(path.join(output, 'site/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(path.join(output, 'site/.nojekyll'), '');
await writeFile(path.join(output, 'ssr-report.json'), JSON.stringify(report, null, 2));
console.log(`Candidate ${values.variant}: 52/52 indexable + 4 auxiliary documents; ${report.sitemapUrls} sitemap URLs. Output: ${output}`);
