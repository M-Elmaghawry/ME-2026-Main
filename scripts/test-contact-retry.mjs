import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { serve, metrics } from './ssg-browser-utils.mjs';

const output = path.resolve('dist-ssr/phase5c2-f'); await mkdir(output, { recursive: true });
const baseline = await serve('dist-ssr/resume-review-backup-20261124-093527/dist', '/');
const fixture = await serve('dist-ssr/candidate/contact-fixture/site', '/ME-2026-Main/', true);
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
const report = { browser: await browser.version(), generatedAt: new Date().toISOString(), cases: [], failures: [], realEmailRequests: 0 };
async function check(name, action) {
  try { const evidence = await action(); report.cases.push({ name, status: 'passed', evidence }); console.log('PASSED ' + name); }
  catch (error) { report.failures.push({ name, error: error.stack }); console.log('FAILED ' + name); throw error; }
  finally { await writeFile(path.join(output, 'contact-report.json'), JSON.stringify(report, null, 2)); }
}
async function context() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname.includes('emailjs')) report.realEmailRequests++;
    return route.abort();
  });
  return ctx;
}
const draft = { name: 'Local retry fixture', email: 'fixture@example.invalid', phone: '501234567', company: 'Local fixture', message: 'A local mocked message for retry validation.', countryCode: '+966', selectedService: 'bim-training' };
const expected = { name: draft.name, email: draft.email, phone: draft.phone, company: draft.company, message: draft.message, countryCode: draft.countryCode, service: draft.selectedService };
async function fields(page) { return page.locator('form').evaluate(form => Object.fromEntries(['name', 'email', 'phone', 'company', 'message', 'countryCode', 'service'].map(name => [name, form.querySelector(`[name="${name}"]`).value]))); }
async function ready(page) {
  await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated);
  const evidence = await metrics(page); assert.deepEqual(evidence.recoverableErrors, []); assert.equal(evidence.bootstrapError, undefined); return evidence;
}
try {
  for (const language of ['ar', 'en']) {
    await check(`production-baseline-${language}-retry-refresh`, async () => {
      const ctx = await context(), page = await ctx.newPage();
      await page.goto(`${baseline.origin}/contact/${language === 'en' ? '?lang=en' : ''}`);
      await page.locator('#contact-name').waitFor();
      await page.evaluate(draft => history.replaceState({ usr: { draft }, key: 'baseline-retry' }, '', location.href), draft);
      await page.reload(); await page.waitForFunction(name => document.querySelector('#contact-name')?.value === name, draft.name);
      assert.deepEqual(await fields(page), expected); await ctx.close(); return { historyRetainsDraft: true, allExpectedFieldsRecovered: true };
    });
    const ctx = await context(), page = await ctx.newPage();
    const prefix = `/ME-2026-Main/${language === 'en' ? 'en/' : ''}`;
    await check(`candidate-${language}-initial-contact-and-mocked-failure`, async () => {
      const response = await page.goto(fixture.origin + prefix + 'contact/'); const html = await response.text();
      assert.ok(!html.includes(draft.email)); assert.ok(!html.includes(draft.name));
      await ready(page); assert.equal(await page.locator('#contact-name').inputValue(), '');
      assert.equal(await page.locator('#contact-name').isDisabled(), false);
      for (const name of ['name', 'email', 'phone', 'company', 'message']) await page.locator(`[name="${name}"]`).fill(draft[name]);
      await page.locator('[name="countryCode"]').selectOption(draft.countryCode); await page.locator('[name="service"]').selectOption(draft.selectedService);
      await page.locator('button[type="submit"]').click(); await page.waitForURL(fixture.origin + prefix + 'thank-you/');
      await page.getByRole('heading', { name: language === 'en' ? 'Message could not be sent' : 'فشل إرسال الرسالة', exact: true }).waitFor();
      assert.equal(await page.evaluate(() => window.__EMAILJS_TEST__.calls.length), 1);
      const stored = await page.evaluate(() => history.state.usr);
      assert.equal(stored.status, 'error'); assert.deepEqual(stored.draft, draft);
      assert.ok(!('captchaToken' in stored.draft)); assert.ok(!new URL(page.url()).search);
      return { mockedFailure: true, noDraftInStaticHtml: true, historyOnly: true };
    });
    await check(`candidate-${language}-retry-refresh-recovers-after-hydration`, async () => {
      await page.getByRole('link', { name: language === 'en' ? 'Try again' : 'حاول مرة أخرى', exact: true }).click();
      await page.waitForURL(fixture.origin + prefix + 'contact/'); assert.deepEqual(await fields(page), expected);
      let release; const gate = new Promise(resolve => { release = resolve; });
      await page.route('**/*.js', async route => { await gate; await route.continue(); });
      const response = await page.reload({ waitUntil: 'commit' });
      await page.locator('#contact-name').waitFor({ state: 'attached' });
      assert.equal(await page.locator('#contact-name').inputValue(), '', 'SSR remains private and empty');
      assert.equal(await page.evaluate(() => history.state.usr.draft.email), draft.email, 'History is retained during refresh');
      assert.ok(!(await response.text()).includes(draft.email)); release();
      const evidence = await ready(page);
      await page.unrouteAll({ behavior: 'wait' });
      await page.waitForFunction(name => document.querySelector('#contact-name')?.value === name, draft.name);
      assert.deepEqual(await fields(page), expected); assert.equal(evidence.rootPreserved, true);
      await page.locator('#contact-name').fill('Edited after recovery'); await page.locator('#contact-company').fill('Edited company');
      assert.equal(await page.locator('#contact-name').inputValue(), 'Edited after recovery', 'A later render must not reset edited fields');
      return { allFieldsRecovered: true, hydrationErrors: 0, rootPreserved: true, laterEditsPreserved: true };
    });
    await check(`candidate-${language}-successful-retry-clears-temporary-draft`, async () => {
      await page.evaluate(() => { window.__EMAILJS_TEST__.outcome = 'success'; });
      await page.locator('button[type="submit"]').click(); await page.waitForURL(fixture.origin + prefix + 'thank-you/');
      await page.getByRole('heading', { name: language === 'en' ? 'Thank you for contacting us!' : 'شكرًا لتواصلك معنا!', exact: true }).waitFor();
      const state = await page.evaluate(() => history.state.usr); assert.deepEqual(state, { status: 'success' });
      assert.equal(await page.evaluate(() => window.__EMAILJS_TEST__.calls.length), 1);
      await page.goBack(); await page.waitForURL(fixture.origin + prefix + 'contact/');
      await page.waitForFunction(() => document.querySelector('#contact-name'));
      assert.equal(await page.locator('#contact-name').inputValue(), '');
      const storage = await page.evaluate(() => ({ local: JSON.stringify(localStorage), session: JSON.stringify(sessionStorage), state: history.state?.usr }));
      assert.ok(!storage.state?.draft); assert.ok(!storage.local.includes(draft.email)); assert.ok(!storage.session.includes(draft.email));
      await ctx.close(); return { successfulRetryReplacesRecoveryEntry: true, noDraftInCurrentHistory: true, noDraftStorage: true };
    });
    await check(`candidate-${language}-retry-language-switch-retains-history-only`, async () => {
      const ctx = await context(), page = await ctx.newPage(); await page.goto(fixture.origin + prefix + 'contact/'); await ready(page);
      await page.evaluate(draft => history.replaceState({ ...history.state, usr: { draft } }, '', location.href), draft);
      await page.reload(); await ready(page); await page.waitForFunction(name => document.querySelector('#contact-name')?.value === name, draft.name);
      await page.getByRole('button', { name: language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية' }).click();
      const otherPrefix = `/ME-2026-Main/${language === 'ar' ? 'en/' : ''}`;
      await page.waitForURL(fixture.origin + otherPrefix + 'contact/'); await ready(page);
      await page.waitForFunction(name => document.querySelector('#contact-name')?.value === name, draft.name);
      assert.deepEqual(await fields(page), expected); assert.ok(!page.url().includes(draft.name));
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      await ctx.close(); return { counterpartDocumentLoaded: true, allFieldsPreserved: true, noNewPersistence: true };
    });
  }
  assert.equal(report.realEmailRequests, 0);
} finally { await writeFile(path.join(output, 'contact-report.json'), JSON.stringify(report, null, 2)); await browser.close(); await baseline.close(); await fixture.close(); }
