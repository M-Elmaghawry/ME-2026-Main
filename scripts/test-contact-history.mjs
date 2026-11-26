import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { serve, metrics } from './ssg-browser-utils.mjs';

// Only the separately built, mocked fixture is served. No real messages leave
// the browser. Reports contain navigation/boolean evidence, never form values.
const output = path.resolve(`dist-ssr/phase5c3-b-${Date.now()}`);
await mkdir(output, { recursive: true });
const csr = process.argv.includes('--csr');
const aliases = process.argv.includes('--alias') && !csr;
const base = csr ? '/' : process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : '/ME-2026-Main/';
assert.ok(base.startsWith('/') && base.endsWith('/'));
if (csr) {
  // Exercise the unchanged production build configuration with local mocks only.
  // This output is isolated from dist and from the SSG candidate.
  const { build } = await import('vite');
  await build({ configFile: 'vite.config.ts', base, logLevel: 'warn',
    build: { outDir: 'dist-ssr/csr-contact-fixture' },
    resolve: { alias: [
      { find: '@emailjs/browser', replacement: path.resolve('tests/fixtures/emailjs-browser.mjs') },
      { find: '@/config/emailjs', replacement: path.resolve('tests/fixtures/emailjs-config.mjs') },
      { find: '@', replacement: path.resolve('src') },
    ] }, define: { 'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify('') },
  });
}
const fixture = await serve(csr ? 'dist-ssr/csr-contact-fixture' : 'dist-ssr/candidate/contact-fixture/site', base, true);
const executablePath = process.env.CHROME_PATH || (process.argv.includes('--edge')
  ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  : ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync));
