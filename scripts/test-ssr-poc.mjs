import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const output = path.resolve('dist-ssr/poc');
const ssr = JSON.parse(await readFile(path.join(output, 'ssr-report.json'), 'utf8'));
const shots = path.join(output, 'screenshots');
await mkdir(shots, { recursive: true });

async function serve(directory, base) {
  const root = path.resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      if (!pathname.startsWith(base)) { response.writeHead(404).end(); return; }
      let file = path.resolve(root, decodeURIComponent(pathname.slice(base.length)));
      if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(400).end(); return; }
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(await readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

const prototype = await serve(path.join(output, 'site'), ssr.base);
const approved = await serve('dist', '/');
const executablePath = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!executablePath) throw new Error('Set CHROME_PATH to an installed Chromium browser; no browser is downloaded by this test.');
let browser;
const diagnosticsOnly = process.env.SSR_POC_DIAGNOSTICS_ONLY === '1' || process.argv.includes('--diagnostics-only');
const result = diagnosticsOnly
  ? JSON.parse(await readFile(path.join(output, 'browser-report.json'), 'utf8'))
  : { browser: '', generatedAt: new Date().toISOString(), networkPolicy: 'Local assets and Google Fonts allowed. Maps and CAPTCHA are blocked in tests; no form submissions.', fontFailures: [], cases: [], interactions: [], failures: [] };
const fontCache = new Map();

async function context(viewport, options = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: 'no-preference', ...options });
  ctx.setDefaultTimeout(15000);
  ctx.setDefaultNavigationTimeout(20000);
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
      try {
        if (!fontCache.has(url.href)) {
          const response = await route.fetch({ timeout: 5000 });
          const headers = response.headers();
          delete headers['content-encoding']; delete headers['content-length'];
          fontCache.set(url.href, { status: response.status(), headers, body: await response.body() });
        }
        return route.fulfill(fontCache.get(url.href));
      } catch (error) { result.fontFailures.push({ url: url.href, error: error.message.split('\n')[0] }); }
    }
    await route.abort();
  });
  return ctx;
}

async function ready(page, predicate) {
  for (let i = 0; i < 200; i++) {
    if (await page.evaluate(predicate)) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Browser did not reach the expected hydrated state');
}

async function settledPage(ctx, url, hydrated, language) {
  const page = await ctx.newPage();
  if (!hydrated) await page.addInitScript(() => {
    window.__BASELINE_SHIFTS__ = [];
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__BASELINE_SHIFTS__.push({ value: entry.value, time: entry.startTime, recentInput: entry.hadRecentInput }); }).observe({ type: 'layout-shift', buffered: true });
  });
  const errors = [], missingAssets = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /hydration|hydrate|Minified React|Prototype bootstrap|Prototype hydration/i.test(message.text())) errors.push(message.text());
  });
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1')) missingAssets.push(response.url()); });
  const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  assert.equal(response.status(), 200);
  if (hydrated) await ready(page, () => Boolean(window.__POC_EVIDENCE__?.hydrated || window.__POC_EVIDENCE__?.bootstrapError));
  else await ready(page, () => Boolean(document.querySelector('main h1')));
  if (!hydrated) await ready(page, () => document.documentElement.lang === new URL(window.location.href).searchParams.get('lang') || (document.documentElement.lang === 'ar' && !new URL(window.location.href).searchParams.get('lang')));
  assert.equal(await page.getAttribute('html', 'lang'), language);
  await Promise.race([page.evaluate(() => document.fonts.ready), new Promise(resolve => setTimeout(resolve, 5000))]);
  await new Promise(resolve => setTimeout(resolve, 2400));
  return { page, errors, missingAssets };
}

