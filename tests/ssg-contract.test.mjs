import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';
import { validateUtf8 } from '../scripts/ssg-integrity.mjs';
import { validateHtml, validateSitemap } from '../scripts/ssg-html.mjs';

const server = await createServer({ configFile: false, resolve: { alias: { '@': path.resolve('src') } }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
after(() => server.close());
const { legacyDestination } = await server.ssrLoadModule('/src/lib/legacy.ts');
const { pageMetadata } = await server.ssrLoadModule('/src/lib/seo.ts');
test('legacy URL migration preserves values and fragments within each deployment base', () => {
  for (const base of ['/', '/ME-2026-Main/', '/company/site/']) {
    const ar = `https://example.com${base}contact/`;
    assert.equal(legacyDestination(ar, base), null);
    const en = new URL(legacyDestination(ar + '?lang=en&ref=a%26b#form', base));
    assert.equal(en.pathname, `${base}en/contact/`); assert.equal(en.searchParams.get('ref'), 'a&b'); assert.equal(en.hash, '#form'); assert.equal(en.searchParams.has('lang'), false);
    const back = new URL(legacyDestination(`https://example.com${base}en/contact/?lang=ar&ref=a%3Db#form`, base));
    assert.equal(back.pathname, `${base}contact/`); assert.equal(back.searchParams.get('ref'), 'a=b'); assert.equal(back.hash, '#form');
    const route = `${base}portfolio/1/?lang=en&ref=old#gallery`;
    const restored = new URL(legacyDestination(`https://example.com${base}?__spa=${encodeURIComponent(route)}`, base));
    assert.equal(restored.pathname, `${base}en/portfolio/1/`); assert.equal(restored.searchParams.get('ref'), 'old'); assert.equal(restored.hash, '#gallery');
    for (const attack of ['https://evil.example/x', '//evil.example/x', '/\\evil.example/x', `${base}../outside`]) {
      const href = `https://example.com${base}?__spa=${encodeURIComponent(attack)}`;
      const destination = legacyDestination(href, base);
      if (destination) { assert.equal(new URL(destination).origin, 'https://example.com'); assert.ok(new URL(destination).pathname.startsWith(base)); }
    }
  }
});
for (const variant of ['repo', 'root', 'custom']) test(`all 52 ${variant} documents and auxiliary files satisfy the full static contract`, async () => {
  const output = path.resolve('dist-ssr/candidate', variant);
  const report = JSON.parse(await readFile(path.join(output, 'ssr-report.json'), 'utf8'));
  assert.equal(report.documents.filter(doc => doc.indexable).length, 52); assert.equal(report.documents.length, 56);
  for (const doc of report.documents) {
    const bytes = await readFile(path.join(output, 'site', doc.file)); validateUtf8(bytes, doc.file);
    const html = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const dom = new JSDOM(html); const boot = JSON.parse(dom.window.document.getElementById('ssg-state').textContent); dom.window.close();
    const meta = pageMetadata(doc.route, doc.language, report.siteUrl, 'path');
    const checks = validateHtml(html, { boot, meta, css: doc.css });
    assert.equal(meta.canonical, doc.canonical);
    for (const asset of checks.assets) await access(path.join(output, 'site', decodeURIComponent(asset.slice(report.base.length))));
  }
  assert.equal(validateSitemap(await readFile(path.join(output, 'site/sitemap.xml'), 'utf8'), report.documents), 52);
  const robots = await readFile(path.join(output, 'site/robots.txt'), 'utf8'); assert.ok(robots.includes(report.siteUrl + 'sitemap.xml'));
  await access(path.join(output, 'site/.nojekyll'));
});
