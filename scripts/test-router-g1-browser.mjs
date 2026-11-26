import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { serve, metrics } from './ssg-browser-utils.mjs';

// Bounded local input checks; these do not establish universal navigation safety.
const evidenceDirectory = new URL('../dist-ssr/phase5c3-g1/', import.meta.url);
await mkdir(evidenceDirectory, { recursive: true });
const output = new URL('hydration-sweep.json', evidenceDirectory);
const report = { cases: [], failures: [], externalNavigation: [], browser: '' };
console.log('Launching Chromium for local G1 checks');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true, timeout: 30000 });
report.browser = await browser.version();
console.log(`Browser ready: ${report.browser}`);
async function check(name, action) {
  try { report.cases.push({ name, passed: true, evidence: await action() }); }
  catch (error) { report.failures.push({ name, error: error.stack }); throw error; }
  finally { await writeFile(output, JSON.stringify(report, null, 2)); }
}
try {
  for (const variant of ['repo', 'root', 'custom']) {
    console.log(`Starting ${variant} hydration/navigation checks`);
    const build = JSON.parse(await readFile(`dist-ssr/candidate/${variant}/ssr-report.json`, 'utf8'));
    const site = await serve(`dist-ssr/candidate/${variant}/site`, build.base, true);
    const ctx = await browser.newContext();
    ctx.setDefaultTimeout(15000);
    await ctx.route('**/*', route => {
      const request = route.request();
      if (new URL(request.url()).origin === site.origin) return route.continue();
      if (request.isNavigationRequest() && request.frame() === request.frame().page().mainFrame()) report.externalNavigation.push(request.url());
      return route.abort();
    });
    const page = await ctx.newPage();
    const errors = [], assets = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(site.origin) && response.status() >= 400 && !response.request().isNavigationRequest()) assets.push(response.url()); });
    async function ready(language, preserveInitialDom = true) {
      await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
      const state = await metrics(page);
      assert.equal(state.lang, language);
      assert.equal(state.dir, language === 'ar' ? 'rtl' : 'ltr');
      if (preserveInitialDom) {
        assert.equal(state.rootPreserved, true);
        assert.equal(state.idsPreserved, true);
      }
      assert.deepEqual(state.recoverableErrors, []);
      assert.equal(state.bootstrapError, undefined);
      assert.deepEqual(errors, []);
      assert.deepEqual(assets, []);
      assert.deepEqual(report.externalNavigation, []);
      return state;
    }
    try {
      for (const doc of build.documents) await check(`${variant}:${doc.language}:${doc.route}:direct`, async () => {
        const response = await page.goto(site.origin + doc.url, { waitUntil: 'load' });
        assert.equal(response.status(), 200);
        // An empty ContactResult intentionally navigates after hydration. Its
        // final Contact DOM is different; recoverable errors must still be zero.
        const redirected = doc.id === 'ContactResult';
        if (redirected) {
          await page.waitForURL(site.origin + build.base + (doc.language === 'en' ? 'en/' : '') + 'contact/');
          await page.waitForFunction(() => document.title.startsWith('Contact Us') || document.title.startsWith('تواصل معنا'));
        }
        const state = await ready(doc.language, !redirected);
        const expected = redirected ? build.documents.find(item => item.id === 'Contact' && item.language === doc.language) : doc;
        assert.equal(state.canonical, expected.canonical);
        assert.equal(state.counts.alternates, 3);
        return { url: doc.url, language: state.lang, recoverableErrors: state.recoverableErrors, rootPreserved: state.rootPreserved };
      });
      for (const language of ['ar', 'en']) {
        const prefix = build.base + (language === 'en' ? 'en/' : '');
        for (const route of ['', 'services/bim-training/', 'courses/bim-fundamentals/', 'portfolio/1/', 'contact/']) await check(`${variant}:${language}:${route}:refresh`, async () => {
          assert.equal((await page.goto(site.origin + prefix + route)).status(), 200);
          await ready(language);
          assert.equal((await page.reload({ waitUntil: 'load' })).status(), 200);
          await ready(language);
          return { refresh: true };
        });
        for (const target of ['https://attacker.invalid/', '//attacker.invalid/', '/\\attacker.invalid/', build.base === '/' ? 'https://attacker.invalid/?x=1' : build.base + '../outside']) await check(`${variant}:${language}:bounded-untrusted-query:${target}`, async () => {
          const url = new URL(site.origin + prefix + 'contact/');
          for (const key of ['next', 'returnTo', 'redirect', '__spa']) url.searchParams.set(key, target);
          await page.goto(url.href, { waitUntil: 'load' });
          await ready(language);
          assert.equal(new URL(page.url()).origin, site.origin);
          assert.equal(new URL(page.url()).pathname, prefix + 'contact/');
          return { sameOrigin: true, contactRoutePreserved: true, externalNavigation: 0 };
        });
      }
    } finally { await ctx.close(); await site.close(); }
  }
} finally { await browser.close(); await writeFile(output, JSON.stringify(report, null, 2)); }
console.log(`${report.cases.length} hydration/navigation checks passed; ${report.failures.length} failures.`);