async function metrics(page) {
  return page.evaluate(() => {
    const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    const evidence = window.__POC_EVIDENCE__;
    const shifts = (evidence?.layoutShifts || window.__BASELINE_SHIFTS__ || []).filter(entry => !entry.recentInput);
    let cls = 0, session = 0, sessionStart = 0, last = 0;
    for (const shift of shifts) {
      if (shift.time - last > 1000 || shift.time - sessionStart > 5000) { session = 0; sessionStart = shift.time; }
      session += shift.value; cls = Math.max(cls, session); last = shift.time;
    }
    return {
      lang: document.documentElement.lang, dir: document.documentElement.dir,
      h1: document.querySelector('h1').textContent.replace(/\s+/g, ' ').trim(),
      title: document.title, description: document.querySelector('meta[name="description"]').content,
      canonical: document.querySelector('link[rel="canonical"]').href,
      metadataCounts: { title: document.querySelectorAll('title').length, description: document.querySelectorAll('meta[name="description"]').length, canonical: document.querySelectorAll('link[rel="canonical"]').length, alternates: document.querySelectorAll('link[hreflang]').length, jsonld: document.querySelectorAll('script[type="application/ld+json"]').length },
      boxes: { h1: box('h1'), main: box('main'), header: box('header') },
      rootPreserved: evidence ? evidence.initialMain === document.querySelector('main') && evidence.initialH1 === document.querySelector('h1') : null,
      idsPreserved: evidence ? evidence.initialIds.every(id => document.getElementById(id)) : null,
      recoverableErrors: evidence?.recoverableErrors || [], bootstrapError: evidence?.bootstrapError,
      labCLS: cls, layoutShifts: shifts,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      loadedFonts: document.fonts.status,
    };
  });
}

async function imageDifference(before, after, name) {
  const a = await sharp(before).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(after).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(a.info.width, b.info.width); assert.equal(a.info.height, b.info.height);
  let changed = 0; const diff = Buffer.alloc(a.data.length);
  for (let i = 0; i < a.data.length; i += 4) {
    const delta = Math.max(...[0, 1, 2].map(channel => Math.abs(a.data[i + channel] - b.data[i + channel])));
    if (delta > 20) changed++;
    diff[i] = delta > 20 ? 255 : 255 - delta; diff[i + 1] = delta > 20 ? 0 : 255 - delta; diff[i + 2] = delta > 20 ? 0 : 255 - delta; diff[i + 3] = 255;
  }
  await sharp(diff, { raw: a.info }).png().toFile(path.join(shots, `${name}-diff.png`));
  return changed / (a.info.width * a.info.height);
}

