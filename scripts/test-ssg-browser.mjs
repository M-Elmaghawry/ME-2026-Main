import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { serve, metrics, geometryDifference, imageDifference, normalizeCapture } from './ssg-browser-utils.mjs';

if (process.argv.includes('--extra')) { await import('./test-ssg-interactions.mjs'); process.exit(0); }

const ab = process.argv.includes('--ab');
const clocked = process.argv.includes('--clocked');
const variant = process.argv.includes('--variant') ? process.argv[process.argv.indexOf('--variant') + 1] : 'repo';
assert.match(variant, /^[a-z0-9-]+$/);
const output = path.resolve(ab ? 'dist-ssr/renderer-ab' : `dist-ssr/candidate/${variant}`);
let ssr;
if (ab) {
  const comparison = JSON.parse(await readFile(path.join(output, 'comparison.json'), 'utf8'));
  const boot = comparison.boot;
  let template = await readFile(path.join(output, 'template.html'), 'utf8');
  // Metadata is invariant across the renderer choice; reuse the evaluated head.
  const { JSDOM } = await import('jsdom');
  const server = await import('../dist-ssr/renderer-ab/server/comparison.mjs');
  template = template.replace('<!--SSG_HEAD-->', () => server.metadataHtml(server.pageMetadata('/', 'ar', boot.siteUrl, 'path')))
    .replace('<!--SSG_BODY-->', () => '')
    .replace('__SSG_STATE__', () => JSON.stringify(boot).replace(/</g, '\\u003c'));
  const dom = new JSDOM(template);
  dom.window.document.getElementById('root').innerHTML = await readFile(path.join(output, 'readable.html'), 'utf8');
  await writeFile(path.join(output, 'site/index.html'), dom.serialize()); dom.window.close();
  ssr = { base: boot.base, snapshot: boot.snapshot, documents: [{ id: 'Index', route: '/', language: 'ar', url: boot.base, indexable: true }] };
} else ssr = JSON.parse(await readFile(path.join(output, 'ssr-report.json'), 'utf8'));
const captureMode = `${process.argv.includes('--edge') ? 'edge-' : ''}${process.argv.includes('--tablet') ? 'tablet' : process.argv.includes('--reduced') ? 'reduced' : process.argv.includes('--smoke') ? 'smoke' : 'browser'}`;
const shots = path.join(output, 'screenshots', captureMode); await mkdir(shots, { recursive: true });
const site = await serve(path.join(output, 'site'), ssr.base, !ab);
const baselineDirectory = process.argv.includes('--baseline') ? process.argv[process.argv.indexOf('--baseline') + 1] : 'dist-ssr/resume-review-backup-20261124-093527/dist';
const approved = await serve(baselineDirectory, '/');
const executablePath = process.env.CHROME_PATH || (process.argv.includes('--edge') ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync));
assert.ok(executablePath, 'An installed Chromium browser is required');
const modeName = process.argv.includes('--tablet') ? 'tablet' : process.argv.includes('--reduced') ? 'reduced' : process.argv.includes('--smoke') ? 'smoke' : 'browser';
const reportName = `${/msedge/i.test(executablePath) ? 'edge-' : ''}${modeName}-report.json`;
const result = process.argv.includes('--resume')
  ? JSON.parse(await readFile(path.join(output, reportName), 'utf8'))
  : { generatedAt: new Date().toISOString(), variant, ab, browser: '', networkPolicy: 'Local assets and Google Fonts allowed; Maps/CAPTCHA and all submissions blocked.', fontFailures: [], cases: [], interactions: [], failures: [] };
