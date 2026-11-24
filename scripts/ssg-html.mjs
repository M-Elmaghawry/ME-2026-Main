import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

export function validateHtml(html, { boot, meta, css }) {
  const dom = new JSDOM(html);
  try {
    const doc = dom.window.document;
    assert.equal(doc.documentElement.lang, boot.language);
    assert.equal(doc.documentElement.dir, boot.language === 'ar' ? 'rtl' : 'ltr');
    assert.equal(doc.querySelectorAll('main').length, 1, 'one complete main landmark');
    assert.equal(doc.querySelectorAll('h1').length, 1, 'one H1');
    assert.ok(doc.querySelector('h1').textContent.trim().length >= 3);
    assert.ok(doc.querySelector('main').textContent.trim().length > (boot.fallback404 ? 10 : 200));
    assert.equal(doc.querySelector('[data-route-loading]'), null);
    assert.equal(doc.querySelector('template[data-msg], template[data-dgst]'), null, 'no failed Suspense boundaries');
    assert.ok(!html.includes('<!--$!-->'), 'no server-render bailout');
    assert.equal(doc.querySelectorAll('title').length, 1);
    assert.equal(doc.title, meta.title);
    for (const name of ['description', 'robots']) assert.equal(doc.querySelectorAll(`meta[name="${name}"]`).length, 1);
    assert.equal(doc.querySelector('meta[name="description"]').content, meta.description);
    assert.equal(doc.querySelector('meta[name="robots"]').content, meta.indexable ? 'index,follow' : 'noindex,follow');
    assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1);
    assert.equal(doc.querySelector('link[rel="canonical"]').href, meta.canonical);
    assert.equal(new URL(meta.canonical).search, '');
    assert.equal(doc.querySelectorAll('link[hreflang]').length, 3);
    for (const [code, url] of Object.entries({ ...meta.alternates, 'x-default': meta.alternates.ar })) assert.equal(doc.querySelector(`link[hreflang="${code}"]`).href, url);
    assert.equal(doc.querySelector('meta[property="og:url"]').content, meta.canonical);
    assert.equal(doc.querySelector('meta[property="og:locale"]').content, boot.language === 'ar' ? 'ar_EG' : 'en_US');
    assert.equal(doc.querySelectorAll('script[type="application/ld+json"]').length, 1);
    assert.deepEqual(JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent), meta.schema);
    assert.deepEqual(JSON.parse(doc.getElementById('ssg-state').textContent), boot);
    const assets = [...doc.querySelectorAll('img[src],source[srcset],script[src],link[rel="stylesheet"],link[rel="modulepreload"],link[rel="preload"]')].flatMap(element => element.hasAttribute('srcset')
      ? element.getAttribute('srcset').split(',').map(value => value.trim().split(' ')[0])
      : [element.getAttribute('src') ?? element.getAttribute('href')]);
    assert.ok(assets.every(src => /^https:\/\/fonts\.googleapis\.com\//.test(src) || (src.startsWith(boot.base) && !src.startsWith(`${boot.base}en/`))), 'assets use the deployment base, not a locale prefix');
    assert.ok(css.every(file => doc.querySelector(`link[rel="stylesheet"][href="${boot.base}${file}"]`)), 'route CSS present without JavaScript');
    assert.ok(!/%BASE_URL%|<!--SSG_|__SSG_STATE__/.test(html));
    return { h1: doc.querySelector('h1').textContent.trim(), title: doc.title, bodyBytes: Buffer.byteLength(doc.getElementById('root').innerHTML), assets: [...new Set(assets.filter(src => src.startsWith(boot.base)))] };
  } finally { dom.window.close(); }
}

export function validateSitemap(xml, documents) {
  const dom = new JSDOM(xml, { contentType: 'application/xml' });
  try {
    const rows = [...dom.window.document.getElementsByTagName('url')];
    assert.equal(rows.length, 52);
    const expected = new Map(documents.filter(doc => doc.indexable).map(doc => [doc.canonical, doc]));
    assert.equal(expected.size, 52);
    const seen = new Set();
    for (const row of rows) {
      const loc = row.getElementsByTagName('loc')[0].textContent;
      assert.ok(expected.has(loc), loc); assert.ok(!seen.has(loc)); seen.add(loc);
      const doc = expected.get(loc);
      const links = Object.fromEntries([...row.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map(link => [link.getAttribute('hreflang'), link.getAttribute('href')]));
      assert.deepEqual(links, { ...doc.alternates, 'x-default': doc.alternates.ar });
    }
    return rows.length;
  } finally { dom.window.close(); }
}
