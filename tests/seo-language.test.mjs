import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import path from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

const server = await createServer({ configFile: false, resolve: { alias: { '@': path.resolve('src') } }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
after(() => server.close());
const { localizedUrl, localizedSearch } = await server.ssrLoadModule('/src/lib/urls.ts');
const { localizedDestination } = await server.ssrLoadModule('/src/lib/navigation.ts');
const { preferredLanguage } = await server.ssrLoadModule('/src/lib/language.ts');
const { pageMetadata, metadataHtml, seoPaths, sitemapXml } = await server.ssrLoadModule('/src/lib/seo.ts');

for (const site of ['https://example.com/', 'https://example.com/ME-2026-Main/', 'https://custom.example/company/site/']) {
  test(`all 26 pages follow the canonical and reciprocal language contract at ${site}`, () => {
    assert.equal(seoPaths.length, 26);
    for (const route of seoPaths) {
      const ar = site + (route === '/' ? '' : `${route.slice(1)}/`);
      const en = `${ar}?lang=en`;
      for (const [search, canonical, lang] of [['', ar, 'ar'], ['?lang=ar', ar, 'ar'], ['?lang=en', en, 'en']]) {
        const language = preferredLanguage(search);
        assert.equal(language, lang);
        assert.equal(localizedUrl(site, route + search + '#section', language), canonical);
        const meta = pageMetadata(route, language, site);
        assert.ok(meta.found, route);
        assert.equal(meta.canonical, canonical);
        assert.deepEqual(meta.alternates, { ar, en });
        const dom = new JSDOM(`<head>${metadataHtml(meta)}</head>`);
        const doc = dom.window.document;
        assert.equal(doc.querySelectorAll('title').length, 1);
        assert.equal(doc.querySelectorAll('meta[name="description"]').length, 1);
        assert.equal(doc.querySelector('meta[name="description"]').content, meta.description);
        assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1);
        assert.equal(doc.querySelector('link[rel="canonical"]').href, canonical);
        assert.equal(doc.querySelectorAll('link[hreflang]').length, 3);
        for (const [code, href] of Object.entries({ ar, en, 'x-default': ar })) {
          assert.equal(doc.querySelector(`link[hreflang="${code}"]`).href, href);
        }
        assert.equal(doc.querySelector('meta[property="og:locale"]').content, lang === 'ar' ? 'ar_EG' : 'en_US');
        dom.window.close();
      }
      assert.equal(localizedUrl(site, route === '/' ? '/' : `${route}/`, 'ar'), ar);
    }
  });

  test(`sitemap contains only final canonical URLs and reciprocal alternates at ${site}`, () => {
    const dom = new JSDOM(sitemapXml(site), { contentType: 'text/xml' });
    const rows = [...dom.window.document.getElementsByTagName('url')];
    const byUrl = new Map(rows.map(row => [row.getElementsByTagName('loc')[0].textContent, row]));
    assert.equal(rows.length, 52);
    assert.equal(byUrl.size, 52);
    for (const route of seoPaths) {
      const ar = localizedUrl(site, route, 'ar'), en = localizedUrl(site, route, 'en');
      for (const url of [ar, en]) {
        const row = byUrl.get(url);
        assert.ok(row, url);
        const alternates = Object.fromEntries([...row.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map(link => [link.getAttribute('hreflang'), link.getAttribute('href')]));
        assert.deepEqual(alternates, { ar, en, 'x-default': ar });
        assert.ok(new URL(url).pathname.endsWith('/'));
        assert.notEqual(new URL(url).searchParams.get('lang'), 'ar');
      }
    }
    dom.window.close();
  });
}

test('navigation preserves destination queries, hashes, relative paths, and explicit language choices', () => {
  const current = { pathname: '/courses/bim-fundamentals/', search: '?lang=en&ref=a%26b', hash: '#old' };
  assert.deepEqual(localizedDestination('/services/bim-training?message=a%26b%3Dc#benefits', current), {
    pathname: '/services/bim-training/', search: '?message=a%26b%3Dc&lang=en', hash: '#benefits',
  });
  assert.deepEqual(localizedDestination('#details', current), { pathname: current.pathname, search: '?ref=a%26b&lang=en', hash: '#details' });
  assert.deepEqual(localizedDestination('../portfolio/1', current), { pathname: '../portfolio/1/', search: '?lang=en' });
  assert.deepEqual(localizedDestination('/contact?lang=ar&message=hello#form', current), { pathname: '/contact/', search: '?message=hello', hash: '#form' });
  assert.deepEqual(localizedDestination('/contact?lang=en#form', { ...current, search: '' }), { pathname: '/contact/', search: '?lang=en', hash: '#form' });
  assert.deepEqual(localizedDestination(current, current, 'ar'), { ...current, search: '?ref=a%26b' });
  assert.deepEqual(localizedDestination({ pathname: '/contact', search: '?lang=ar&lang=en&tag=1&tag=2', hash: '#form' }, current, 'en'), { pathname: '/contact/', search: '?tag=1&tag=2&lang=en', hash: '#form' });
  assert.equal(localizedSearch('?lang=ar&lang=en', 'ar'), '');
  for (const external of ['https://other.example/path?lang=ar#x', '//other.example/path', 'mailto:info@example.com', 'tel:+201234']) assert.equal(localizedDestination(external, current), external);
});

test('canonical URLs discard tracking and fragments and cannot escape a deployment base', () => {
  const site = 'https://example.com/ME-2026-Main/';
  assert.equal(localizedUrl(site, '/portfolio/1/?lang=ar&utm_source=test#gallery', 'en'), `${site}portfolio/1/?lang=en`);
  for (const route of ['https://other.example/path', '//other.example/path', '/\\other.example/path', '/../outside']) assert.throws(() => localizedUrl(site, route, 'ar'));
});
