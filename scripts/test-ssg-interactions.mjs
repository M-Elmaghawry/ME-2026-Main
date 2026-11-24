import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { serve, metrics } from './ssg-browser-utils.mjs';

const output = path.resolve('dist-ssr/candidate'); await mkdir(output, { recursive: true });
const result = { generatedAt: new Date().toISOString(), cases: [], failures: [], fontFailures: [], browser: '', notes: ['All external integrations blocked except Google Fonts. No messages submitted. Local server emulates root custom-404 status handling; deployed Pages responses are not verified.'] };
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', chromiumSandbox: true }); result.browser = await browser.version();
const fonts = new Map();
const services = [];
async function context(viewport = { width: 1440, height: 1000 }, reducedMotion = 'no-preference') {
  const ctx = await browser.newContext({ viewport, reducedMotion }); ctx.setDefaultTimeout(15000);
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
      try {
        if (!fonts.has(url.href)) {
          let response;
          for (let attempt = 0; attempt < 3; attempt++) { try { response = await route.fetch({ timeout: 8000 }); break; } catch (error) { if (attempt === 2) throw error; } }
          const headers = response.headers(); delete headers['content-encoding']; delete headers['content-length'];
          fonts.set(url.href, { status: response.status(), headers, body: await response.body() });
        }
        return route.fulfill(fonts.get(url.href));
      } catch (error) { result.fontFailures.push({ url: url.href, error: error.message }); }
    }
    return route.abort();
  });
  return ctx;
}
async function check(name, action) {
  const row = { name };
  try { row.evidence = await action(); row.status = 'passed'; }
  catch (error) { row.status = 'failed'; row.error = error.stack; result.failures.push({ name, error: error.message }); }
  result.cases.push(row); console.log(`${row.status.toUpperCase()} ${name}`);
  await writeFile(path.join(output, 'interaction-report.json'), JSON.stringify(result, null, 2));
  if (row.status === 'failed') throw new Error(`Validation stopped at ${name}; inspect interaction-report.json`);
}
async function hydrated(page) {
  await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
  const value = await metrics(page); assert.deepEqual(value.recoverableErrors, []); assert.equal(value.bootstrapError, undefined);
  assert.deepEqual(value.counts, { title: 1, description: 1, canonical: 1, alternates: 3, jsonld: 1 }); return value;
}
async function jump(page, url, code = 200) {
  const response = await page.goto(url, { waitUntil: 'load' }); assert.equal(response.status(), code); return hydrated(page);
}
try {
  for (const variant of ['repo', 'root', 'custom']) {
    const report = JSON.parse(await readFile(path.join(output, variant, 'ssr-report.json'), 'utf8'));
    const server = await serve(path.join(output, variant, 'site'), report.base, true); services.push(server);
    const ctx = await context(); const page = await ctx.newPage();
    for (const language of ['ar', 'en']) {
      const prefix = `${report.base}${language === 'en' ? 'en/' : ''}`;
      await check(`${variant}-${language}-direct-and-refresh`, async () => {
        const url = server.origin + prefix + 'services/bim-training/';
        const first = await jump(page, url); assert.equal(first.lang, language); assert.equal(first.rootPreserved, true);
        await page.reload({ waitUntil: 'load' }); const next = await hydrated(page); assert.equal(next.rootPreserved, true); assert.equal(next.lang, language);
        return { rootPreserved: true, url: page.url() };
      });
      await check(`${variant}-${language}-legacy-language-url`, async () => {
        const url = server.origin + report.base + `contact/?lang=${language}&ref=a%26b#form`;
        await page.goto(url); await page.waitForURL(server.origin + prefix + 'contact/?ref=a%26b#form'); const value = await hydrated(page);
        assert.equal(value.lang, language); assert.equal(new URL(page.url()).searchParams.get('ref'), 'a&b'); assert.equal(new URL(page.url()).hash, '#form');
        return { url: page.url(), language: value.lang };
      });
      await check(`${variant}-${language}-404-status-and-content`, async () => {
        const url = server.origin + prefix + 'unknown-page/'; const value = await jump(page, url, 404);
        assert.equal(page.url(), url); assert.equal(value.h1, '404'); assert.equal(value.rootPreserved, true);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
        assert.ok((await page.locator('main').textContent()).includes('Page not found'));
        return { status: 404, language: value.lang, bilingualFallback: true };
      });
      await check(`${variant}-${language}-auxiliary-direct-visit`, async () => {
        await page.goto(server.origin + prefix + 'thank-you/'); await page.waitForURL(server.origin + prefix + 'contact/');
        await page.waitForFunction(() => document.title.startsWith('Contact Us') || document.title.startsWith('تواصل معنا'));
        const value = await hydrated(page); assert.equal(value.lang, language);
        return { redirectedToContact: true, language: value.lang };
      });
    }
    await check(`${variant}-old-spa-link-and-slash-normalization`, async () => {
      const route = `${report.base}portfolio/1/?lang=en&ref=old#gallery`;
      await page.goto(`${server.origin}${report.base}?__spa=${encodeURIComponent(route)}`);
      await page.waitForURL(`${server.origin}${report.base}en/portfolio/1/?ref=old#gallery`); await hydrated(page);
      const response = await page.goto(`${server.origin}${report.base}en/contact`); assert.equal(response.status(), 200);
      assert.equal(new URL(page.url()).pathname, `${report.base}en/contact/`); await hydrated(page);
      return { legacySpaRestored: true, directorySlashNormalized: true };
    });
    await ctx.close();
  }
  const server = services[0], base = '/ME-2026-Main/';
  const desktop = await context(), page = await desktop.newPage();
  await check('desktop-language-switch-navigation-and-history', async () => {
    await jump(page, `${server.origin}${base}services/bim-training/?ref=proof#training-title`);
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.waitForURL(`${server.origin}${base}en/services/bim-training/?ref=proof#training-title`); assert.equal((await hydrated(page)).lang, 'en');
    await page.locator('header nav a').filter({ hasText: /^Contact$/ }).click(); await page.waitForURL(`${server.origin}${base}en/contact/`);
    await page.waitForFunction(() => document.title.startsWith('Contact Us')); assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.goBack(); await page.waitForURL(`**/en/services/bim-training/?ref=proof#training-title`);
    await page.goForward(); await page.waitForURL('**/en/contact/');
    return { localeAndQueryHashPreserved: true, sameLanguageSpa: true, history: true, formDisabled: await page.locator('#contact-name').isDisabled() };
  });
  await check('mobile-radix-menu-and-language-switch', async () => {
    const ctx = await context({ width: 390, height: 844 }); const mobile = await ctx.newPage(); await jump(mobile, `${server.origin}${base}en/services/bim-training/`);
    await mobile.getByRole('button', { name: 'Open navigation menu' }).click(); const dialog = mobile.getByRole('dialog'); await dialog.waitFor({ state: 'visible' });
    await dialog.getByRole('link', { name: 'Contact', exact: true }).click(); await mobile.waitForURL('**/en/contact/'); await dialog.waitFor({ state: 'hidden' });
    await mobile.getByRole('button', { name: 'التبديل إلى العربية' }).click(); await mobile.waitForURL(`${server.origin}${base}contact/`);
    assert.equal((await hydrated(mobile)).lang, 'ar'); await ctx.close(); return { menu: true, languageSwitch: true };
  });
  await check('automatic-home-title-and-about-slideshow', async () => {
    await jump(page, `${server.origin}${base}en/`);
    const before = await page.locator('main [class~="md:h-10"]').textContent();
    await page.waitForFunction(previous => document.querySelector('main [class~="md:h-10"]').textContent !== previous, before, { timeout: 5000 });
    await jump(page, `${server.origin}${base}en/about/`);
    const images = await page.locator('main img').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
    await page.waitForFunction(previous => JSON.stringify(Array.from(document.querySelectorAll('main img'), node => node.getAttribute('src'))) !== JSON.stringify(previous), images, { timeout: 5000 });
    return { automaticTitle: true, automaticSlideshow: true };
  });
  await check('reduced-motion-stops-about-slideshow', async () => {
    const ctx = await context({ width: 1440, height: 1000 }, 'reduce'); const reduced = await ctx.newPage(); await jump(reduced, `${server.origin}${base}en/about/`);
    const before = await reduced.locator('main img').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
    await reduced.waitForTimeout(4500); const after = await reduced.locator('main img').evaluateAll(nodes => nodes.map(node => node.getAttribute('src'))); assert.deepEqual(after, before);
    await ctx.close(); return { preferenceHonored: true };
  });
  for (const language of ['ar', 'en']) {
    const prefix = base + (language === 'en' ? 'en/' : '');
    await check(`reduced-${language}-home-stats-visible-without-scroll`, async () => {
      const ctx = await context({ width: 1440, height: 1000 }, 'reduce'); const reduced = await ctx.newPage();
      try {
        await jump(reduced, server.origin + prefix); await reduced.waitForTimeout(1200);
        const visible = await reduced.locator('main > section').first().locator('.neu-card.text-center').evaluateAll(nodes => nodes.map(element => {
          for (let node = element; node instanceof HTMLElement; node = node.parentElement) if (Number(getComputedStyle(node).opacity) === 0) return false;
          return true;
        }));
        assert.equal(visible.length, 4); assert.ok(visible.every(Boolean));
        assert.equal(await reduced.evaluate(() => scrollY), 0);
        assert.equal(await reduced.getByRole('button', { name: /^(pause|play|resume|speed)$/i }).count(), 0);
        return { allFourStatsReadableWithoutScroll: true, recoverableErrors: (await metrics(reduced)).recoverableErrors };
      } finally { await ctx.close(); }
    });
    await check(`reduced-${language}-service-reveals-resolve-after-hydration`, async () => {
      const ctx = await context({ width: 1440, height: 1000 }, 'reduce'); const reduced = await ctx.newPage();
      try {
        await jump(reduced, server.origin + prefix + 'services/bim-training/'); await reduced.waitForTimeout(1200);
        const state = await reduced.locator('main').evaluate(main => ({
          hidden: [...main.querySelectorAll('[style]')].filter(node => Number(getComputedStyle(node).opacity) === 0).length,
          headingTransform: getComputedStyle(main.querySelector('h1')).transform,
        }));
        assert.equal(state.hidden, 0); assert.equal(state.headingTransform, 'none');
        assert.deepEqual((await metrics(reduced)).recoverableErrors, []);
        return { hiddenContent: 0, headingEntranceOffset: 0, hydrationErrors: 0 };
      } finally { await ctx.close(); }
    });
  }
  await check('course-accordion-and-footer', async () => {
    await jump(page, `${server.origin}${base}en/courses/bim-fundamentals/`);
    const trigger = page.locator('main button[aria-controls][data-state="closed"]').first(); const id = await trigger.getAttribute('aria-controls'); await trigger.click();
    await page.waitForFunction(id => document.querySelector(`[aria-controls="${id}"]`).getAttribute('aria-expanded') === 'true', id);
    await page.locator(`[id="${id}"]`).waitFor({ state: 'visible' }); await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    assert.equal(await page.locator('footer').isVisible(), true); return { accordion: true, footer: true };
  });
  async function stateRoute(state) {
    await page.evaluate(({ state, url }) => { history.pushState({ usr: state, key: 'ssg-test' }, '', url); dispatchEvent(new PopStateEvent('popstate', { state: history.state })); }, { state, url: `${base}en/thank-you/` });
  }
  await check('contact-result-success-and-refresh', async () => {
    await jump(page, `${server.origin}${base}en/contact/`); await stateRoute({ status: 'success' }); await page.getByRole('heading', { name: 'Thank you for contacting us!' }).waitFor();
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
    await page.reload({ waitUntil: 'load' }); await page.getByRole('heading', { name: 'Thank you for contacting us!' }).waitFor(); await hydrated(page);
    return { successState: true, refresh: true, noFakeSubmission: true };
  });
  await check('contact-error-retry-draft-and-refresh', async () => {
    const draft = { name: 'Local SSR test', email: 'local@example.com', phone: '1234567890', company: 'Local test', message: 'Local test draft only.', countryCode: '+20', selectedService: 'bim-training' };
    await stateRoute({ status: 'error', draft }); await page.getByRole('heading', { name: 'Message could not be sent' }).waitFor(); await page.getByRole('link', { name: 'Try again', exact: true }).click();
    await page.waitForURL('**/en/contact/'); assert.equal(await page.locator('#contact-name').inputValue(), draft.name);
    await page.reload({ waitUntil: 'load' }); await hydrated(page);
    await page.waitForFunction(name => document.querySelector('#contact-name')?.value === name, draft.name);
    assert.equal(await page.locator('#contact-name').inputValue(), draft.name, 'Refresh must retain the existing retry draft');
    return { retryDraft: true, refresh: true };
  });
  await desktop.close();
} finally {
  await writeFile(path.join(output, 'interaction-report.json'), JSON.stringify(result, null, 2));
  await browser.close(); for (const service of services) await service.close();
}
assert.deepEqual(result.failures, []); console.log(`Interaction validation: ${result.cases.length} passed.`);