try {
  browser = await chromium.launch({ headless: true, executablePath, chromiumSandbox: true });
  result.browser = await browser.version();
  for (const [device, viewport] of diagnosticsOnly ? [] : Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const live = await context(viewport), nojs = await context(viewport, { javaScriptEnabled: false }), reduced = await context(viewport, { reducedMotion: 'reduce' });
    for (const doc of ssr.documents) {
      const name = `${device}-${doc.language}-${doc.id}`;
      const row = { name, ssr: doc.ssr };
      try {
        console.log(`CHECK ${name}: initial HTML without JavaScript`);
        const staticPage = await nojs.newPage();
        assert.equal((await staticPage.goto(prototype.origin + doc.url, { waitUntil: 'load' })).status(), 200);
        await Promise.race([staticPage.evaluate(() => document.fonts.ready), new Promise(resolve => setTimeout(resolve, 5000))]);
        row.initial = await metrics(staticPage);
        assert.equal(await staticPage.locator('h1').evaluate(element => { for (let node = element; node && node instanceof HTMLElement; node = node.parentElement) if (getComputedStyle(node).opacity === '0' || getComputedStyle(node).display === 'none') return false; return true; }), true, 'Important heading must be visible with JavaScript disabled');
        await staticPage.screenshot({ path: path.join(shots, `${name}-ssr-nojs.png`), animations: 'disabled' });
        await staticPage.close();
        console.log(`CHECK ${name}: hydration`);
        const hydrated = await settledPage(live, prototype.origin + doc.url, true, doc.language);
        row.hydrated = await metrics(hydrated.page);
        assert.deepEqual(hydrated.errors, []);
        assert.deepEqual(hydrated.missingAssets, []);
        assert.deepEqual(row.hydrated.recoverableErrors, []);
        assert.equal(row.hydrated.bootstrapError, undefined);
        assert.equal(row.hydrated.rootPreserved, true);
        assert.equal(row.hydrated.idsPreserved, true);
        assert.deepEqual(row.hydrated.metadataCounts, { title: 1, description: 1, canonical: 1, alternates: 3, jsonld: 1 });
        for (const key of ['h1', 'title', 'description', 'canonical', 'lang', 'dir']) assert.equal(row.hydrated[key], row.initial[key], key);
        row.maxInitialGeometryDifference = Math.max(...Object.keys(row.initial.boxes).flatMap(selector => Object.keys(row.initial.boxes[selector]).map(key => Math.abs(row.initial.boxes[selector][key] - row.hydrated.boxes[selector][key]))));
        assert.ok(row.maxInitialGeometryDifference <= 1, `Initial SSR layout changed by ${row.maxInitialGeometryDifference}px during hydration`);
        await hydrated.page.screenshot({ path: path.join(shots, `${name}-hydrated.png`), animations: 'disabled' });
        const baselineUrl = `${approved.origin}${doc.route}${doc.language === 'en' ? '?lang=en' : ''}`;
        const baseline = await settledPage(live, baselineUrl, false, doc.language);
        row.approved = await metrics(baseline.page);
        await baseline.page.screenshot({ path: path.join(shots, `${name}-approved-csr.png`), animations: 'disabled' });
        row.designPixelDifference = await imageDifference(path.join(shots, `${name}-approved-csr.png`), path.join(shots, `${name}-hydrated.png`), name);
        row.maxGeometryDifference = Math.max(...Object.keys(row.approved.boxes).flatMap(selector => Object.keys(row.approved.boxes[selector]).map(key => Math.abs(row.approved.boxes[selector][key] - row.hydrated.boxes[selector][key]))));
        assert.equal(row.hydrated.h1, row.approved.h1);
        assert.ok(row.maxGeometryDifference <= 1, `Layout geometry changed by ${row.maxGeometryDifference}px`);
        assert.ok(row.designPixelDifference < 0.025, `Design pixel difference ${row.designPixelDifference}`);
        await baseline.page.close(); await hydrated.page.close();
        const preference = await settledPage(reduced, prototype.origin + doc.url, true, doc.language);
        row.reduced = await metrics(preference.page);
        assert.deepEqual(preference.errors, []); assert.deepEqual(row.reduced.recoverableErrors, []);
        assert.equal(row.reduced.rootPreserved, true);
        await preference.page.close();
        row.status = 'passed';
      } catch (error) { row.status = 'failed'; row.error = error.stack; result.failures.push({ name, error: error.message }); }
      result.cases.push(row);
      await writeFile(path.join(output, 'browser-report.json'), JSON.stringify(result, null, 2));
      console.log(`${row.status.toUpperCase()} ${name}${row.error ? ': ' + row.error.split('\n')[0] : `; geometry=${row.maxGeometryDifference.toFixed(3)}px; pixels=${(row.designPixelDifference * 100).toFixed(3)}%; CLS=${row.hydrated.labCLS}`}`);
    }
    await live.close(); await nojs.close(); await reduced.close();
  }
  // Exercise actual language-switcher and SPA anchors separately from screenshots.
  const ctx = await context({ width: 1440, height: 1000 });
  const page = await ctx.newPage();
  await page.goto(`${prototype.origin}${ssr.base}services/bim-training/?ref=proof#training-title`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__POC_EVIDENCE__?.hydrated);
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page.waitForURL(`**${ssr.base}en/services/bim-training/?ref=proof#training-title`);
  await page.waitForFunction(() => window.__POC_EVIDENCE__?.hydrated);
  assert.equal(await page.getAttribute('html', 'lang'), 'en');
  await page.locator('header nav a').filter({ hasText: /^Contact$/ }).click();
  await page.waitForURL(`**${ssr.base}en/contact/`);
  await page.waitForFunction(() => document.title.startsWith('Contact Us'));
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__POC_EVIDENCE__?.hydrated);
  assert.equal(await page.getAttribute('html', 'dir'), 'ltr');
  const nameInput = page.getByRole('textbox', { name: 'Name (required)' });
  const baselineContact = await settledPage(ctx, `${approved.origin}/contact/?lang=en`, false, 'en');
  const disabled = await nameInput.isDisabled();
  assert.equal(disabled, await baselineContact.page.getByRole('textbox', { name: 'Name (required)' }).isDisabled(), 'Keep existing contact configuration behavior');
  if (disabled) result.interactions.push('Contact form intentionally disabled in both builds because EmailJS is not configured locally; live submission and editable-field interaction remain unverified.');
  else {
    await nameInput.fill('Local hydration test');
    assert.equal(await nameInput.inputValue(), 'Local hydration test');
    result.interactions.push('Non-submitting contact field interaction passed.');
  }
  await baselineContact.page.close();
  await page.goBack({ waitUntil: 'load' });
  assert.ok(page.url().includes('/en/services/bim-training/'));
  await page.goForward({ waitUntil: 'load' });
  assert.ok(page.url().includes('/en/contact/'));
  result.interactions.push('Desktop language switch, query/hash preservation, SPA navigation, refresh, and history passed.');
  await ctx.close();
  const mobileContext = await context({ width: 390, height: 844 });
  const mobile = await settledPage(mobileContext, `${prototype.origin}${ssr.base}en/services/bim-training/`, true, 'en');
  await mobile.page.getByRole('button', { name: 'Open navigation menu' }).click();
  const dialog = mobile.page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible' });
  await dialog.getByRole('link', { name: 'Contact', exact: true }).click();
  await mobile.page.waitForURL(`**${ssr.base}en/contact/`);
  await dialog.waitFor({ state: 'hidden' });
  await mobile.page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
  await mobile.page.waitForURL(`**${ssr.base}contact/`);
  await mobile.page.waitForFunction(() => window.__POC_EVIDENCE__?.hydrated);
  assert.equal(await mobile.page.getAttribute('html', 'dir'), 'rtl');
  assert.deepEqual((await metrics(mobile.page)).recoverableErrors, []);
  result.interactions.push('Mobile Radix menu, SPA navigation, and English-to-Arabic language switching passed.');
  await mobileContext.close();
  // Separate font/loading shifts from hydration: hold all application JavaScript
  // until the server DOM and real fonts have settled, then release it unchanged.
  result.diagnostics = [];
  result.diagnosticStatus = 'running';
  for (const id of ['home', 'course']) {
    console.log(`DIAGNOSTIC ${id}: fonts before JavaScript, then hydration and interaction`);
    const doc = ssr.documents.find(item => item.id === id && item.language === 'en');
    const ctx = await context({ width: 1440, height: 1000 });
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await ctx.route('**/*.js', async route => { await gate; await route.fallback(); });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      window.__POC_DIAGNOSTIC__ = { phase: 'before-application-js', shifts: [] };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__POC_DIAGNOSTIC__.shifts.push({
          phase: window.__POC_DIAGNOSTIC__.phase, value: entry.value,
          fontStatus: document.fonts.status,
          sources: entry.sources.map(source => ({ tag: source.node?.tagName, className: source.node?.getAttribute?.('class'), previous: source.previousRect.toJSON(), current: source.currentRect.toJSON() })),
        });
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(prototype.origin + doc.url, { waitUntil: 'commit' });
    await page.locator('h1').waitFor({ state: 'attached' });
    await page.waitForFunction(() => document.readyState !== 'loading' && parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) > 30);
    await page.evaluate(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 350));
    assert.equal(await page.evaluate(() => Boolean(window.__POC_EVIDENCE__?.hydrated)), false);
    await page.evaluate(() => { window.__POC_DIAGNOSTIC__.phase = 'after-application-js'; });
    release();
    await page.waitForFunction(() => window.__POC_EVIDENCE__?.hydrated);
    await new Promise(resolve => setTimeout(resolve, 2400));
    const diagnostic = { id, ...(await page.evaluate(() => window.__POC_DIAGNOSTIC__)) };
    result.diagnostics.push(diagnostic);
    assert.equal((await metrics(page)).rootPreserved, true);
    assert.deepEqual((await metrics(page)).recoverableErrors, []);
    if (id === 'home') {
      const title = page.locator('main [class~="md:h-10"]');
      const before = await title.textContent();
      await page.waitForFunction(previous => document.querySelector('main [class~="md:h-10"]').textContent !== previous, before, { timeout: 4500 });
      diagnostic.automaticTitleTransition = 'passed';
    } else {
      const trigger = page.locator('main button[aria-controls][data-state="closed"]').first();
      const controlled = await trigger.getAttribute('aria-controls');
      await trigger.click();
      await page.waitForFunction(id => document.querySelector(`[aria-controls="${id}"]`).getAttribute('aria-expanded') === 'true', controlled);
      assert.equal(await page.locator(`[aria-controls="${controlled}"]`).getAttribute('aria-expanded'), 'true');
      await page.locator(`[id="${controlled}"]`).waitFor({ state: 'visible' });
      diagnostic.radixAccordion = 'passed';
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 750));
    assert.equal(await page.locator('footer').isVisible(), true);
    diagnostic.scrolledFooter = 'passed';
    console.log(`DIAGNOSTIC ${id}: passed`);
    await ctx.close();
  }
  result.diagnosticStatus = 'passed';
} finally {
  result.interactions = [...new Set(result.interactions)];
  await writeFile(path.join(output, 'browser-report.json'), JSON.stringify(result, null, 2));
  await browser?.close(); await prototype.close(); await approved.close();
}
assert.equal(result.failures.length, 0, JSON.stringify(result.failures));
console.log(`Browser proof: ${result.cases.length}/20 desktop/mobile cases passed, including reduced motion and JavaScript-disabled checks.`);
