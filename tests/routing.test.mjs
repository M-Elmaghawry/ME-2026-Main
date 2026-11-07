import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { build } from 'vite';
import { gzipSync } from 'node:zlib';

const origin = 'https://example.com';
const inlineScripts = (html) => [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1]);

// Exercise the actual generated HTML, including Vite's base substitutions.
for (const base of ['/', '/ME-2026-Main/']) {
  test(`direct routes, SEO, and lazy-load budgets work under ${base}`, async (context) => {
    const bundle = await build({ base, logLevel: 'silent', build: { write: false } });
    const outputs = Array.isArray(bundle) ? bundle.flatMap((item) => item.output) : bundle.output;
    const entry = outputs.find((item) => item.type === 'chunk' && item.isEntry);
    assert.ok(entry, 'a bootstrap entry must exist');
    const chunkMap = new Map(outputs.filter((item) => item.type === 'chunk').map((item) => [item.fileName, item]));
    const closure = (starts) => {
      const included = new Set();
      const visit = (name) => {
        if (included.has(name)) return;
        const chunk = chunkMap.get(name);
        assert.ok(chunk, `missing chunk: ${name}`);
        included.add(name);
        chunk.imports.forEach(visit);
      };
      starts.forEach(visit);
      return [...included].map((name) => chunkMap.get(name));
    };
    const bootstrap = closure([entry.fileName]);
    assert.ok(bootstrap.every((chunk) => Object.keys(chunk.modules).every((id) => !/\/src\/pages\/.*\.tsx$/.test(id))), 'route implementations must remain outside the bootstrap');
    const pageChunks = [...chunkMap.values()].filter((chunk) => /\/src\/pages\/[^/]+\.tsx$/.test(chunk.facadeModuleId || ''));
    assert.equal(pageChunks.length, 13, 'all 13 routes must be independently loadable');
    assert.ok(pageChunks.some((chunk) => chunk.facadeModuleId.endsWith('/ContactResult.tsx')), 'contact results must load independently');
    const home = pageChunks.find((chunk) => chunk.facadeModuleId.endsWith('/Index.tsx'));
    const seo = [...chunkMap.values()].find((chunk) => chunk.facadeModuleId?.endsWith('/src/lib/seo.ts'));
    assert.ok(home && seo);
    const homeWithSeo = closure([entry.fileName, home.fileName, seo.fileName]);
    const gzipBytes = (chunks) => chunks.reduce((sum, chunk) => sum + gzipSync(chunk.code).length, 0);
    const bootstrapGzip = gzipBytes(bootstrap), homeGzip = gzipBytes(homeWithSeo);
    assert.ok(bootstrapGzip < 120_000, `bootstrap gzip budget exceeded: ${bootstrapGzip}`);
    assert.ok(homeGzip < 210_000, `homepage + metadata gzip budget exceeded: ${homeGzip}`);
    assert.ok([...chunkMap.values()].every((chunk) => Buffer.byteLength(chunk.code) < 500_000), 'individual JavaScript chunks must stay below 500 kB');
    context.diagnostic(`JavaScript gzip bytes: bootstrap=${bootstrapGzip}, homepage including SEO=${homeGzip}`);
    const html = (name) => {
      const asset = outputs.find((item) => item.fileName === name);
      assert.ok(asset, `${name} must be generated`);
      return String(asset.source);
    };
    const index = html('index.html');
    const redirect = inlineScripts(html('404.html'))[0];
    const restore = inlineScripts(index).find((script) => script.includes('__spa'));
    assert.ok(restore, 'index must restore direct visits before mounting React');
    assert.ok(index.includes(`src="${base}assets/`), 'entry assets must use the deployment base');
    assert.ok(!index.includes('%BASE_URL%'), 'base placeholders must be replaced');
    const sitemap = html('sitemap.xml');
    for (const [route, expected] of [['contact', 'Contact Us'], ['courses/bim-fundamentals', 'BIM Fundamentals'], ['portfolio/1', 'NEOM Shigri']]) {
      const detail = html(`${route}/index.html`);
      assert.ok(detail.includes(expected), `${route} must have its own metadata before JavaScript runs`);
      assert.ok(detail.includes(`src="${base}assets/`));
      assert.ok(sitemap.includes(`${base}${route}`), `${route} must appear in the sitemap`);
      assert.equal((detail.match(/rel="canonical"/g) || []).length, 1);
    }

    const restoreRoute = (search) => {
      let result;
      const location = new URL(`${base}${search}`, origin);
      const history = { replaceState: (_state, _title, route) => { result = route; } };
      runInNewContext(restore, { location, URL, URLSearchParams, window: { history } });
      return result;
    };

    for (const route of [
      '', 'about', 'services', 'services/bim-training', 'courses',
      'courses/bim-fundamentals', 'portfolio', 'portfolio/shigri-neom',
      'contact', 'thank-you', 'privacy-policy', 'terms', 'unknown-page',
      'contact?lang=ar&message=a%26b%3Dc#form',
      'courses?next=%2Fcontact&literal=~and~#details',
    ]) {
      const location = new URL(`${base}${route}`, origin);
      let destination;
      location.replace = (url) => { destination = url; };
      runInNewContext(redirect, { window: { location }, encodeURIComponent });
      assert.ok(destination.startsWith(`${base}?__spa=`));
      const redirected = new URL(destination, origin);
      assert.equal(restoreRoute(redirected.search), location.pathname + location.search + location.hash);
    }

    assert.equal(restoreRoute('?lang=ar'), undefined, 'ordinary query parameters must be preserved');
    for (const route of ['https://evil.example/contact', '//evil.example/contact', '/\\evil.example/contact']) {
      assert.equal(restoreRoute(`?__spa=${encodeURIComponent(route)}`), undefined, 'external redirects must be rejected');
    }
    if (base !== '/') {
      for (const route of ['/outside/contact', `${base}../outside`]) {
        assert.equal(restoreRoute(`?__spa=${encodeURIComponent(route)}`), undefined, 'routes outside the app must be rejected');
      }
    }
  });
}
