import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import path from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

const server = await createServer({ configFile: false, resolve: { alias: { '@': path.resolve('src') } }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
after(() => server.close());
const { staticAliasPathname, installStaticRouteAliases } = await server.ssrLoadModule('/ssg/route-alias.ts');
const { indexablePages } = await server.ssrLoadModule('/src/lib/routePaths.ts');

for (const base of ['/', '/ME-2026-Main/', '/company/site/']) {
  test(`literal aliases match only generated directory documents: ${base}`, () => {
    for (const language of ['ar', 'en']) {
      const prefix = base + (language === 'en' ? 'en/' : '');
      for (const page of [...indexablePages, { path: '/thank-you' }]) {
        const canonical = prefix + (page.path === '/' ? '' : page.path.slice(1) + '/');
        assert.equal(staticAliasPathname(canonical + 'index.html', base), canonical);
        assert.equal(staticAliasPathname(canonical, base), null, 'idempotent');
      }
      for (const invalid of ['missing/', 'services/missing/', 'courses/missing/', 'about/extra/', 'about/index.html/', '404/', 'en/en/about/', 'About/', '/', 'about//']) {
        assert.equal(staticAliasPathname(prefix + invalid + 'index.html', base), null, invalid);
      }
      assert.equal(staticAliasPathname(prefix + 'about/INDEX.HTML', base), null);
      assert.equal(staticAliasPathname(prefix + 'about/%69ndex.html', base), null);
    }
    if (base !== '/') assert.equal(staticAliasPathname(base.slice(0, -1) + '-other/about/index.html', base), null);
  });
  test(`pre-router normalization preserves state, queries, fragments, and traversal: ${base}`, () => {
    const suffix = '?ref=a%26b&x=%2F&x=2#form';
    const dom = new JSDOM('', { url: 'https://example.test' + base + 'contact/index.html' + suffix });
    const browser = dom.window;
    const state = { idx: 7, key: 'preserve', usr: { draft: { synthetic: true } }, other: 42 };
    browser.history.replaceState(state, '', browser.location.href);
    const length = browser.history.length;
    const dispose = installStaticRouteAliases(base, browser);
    assert.equal(browser.location.href, 'https://example.test' + base + 'contact/' + suffix);
    assert.deepEqual(browser.history.state, state); assert.equal(browser.history.length, length);
    for (const event of ['popstate', 'pageshow']) {
      browser.history.replaceState(state, '', base + 'en/about/index.html' + suffix);
      let routerPath;
      const listener = () => { routerPath = browser.location.pathname; };
      browser.addEventListener(event, listener);
      browser.dispatchEvent(new browser.Event(event));
      assert.equal(routerPath, base + 'en/about/');
      assert.deepEqual(browser.history.state, state); assert.equal(browser.location.search + browser.location.hash, suffix);
      browser.removeEventListener(event, listener);
    }
    dispose(); browser.history.replaceState(state, '', base + 'about/index.html');
    browser.dispatchEvent(new browser.Event('popstate'));
    assert.equal(browser.location.pathname, base + 'about/index.html');
    dom.window.close();
  });
}