const browser = await chromium.launch({ executablePath, headless: true, chromiumSandbox: true, ignoreDefaultArgs: ['--disable-back-forward-cache'] });
const report = { mode: csr ? 'csr' : 'ssg', base, aliases, browser: await browser.version(), cases: [], failures: [], observations: [], hydrationChecks: 0, emailRequests: 0, localAssetFailures: [] };
const values = { name: 'Synthetic contact history', email: 'history@example.invalid', phone: '501234567', company: 'Local test', message: 'Synthetic local mocked contact history check.', countryCode: '+966', service: 'bim-training' };
const empty = { name: '', email: '', phone: '', company: '', message: '', countryCode: '+20', service: '' };
const url = (lang, route = 'contact', suffix = '') => {
  const target = new URL(`${fixture.origin}${base}${!csr && lang === 'en' ? 'en/' : ''}${route}/${suffix}`);
  if (csr && lang === 'en') target.searchParams.set('lang', 'en');
  return target.href;
};
const switchName = lang => lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
const retryName = lang => lang === 'ar' ? 'حاول مرة أخرى' : 'Try again';
async function refresh(page) {
  if (aliases) await page.evaluate(() => {
    const url = new URL(location.href); url.pathname += 'index.html';
    history.replaceState(history.state, '', url);
  });
  return page.reload();
}
const snapshot = () => ({ url: location.pathname + location.search + location.hash, lang: document.documentElement.lang, dir: document.documentElement.dir, boot: JSON.parse(document.getElementById('ssg-state')?.textContent || 'null')?.language, main: document.querySelectorAll('main').length, h1: document.querySelector('h1')?.textContent, historyHasDraft: !!history.state?.usr?.draft, result: history.state?.usr?.status ?? null, restoredFromBFCache: window.__CONTACT_HISTORY_BFCACHE__ ?? false });
async function check(name, run) {
  try { await run(); report.cases.push({ name, passed: true }); console.log('PASSED ' + name); }
  catch (error) { report.failures.push({ name, error: error.stack }); throw error; }
  finally { await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); }
}
async function context(viewport, denyStorage = false) {
  const ctx = await browser.newContext({ viewport }); ctx.setDefaultTimeout(12000);
  await ctx.addInitScript(() => window.addEventListener('pageshow', event => { window.__CONTACT_HISTORY_BFCACHE__ = event.persisted; }));
  await ctx.route('**/*', route => {
    const target = new URL(route.request().url());
    if (target.hostname === '127.0.0.1') return route.continue();
    if (target.hostname.includes('emailjs')) report.emailRequests++;
    return route.abort();
  });
  if (denyStorage === 'write') await ctx.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage full or read-only', 'QuotaExceededError'); }; });
  else if (denyStorage) await ctx.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Storage denied', 'SecurityError'); } }));
  return ctx;
}
async function ready(page, lang, route = 'contact', suffix = '') {
  await page.waitForURL(url(lang, route, suffix));
  await page.waitForFunction(({ lang, route, csr }) => (csr || (window.__SSG_EVIDENCE__?.hydrated && JSON.parse(document.getElementById('ssg-state').textContent).language === lang)) && document.documentElement.lang === lang && !!document.querySelector('main h1') && !document.querySelector('[data-route-loading]') && (route === 'contact' ? !!document.querySelector('#contact-name') : !document.querySelector('#contact-name')), { lang, route, csr });
  const evidence = await metrics(page);
  assert.deepEqual(evidence.recoverableErrors, []); assert.equal(evidence.bootstrapError, undefined);
  assert.deepEqual(evidence.counts, { title: 1, description: 1, canonical: 1, alternates: 3, jsonld: 1 });
  assert.equal(evidence.dir, lang === 'ar' ? 'rtl' : 'ltr'); assert.notEqual(evidence.h1, '404');
  assert.equal(await page.locator('main').count(), 1);
  if (!csr) report.hydrationChecks++;
}
async function fields(page, expected) {
  await page.waitForFunction(expected => Object.entries(expected).every(([name, value]) => document.querySelector(`#contact-${name}`)?.value === value), expected);
}
async function fill(page) {
  for (const name of ['name', 'email', 'phone', 'company', 'message']) await page.locator('#contact-' + name).fill(values[name]);
  for (const name of ['countryCode', 'service']) await page.locator('#contact-' + name).selectOption(values[name]);
}
async function submit(page, lang, outcome) {
  await page.evaluate(outcome => { window.__EMAILJS_TEST__.outcome = outcome; }, outcome);
  await page.locator('form button[type="submit"]').click(); await ready(page, lang, 'thank-you');
  await page.waitForFunction(outcome => history.state?.usr?.status === outcome, outcome);
}
async function toggle(page, from, route = 'contact', suffix = '') {
  await page.getByRole('button', { name: switchName(from), exact: true }).click();
  await ready(page, from === 'ar' ? 'en' : 'ar', route, suffix);
}
try {
  for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    for (const lang of ['ar', 'en']) {
      const other = lang === 'ar' ? 'en' : 'ar'; const label = `${device}-${lang}`;
      const ctx = await context(viewport), page = await ctx.newPage(); const errors = [];
      let originalErrorIndex;
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (/hydration|bootstrap failed|not able to match the URL|No routes matched/i.test(message.text())) errors.push(message.text()); });
      page.on('response', response => { if (new URL(response.url()).hostname === '127.0.0.1' && response.status() >= 400) report.localAssetFailures.push(response.url()); });
      try {
        await check(`${label}-direct-contact-and-result`, async () => {
          const response = await page.goto(url(lang) + (aliases ? 'index.html' : '')); await ready(page, lang); await fields(page, empty);
          const html = await response.text(); assert.ok(!html.includes(values.email)); assert.ok(!html.includes(values.name));
          if (!csr) {
            assert.equal((await metrics(page)).rootPreserved, true);
            await page.goto(url(lang, 'thank-you') + (aliases ? 'index.html' : '')); await ready(page, lang); await fields(page, empty);
          }
        });
        await check(`${label}-mocked-failure-result-switch-refresh-retry`, async () => {
          await fill(page); await submit(page, lang, 'error');
          originalErrorIndex = await page.evaluate(() => history.state.idx);
          assert.equal(await page.evaluate(() => window.__EMAILJS_TEST__.calls.length), 1);
          await toggle(page, lang, 'thank-you');
          if (!csr) { await refresh(page); await ready(page, other, 'thank-you'); }
          await page.getByRole('link', { name: retryName(other), exact: true }).click(); await ready(page, other); await fields(page, values);
          await refresh(page); await ready(page, other); await fields(page, values);
          // Repeated errors belong to the same uncompleted revision.
          await submit(page, other, 'error'); await page.getByRole('link', { name: retryName(other), exact: true }).click();
          await ready(page, other); await fields(page, values);
        });
        const suffix = '?ref=contact-history&ref=second#contact-message';
        await check(`${label}-retry-query-hash-switch-back-forward-refresh`, async () => {
          await page.evaluate(target => { history.replaceState(history.state, '', target); }, url(other, 'contact', suffix));
          await refresh(page); await ready(page, other, 'contact', suffix); await fields(page, values);
          await toggle(page, other, 'contact', suffix); await fields(page, values);
          report.observations.push({ sequence: label + '-switch', ...await page.evaluate(snapshot) });
          await page.goBack(); await ready(page, other, 'contact', suffix); await fields(page, values);
          report.observations.push({ sequence: label + '-back', ...await page.evaluate(snapshot) });
          await page.goForward(); await ready(page, lang, 'contact', suffix); await fields(page, values);
          await refresh(page); await ready(page, lang, 'contact', suffix); await fields(page, values);
        });
        await check(`${label}-success-back-refresh-invalidates-all-fields`, async () => {
          await submit(page, lang, 'success');
          assert.deepEqual(await page.evaluate(() => history.state.usr), { status: 'success' });
          const stored = await page.evaluate(() => ({ session: JSON.stringify(sessionStorage), local: JSON.stringify(localStorage) }));
          for (const value of [values.email, values.message, values.name, values.phone]) { assert.ok(!stored.session.includes(value)); assert.ok(!stored.local.includes(value)); }
          await page.goBack(); await ready(page, other, 'contact', suffix); await fields(page, empty);
          await refresh(page); await ready(page, other, 'contact', suffix); await fields(page, empty);
          await page.waitForFunction(() => !history.state?.usr?.draft);
          report.observations.push({ sequence: label + '-success-back-refresh', ...await page.evaluate(snapshot) });
        });
        await check(`${label}-older-error-result-cannot-offer-completed-retry`, async () => {
          const returnIndex = await page.evaluate(() => history.state.idx);
          await page.evaluate(index => history.go(index - history.state.idx), originalErrorIndex);
          await ready(page, lang); await fields(page, empty);
          await page.waitForFunction(() => !history.state?.usr?.draft);
          await page.evaluate(index => history.go(index - history.state.idx), returnIndex);
          await ready(page, other, 'contact', suffix); await fields(page, empty);
        });
        await check(`${label}-success-result-forward-switch-back-refresh`, async () => {
          await page.goForward(); await ready(page, lang, 'thank-you');
          await toggle(page, lang, 'thank-you');
          await page.goBack(); await ready(page, lang, 'thank-you');
          if (!csr) { await refresh(page); await ready(page, lang, 'thank-you'); }
          assert.deepEqual(await page.evaluate(() => history.state.usr), { status: 'success' });
          await page.goBack(); await ready(page, other, 'contact', suffix); await fields(page, empty);
        });
        await check(`${label}-fresh-retry-after-success`, async () => {
          await fill(page); await submit(page, other, 'error');
          await page.getByRole('link', { name: retryName(other), exact: true }).click(); await ready(page, other); await fields(page, values);
          await refresh(page); await ready(page, other); await fields(page, values);
          assert.deepEqual(errors, []);
        });
        await check(`${label}-unversioned-history-draft-stays-invalid-after-success`, async () => {
          await page.evaluate(values => {
            const { service, ...draft } = values;
            history.replaceState({ ...history.state, usr: { draft: { ...draft, selectedService: service } } }, '', location.href);
          }, values);
          await refresh(page); await ready(page, other); await fields(page, empty);
          await page.waitForFunction(() => !history.state?.usr?.draft);
          assert.deepEqual(errors, []);
        });
      } finally { await ctx.close(); }
      const privateContext = await context(viewport, true), privatePage = await privateContext.newPage();
      try {
        await check(`${label}-storage-denied-same-document-retry-and-safe-refresh`, async () => {
          await privatePage.goto(url(lang)); await ready(privatePage, lang); await fill(privatePage); await submit(privatePage, lang, 'error');
          await privatePage.getByRole('link', { name: retryName(lang), exact: true }).click(); await ready(privatePage, lang); await fields(privatePage, values);
          await refresh(privatePage); await ready(privatePage, lang); await fields(privatePage, empty);
          await privatePage.waitForFunction(() => !history.state?.usr?.draft);
        });
      } finally { await privateContext.close(); }
      const readOnlyContext = await context(viewport, 'write'), readOnlyPage = await readOnlyContext.newPage();
      try {
        await check(`${label}-storage-readable-but-writes-denied`, async () => {
          await readOnlyPage.goto(url(lang)); await ready(readOnlyPage, lang); await fill(readOnlyPage); await submit(readOnlyPage, lang, 'error');
          await readOnlyPage.getByRole('link', { name: retryName(lang), exact: true }).click(); await ready(readOnlyPage, lang); await fields(readOnlyPage, values);
          await submit(readOnlyPage, lang, 'success'); await readOnlyPage.goBack(); await ready(readOnlyPage, lang); await fields(readOnlyPage, empty);
          await refresh(readOnlyPage); await ready(readOnlyPage, lang); await fields(readOnlyPage, empty);
        });
      } finally { await readOnlyContext.close(); }
    }
  }
  assert.equal(report.emailRequests, 0); assert.deepEqual(report.localAssetFailures, []);
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close(); await fixture.close(); console.log(output);
}
console.log(`${report.cases.length} contact history cases passed; ${report.hydrationChecks} hydration/metadata checks.`);
