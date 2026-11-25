import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
const { installLocaleHistory } = await server.ssrLoadModule('/src/lib/localeHistory.ts');
const retry = await server.ssrLoadModule('/src/lib/contactRetry.ts');
after(() => server.close());

for (const base of ['/', '/ME-2026-Main/', '/company/site/']) {
  for (const language of ['ar', 'en']) test(`history reconciliation: ${base} ${language}`, () => {
    const browser = new EventTarget();
    let reloads = 0, routerEvents = 0;
    browser.location = { pathname: base + (language === 'en' ? 'en/' : '') + 'contact/', reload: () => reloads++ };
    const dispose = installLocaleHistory(base, language, browser);
    const router = () => routerEvents++;
    browser.addEventListener('popstate', router);
    browser.dispatchEvent(new Event('popstate'));
    assert.equal(reloads, 0); assert.equal(routerEvents, 1);
    browser.location.pathname = base + (language === 'ar' ? 'en/' : '') + 'contact/';
    browser.dispatchEvent(new Event('popstate'));
    assert.equal(reloads, 1); assert.equal(routerEvents, 1, 'wrong locale never reaches the fixed-basename router');
    browser.dispatchEvent(new Event('pageshow')); assert.equal(reloads, 2, 'BFCache reconciliation');
    dispose(); browser.dispatchEvent(new Event('popstate')); assert.equal(reloads, 2); assert.equal(routerEvents, 2);
  });
}

test('contact completion invalidates all earlier history copies without storing form data', () => {
  assert.equal(retry.contactRetryRevision(), '', 'SSR has no browser state');
  const storage = new Map();
  const browser = new EventTarget();
  browser.crypto = { randomUUID };
  browser.sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  globalThis.window = browser;
  try {
    const old = { retryRevision: retry.contactRetryRevision() };
    assert.ok(retry.isCurrentContactRetry(old)); assert.ok(retry.isCurrentContactRetry({}), 'legacy retry remains recoverable before completion');
    retry.completeContactRetry();
    assert.equal(storage.size, 1);
    assert.match([...storage.values()][0], /^[\da-f-]{36}$/);
    assert.equal(retry.isCurrentContactRetry(old), false); assert.equal(retry.isCurrentContactRetry({}), false);
    const next = { retryRevision: retry.contactRetryRevision() };
    assert.ok(retry.isCurrentContactRetry(next), 'a later failed submission can be retried');
    retry.completeContactRetry(); assert.equal(retry.isCurrentContactRetry(next), false);
    browser.sessionStorage.getItem = () => { throw new Error('Storage denied'); };
    browser.sessionStorage.setItem = () => { throw new Error('Storage denied'); };
    const privateRetry = { retryRevision: retry.contactRetryRevision() };
    assert.ok(retry.isCurrentContactRetry(privateRetry), 'same-document retry works when storage is denied');
    retry.completeContactRetry(); assert.equal(retry.isCurrentContactRetry(privateRetry), false);
  } finally { delete globalThis.window; }
});