result.baselineDirectory = baselineDirectory;
if (process.argv.includes('--resume')) {
  result.priorFailures = [...(result.priorFailures || []), ...result.failures];
  result.cases = result.cases.filter(row => row.status === 'passed'); result.failures = [];
  result.resumedAt = new Date().toISOString();
}
const fontCache = new Map();
let browser;
async function context(viewport, options = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: process.argv.includes('--reduced') ? 'reduce' : 'no-preference', ...options });
  ctx.setDefaultTimeout(15000); ctx.setDefaultNavigationTimeout(30000);
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
      try {
        if (!fontCache.has(url.href)) {
          let response;
          for (let attempt = 0; attempt < 3; attempt++) {
            try { response = await route.fetch({ timeout: 8000 }); break; }
            catch (error) { if (attempt === 2) throw error; }
          }
          const headers = response.headers(); delete headers['content-encoding']; delete headers['content-length'];
          fontCache.set(url.href, { status: response.status(), headers, body: await response.body() });
        }
        return route.fulfill(fontCache.get(url.href));
      } catch (error) { result.fontFailures.push({ url: url.href, error: error.message }); }
    }
    return route.abort();
  });
  return ctx;
}
async function open(ctx, url, hydrated, language) {
  const page = await ctx.newPage(); const errors = [], missingAssets = [];
  await page.bringToFront();
  if (clocked) { await page.clock.install({ time: new Date(ssr.snapshot.renderedAt) }); await page.clock.pauseAt(new Date(ssr.snapshot.renderedAt + 1000)); }
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(site.origin) && !response.request().isNavigationRequest()) missingAssets.push(response.url()); });
  const response = await page.goto(url, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  if (clocked && (hydrated || ctx._ssgBaseline)) {
    let ready = false;
    for (let i = 0; i < 200; i++) {
      ready = await page.evaluate(({ hydrated, language }) => hydrated ? !!(window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError) : document.documentElement.lang === language && !!document.querySelector('h1'), { hydrated, language });
      if (ready) break;
      await page.clock.runFor(16);
    }
    assert.ok(ready, 'Clock-controlled page must become ready');
  } else {
    if (hydrated) await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
    else if (ctx._ssgBaseline) await page.waitForFunction(lang => document.documentElement.lang === lang && document.querySelector('h1'), language);
  }
  // Force text layout before awaiting faces: fonts.ready can otherwise resolve
  // before a background/no-JS document has requested its first text faces.
  await page.locator('h1').evaluate(element => element.getBoundingClientRect().width);
  await page.evaluate(() => document.fonts.ready);
  // A disabled-JS document does not run the early font-decode hint. Wait for
  // its first layout to request any additional faces, then measure settled text.
  if (!hydrated && !ctx._ssgBaseline) { await page.waitForTimeout(150); await page.evaluate(() => document.fonts.ready); }
  return { page, errors, missingAssets };
}
async function settle(page) {
  if (!clocked) { await page.waitForTimeout(2400); return; }
  const remaining = ssr.snapshot.renderedAt + 5000 - await page.evaluate(() => Date.now());
  if (remaining > 0) await page.clock.runFor(remaining);
  // Native WAAPI/CSS animations use the browser timeline, not the mocked JS
  // timer. Let finite entrance animations finish before measuring geometry.
  await page.waitForTimeout(2400);
}
function assertHydration(row, expected) {
  assert.deepEqual(row.recoverableErrors, []); assert.equal(row.bootstrapError, undefined);
  assert.equal(row.rootPreserved, true); assert.equal(row.idsPreserved, true);
  assert.equal(row.lang, expected.language); assert.equal(row.dir, expected.language === 'ar' ? 'rtl' : 'ltr');
  assert.deepEqual(row.counts, { title: 1, description: 1, canonical: 1, alternates: 3, jsonld: 1 });
}
try {
  // Match text rasterization across CSR animation layers and static SSR layers.
  // LCD subpixel antialiasing can differ while font/geometry/color are identical.
  browser = await chromium.launch({ headless: true, executablePath, chromiumSandbox: true, args: ['--disable-lcd-text'] }); result.browser = await browser.version();
  result.textRasterization = 'grayscale (--disable-lcd-text)';
  const devices = process.argv.includes('--tablet') ? { tablet: { width: 768, height: 1024 } } : { desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } };
  const representatives = new Set(['/', '/about/', '/services/bim-training/', '/services/bim-coordination/', '/courses/revit-structure-professional-training/', '/portfolio/1/', '/contact/']);
  const subset = process.argv.includes('--tablet') || process.argv.includes('--reduced') || process.argv.includes('--smoke');
  const onlyRoute = process.argv.includes('--route') ? process.argv[process.argv.indexOf('--route') + 1] : null;
  for (const [device, viewport] of Object.entries(devices)) {
    const live = await context(viewport), nojs = await context(viewport, { javaScriptEnabled: false }), baseline = await context(viewport); baseline._ssgBaseline = true;
    for (const doc of ssr.documents.filter(doc => doc.indexable && (!subset || representatives.has(doc.route)) && (!onlyRoute || doc.route === onlyRoute))) {
      const name = `${device}-${doc.language}-${doc.route.replace(/\W/g, '_') || 'home'}`; const row = { name, route: doc.route, language: doc.language, clockControlled: clocked };
      if (result.cases.some(row => row.name === name && row.status === 'passed')) continue;
      try {
        const hydrated = await open(live, site.origin + doc.url, true, doc.language);
        assert.deepEqual(hydrated.errors, []); assert.deepEqual(hydrated.missingAssets, []);
        row.hydrated = await metrics(hydrated.page); assertHydration(row.hydrated, doc);
        await settle(hydrated.page);
        row.hydrated = await metrics(hydrated.page);
        assert.ok(row.hydrated.overflow <= 1, `Settled horizontal overflow: ${row.hydrated.overflow}`);
        const initial = await open(nojs, site.origin + doc.url, false, doc.language); row.initial = await metrics(initial.page);
        assert.equal(await initial.page.locator('h1').evaluate(element => { for (let node = element; node instanceof HTMLElement; node = node.parentElement) if (getComputedStyle(node).opacity === '0' || getComputedStyle(node).display === 'none') return false; return true; }), true, 'No-JavaScript H1 must be visible');
        for (const key of ['h1', 'title', 'description', 'canonical', 'lang', 'dir']) assert.equal(row.initial[key], row.hydrated[key], key);
        assert.deepEqual(result.fontFailures, [], 'Font network failure prevents a valid visual comparison');
        row.initialGeometryDifference = geometryDifference(row.initial.boxes, row.hydrated.boxes); assert.ok(row.initialGeometryDifference <= 1, `SSR/hydration geometry changed: ${row.initialGeometryDifference}`);
        const original = await open(baseline, approved.origin + doc.route + (doc.language === 'en' ? '?lang=en' : ''), false, doc.language);
        await settle(original.page); row.baseline = await metrics(original.page);
        row.geometryDifference = geometryDifference(row.baseline.boxes, row.hydrated.boxes); assert.ok(row.geometryDifference <= 1, `Geometry changed: ${row.geometryDifference}`);
        const before = path.join(shots, `${name}-baseline.png`), after = path.join(shots, `${name}-hydrated.png`);
        await normalizeCapture(original.page, { clocked }); await normalizeCapture(hydrated.page, { clocked });
        row.captureAnimationsNormalized = true;
        row.beforeScreenshot = await hydrated.page.evaluate(() => ({ x: scrollX, y: scrollY, root: document.documentElement.getBoundingClientRect().toJSON() }));
        const originalMask = doc.route === '/' ? [original.page.locator('main [class~="md:h-10"]')] : [];
        const hydratedMask = doc.route === '/' ? [hydrated.page.locator('main [class~="md:h-10"]')] : [];
        row.maskedRegions = doc.route === '/' ? ['automatic profession title; separately interaction-tested'] : [];
        const clip = { x: 0, y: 0, width: viewport.width, height: viewport.height };
        if (doc.route === '/') {
          await original.page.screenshot({ path: before.replace('.png', '-live.png'), animations: 'allow', clip });
          await hydrated.page.screenshot({ path: after.replace('.png', '-live.png'), animations: 'allow', clip });
        }
        await original.page.screenshot({ path: before, animations: 'allow', mask: originalMask, clip }); await hydrated.page.screenshot({ path: after, animations: 'allow', mask: hydratedMask, clip });
        row.screenshots = { baseline: before, hydrated: after };
        row.afterScreenshot = await hydrated.page.evaluate(() => ({ x: scrollX, y: scrollY, root: document.documentElement.getBoundingClientRect().toJSON() }));
        const decorations = () => Array.from(document.querySelectorAll('main .blur-3xl')).slice(0, 3).map(element => ({ style: element.getAttribute('style'), opacity: getComputedStyle(element).opacity, transform: getComputedStyle(element).transform, background: getComputedStyle(element).backgroundColor }));
        row.decorations = { baseline: await original.page.evaluate(decorations), hydrated: await hydrated.page.evaluate(decorations) };
        const paint = () => Array.from(document.querySelectorAll('h1,p,h3')).filter(element => element.getBoundingClientRect().top < innerHeight).map(element => ({ text: element.textContent, chain: Array.from((function* () { for (let node = element; node instanceof HTMLElement; node = node.parentElement) yield node; })()).map(node => { const s = getComputedStyle(node); return { tag: node.tagName, opacity: s.opacity, color: s.color, font: s.font, transform: s.transform }; }) }));
        row.textPaint = { baseline: await original.page.evaluate(paint), hydrated: await hydrated.page.evaluate(paint) };
        row.pixelDifference = await imageDifference(before, after, path.join(shots, `${name}-diff.png`)); assert.ok(row.pixelDifference < 0.025, `Visual change: ${row.pixelDifference}`);
        await initial.page.screenshot({ path: path.join(shots, `${name}-nojs.png`), animations: 'disabled' });
        await initial.page.close(); await original.page.close(); await hydrated.page.close(); row.status = 'passed';
      } catch (error) { row.status = 'failed'; row.error = error.stack; result.failures.push({ name, error: error.message }); }
      result.cases.push(row); await writeFile(path.join(output, reportName), JSON.stringify(result, null, 2));
      console.log(`${row.status.toUpperCase()} ${name}${row.error ? ': ' + row.error.split('\n')[0] : ''}`);
      if (row.status === 'failed') throw Error('Browser acceptance failed; inspect report before continuing');
    }
    await live.close(); await nojs.close(); await baseline.close();
  }
} finally {
  await writeFile(path.join(output, reportName), JSON.stringify(result, null, 2));
  await browser?.close(); await site.close(); await approved.close();
}
assert.deepEqual(result.failures, []); console.log(`Browser validation: ${result.cases.length} passed.`);
