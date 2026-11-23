import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { JSDOM } from 'jsdom';
import { prepareImages } from './optimize-images.mjs';

const workspace = process.cwd();
const output = path.resolve('dist-ssr/poc');
assert.equal(output, path.join(workspace, 'dist-ssr', 'poc'), 'POC output must remain inside its isolated workspace directory');
const base = process.env.SSR_POC_BASE_PATH || '/ME-2026-Main/';
assert.ok(base.startsWith('/') && base.endsWith('/') && !base.startsWith('//') && !/[?#\\]/.test(base));
const siteUrl = process.env.SSR_POC_SITE_URL || new URL(base, 'https://m-elmaghawry.github.io/').href;
assert.equal(new URL(siteUrl).pathname, base, 'Site URL and deployment base must agree');
const renderedAt = Date.now();
process.env.SSR_POC_BASE_PATH = base;
process.env.SSR_POC_RENDER_TIME = String(renderedAt);
const configFile = path.resolve('experiments/bilingual-ssr/vite.config.ts');
await prepareImages();
await build({ configFile, logLevel: 'warn' });
await build({ configFile, publicDir: false, logLevel: 'warn', build: {
  outDir: path.join(output, 'server'), emptyOutDir: true, manifest: false,
  ssr: path.resolve('experiments/bilingual-ssr/entry-server.tsx'),
  rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
} });
const { render, pages, metadata, headHtml } = await import(pathToFileURL(path.join(output, 'server/entry-server.mjs')).href);
const template = await readFile(path.join(output, 'site/index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(output, 'site/.vite/manifest.json'), 'utf8'));
assert.equal(pages.length, 5, 'This proof of concept must remain limited to five pages');
const report = { base, siteUrl, renderedAt, documents: [], limitations: [
  'Only five page types are generated. No global redirect or production 404 changes.',
  'Language switching deliberately loads the corresponding SSR document.',
  'Experimental overlays are isolated from production and must be replaced by reviewed shared APIs before migration.',
] };
for (const language of ['ar', 'en']) for (const page of pages) {
  const prefix = language === 'en' ? 'en/' : '';
  const boot = { language, route: page.path, pageId: page.id, base, siteUrl, renderedAt, identifierPrefix: `poc-${language}-${page.id}-` };
  const body = await render(boot);
  const meta = metadata(page.path, language, siteUrl);
  const pageEntry = Object.keys(manifest).find(key => key.endsWith(`/src/pages/${page.module}.tsx`));
  assert.ok(pageEntry, `Missing client manifest entry for ${page.id}`);
  const dependencies = new Set();
  function visit(key) { if (dependencies.has(key)) return; dependencies.add(key); (manifest[key].imports || []).forEach(visit); }
  visit(pageEntry);
  const css = [...new Set([...dependencies].flatMap(key => manifest[key].css || []))];
  const resources = css.filter(file => !template.includes(`${base}${file}`)).map(file => `<link rel="stylesheet" data-poc-route-css href="${base}${file}" />`).join('\n') + '\n' +
    [...dependencies].map(key => `<link rel="modulepreload" href="${base}${manifest[key].file}" />`).join('\n');
  const html = template.replace('<html lang="ar" dir="rtl">', `<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace('__POC_PAGE__', `${language}:${page.path}`)
    .replace('<!--POC_HEAD-->', `${headHtml(page.path, language, siteUrl)}\n${resources}`)
    .replace('<!--POC_BODY-->', body)
    .replace('__POC_STATE__', JSON.stringify(boot).replace(/</g, '\\u003c'));
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  assert.equal(doc.documentElement.lang, language);
  assert.equal(doc.documentElement.dir, language === 'ar' ? 'rtl' : 'ltr');
  assert.equal(doc.querySelectorAll('h1').length, 1, `${page.id}: one meaningful H1`);
  assert.ok(doc.querySelector('h1').textContent.trim().length > 3);
  assert.ok(doc.querySelector('main').textContent.trim().length > 200);
  assert.ok(doc.querySelectorAll('a[href]').length > 0);
  assert.equal(doc.querySelector('[data-poc-loading]'), null);
  assert.equal(doc.querySelectorAll('title').length, 1);
  assert.equal(doc.title, meta.title);
  assert.equal(doc.querySelectorAll('meta[name="description"]').length, 1);
  assert.equal(doc.querySelector('meta[name="description"]').content, meta.description);
  assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, meta.canonical);
  for (const [lang, href] of Object.entries({ ...meta.alternates, 'x-default': meta.alternates.ar })) assert.equal(doc.querySelector(`link[hreflang="${lang}"]`).href, href);
  assert.equal(doc.querySelector('meta[property="og:locale"]').content, language === 'ar' ? 'ar_EG' : 'en_US');
  assert.equal(doc.querySelector('meta[property="og:url"]').content, meta.canonical);
  assert.ok(JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent));
  const assets = [...doc.querySelectorAll('img[src], source[srcset]')].flatMap(element => element.tagName === 'IMG' ? [element.getAttribute('src')] : element.getAttribute('srcset').split(',').map(item => item.trim().split(' ')[0]));
  assert.ok(assets.every(src => src.startsWith(base) && !src.startsWith(`${base}en/`)), 'Assets must use the deployment base, never the locale prefix');
  const relativeFile = `${prefix}${page.path.replace(/^\//, '')}index.html`;
  const file = path.join(output, 'site', relativeFile);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  assert.ok(css.every(file => doc.querySelector(`link[rel="stylesheet"][href="${base}${file}"]`)), 'All route CSS must be present before JavaScript');
  report.documents.push({ id: page.id, language, route: page.path, file: relativeFile, url: `${base}${prefix}${page.path.replace(/^\//, '')}`, h1: doc.querySelector('h1').textContent, title: doc.title, canonical: meta.canonical, css, bodyBytes: Buffer.byteLength(body), ssr: 'passed' });
  dom.window.close();
}
assert.equal(report.documents.length, 10);
await writeFile(path.join(output, 'ssr-report.json'), JSON.stringify(report, null, 2));
console.log(`POC SSR: ${report.documents.length}/10 documents validated at ${path.join(output, 'site')}`);
