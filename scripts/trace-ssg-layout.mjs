import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { serve } from './ssg-browser-utils.mjs';

const { values } = parseArgs({ options: { stage: { type: 'string', default: 'before' }, runs: { type: 'string', default: '3' }, 'font-delay': { type: 'string', default: '200' }, variant: { type: 'string', default: 'repo' }, investigate: { type: 'boolean', default: false }, 'assert-budget': { type: 'boolean', default: false } } });
assert.match(values.stage, /^[a-z0-9-]+$/); assert.match(values.variant, /^[a-z0-9-]+$/);
const output = path.resolve('dist-ssr/phase5c2-f', 'layout-' + values.stage); await mkdir(output, { recursive: true });
const config = JSON.parse(await readFile(`dist-ssr/candidate/${values.variant}/ssr-report.json`, 'utf8'));
const candidate = await serve(`dist-ssr/candidate/${values.variant}/site`, config.base, true);
const baseline = await serve('dist-ssr/resume-review-backup-20261124-093527/dist', '/');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
const fonts = new Map();
const report = { generatedAt: new Date().toISOString(), browser: await browser.version(), stage: values.stage, fontDelayMs: Number(values['font-delay']), policy: 'One browser/page at a time; normal motion; no clock mocking, hiding or animation disabling. External font binary responses receive the stated cold-network delay, consistently for baseline/candidate.', cases: [], fontFailures: [] };
const pages = [
  { id: 'ar-workshop3-mobile', language: 'ar', route: '/courses/revit-structure-workshop-03/', viewport: { width: 390, height: 844 } },
  { id: 'en-paid-mobile', language: 'en', route: '/courses/revit-structure-professional-training/', viewport: { width: 390, height: 844 } },
  { id: 'ar-workshop3-desktop', language: 'ar', route: '/courses/revit-structure-workshop-03/', viewport: { width: 1440, height: 1000 } },
];
async function traceStop(cdp, file) {
  const completed = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve)); await cdp.send('Tracing.end');
  const { stream } = await completed; const chunks = [];
  for (;;) { const item = await cdp.send('IO.read', { handle: stream }); chunks.push(Buffer.from(item.data, item.base64Encoded ? 'base64' : 'utf8')); if (item.eof) break; }
  await cdp.send('IO.close', { handle: stream }); await writeFile(file, Buffer.concat(chunks));
}
async function run(doc, kind, iteration, holdJS = false) {
  const ctx = await browser.newContext({ viewport: doc.viewport, reducedMotion: 'no-preference' });
  let release; const gate = new Promise(resolve => { release = resolve; });
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') {
      if (holdJS && url.pathname.endsWith('.js')) await gate;
      return route.continue();
    }
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
      try {
        if (!fonts.has(url.href)) {
          let response;
          for (let attempt = 0; attempt < 3; attempt++) { try { response = await route.fetch({ timeout: 10000 }); break; } catch (error) { if (attempt === 2) throw error; } }
          const headers = response.headers(); delete headers['content-encoding']; delete headers['content-length'];
          fonts.set(url.href, { status: response.status(), headers, body: await response.body() });
        }
        if (url.hostname === 'fonts.gstatic.com') await new Promise(resolve => setTimeout(resolve, Number(values['font-delay'])));
        return route.fulfill(fonts.get(url.href));
      } catch (error) { report.fontFailures.push({ url: url.href, error: error.message }); }
    }
    return route.abort();
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    const probe = window.__LAYOUT_PROBE__ = { shifts: [], events: [], hydratedAt: null, geometry: [] };
    const event = name => probe.events.push({ name, time: performance.now(), fontStatus: document.fonts.status });
    let evidence;
    Object.defineProperty(window, '__SSG_EVIDENCE__', { configurable: true, get: () => evidence, set(value) {
      evidence = value; let hydrated = value.hydrated;
      Object.defineProperty(value, 'hydrated', { configurable: true, enumerable: true, get: () => hydrated, set(next) { if (next && !hydrated) { probe.hydratedAt = performance.now(); event('hydration-complete'); } hydrated = next; } });
    } });
    document.fonts.addEventListener('loading', () => event('fonts-loading'));
    document.fonts.addEventListener('loadingdone', () => event('fonts-loaded'));
    document.addEventListener('DOMContentLoaded', () => event('dom-ready'));
    addEventListener('load', () => event('load'));
    new PerformanceObserver(list => { for (const entry of list.getEntries()) probe.shifts.push({ time: entry.startTime, value: entry.value, recentInput: entry.hadRecentInput, sources: entry.sources.map(source => ({ tag: source.node?.tagName, classes: source.node?.getAttribute?.('class'), id: source.node?.id, text: source.node?.textContent?.slice(0, 100), font: source.node instanceof Element ? getComputedStyle(source.node).fontFamily : null, previous: source.previousRect.toJSON(), current: source.currentRect.toJSON() })) }); }).observe({ type: 'layout-shift', buffered: true });
    const sample = () => {
      const h1 = document.querySelector('h1');
      if (h1) { const rect = h1.getBoundingClientRect(); const last = probe.geometry.at(-1); const next = { time: performance.now(), width: rect.width, height: rect.height, y: rect.y, fonts: document.fonts.status, family: getComputedStyle(h1).fontFamily }; if (!last || last.height !== next.height || last.y !== next.y || last.fonts !== next.fonts) probe.geometry.push(next); }
      if (performance.now() < 8000) requestAnimationFrame(sample);
    }; requestAnimationFrame(sample);
  });
  const cdp = await ctx.newCDPSession(page); await cdp.send('Tracing.start', { categories: 'devtools.timeline,loading,blink.user_timing', transferMode: 'ReturnAsStream' });
  const name = `${kind}-${doc.id}-${iteration}${holdJS ? '-fonts-before-js' : ''}`;
  const url = kind === 'candidate' ? candidate.origin + config.base + (doc.language === 'en' ? 'en/' : '') + doc.route.slice(1) : baseline.origin + doc.route + (doc.language === 'en' ? '?lang=en' : '');
  try {
    await page.goto(url, { waitUntil: holdJS ? 'commit' : 'load' }); await page.locator('h1').waitFor({ state: 'attached' });
    if (holdJS) {
      await page.waitForFunction(() => document.readyState !== 'loading' && parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) >= 24);
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
      await page.evaluate(() => window.__LAYOUT_PROBE__.events.push({ name: 'js-released', time: performance.now(), fontStatus: document.fonts.status })); release();
    }
    if (kind === 'candidate') await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(3000);
    const data = await page.evaluate(() => ({ ...window.__LAYOUT_PROBE__, errors: window.__SSG_EVIDENCE__?.recoverableErrors || [], bootstrapError: window.__SSG_EVIDENCE__?.bootstrapError, imagesWithoutDimensions: [...document.querySelectorAll('img')].filter(img => !img.width || !img.height).map(img => img.getAttribute('src')), resources: performance.getEntriesByType('resource').filter(entry => /fonts|\.css/.test(entry.name)).map(entry => ({ url: entry.name, start: entry.startTime, end: entry.responseEnd })) }));
    let cls = 0, session = 0, start = 0, last = 0;
    for (const shift of data.shifts.filter(x => !x.recentInput)) { if (shift.time - last > 1000 || shift.time - start > 5000) { session = 0; start = shift.time; } session += shift.value; cls = Math.max(cls, session); last = shift.time; }
    const row = { name, kind, route: doc.route, language: doc.language, viewport: doc.viewport, holdJS, cls, ...data }; report.cases.push(row);
    await page.screenshot({ path: path.join(output, name + '.png') }); console.log(`${name}: CLS=${cls.toFixed(6)}`);
  } finally { release(); await traceStop(cdp, path.join(output, name + '.trace.json')); await ctx.close(); await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); }
}
try {
  for (const doc of pages) for (let iteration = 1; iteration <= Number(values.runs); iteration++) for (const kind of ['baseline', 'candidate']) await run(doc, kind, iteration);
  if (values.investigate) for (const doc of pages.slice(0, 2)) await run(doc, 'candidate', 0, true);
  if (values['assert-budget']) {
    const rows = report.cases.filter(row => row.kind === 'candidate' && !row.holdJS);
    report.budget = { target: 0.1, runs: rows.length, maximum: Math.max(...rows.map(row => row.cls)), passed: rows.every(row => row.cls <= 0.1 && !row.errors.length && !row.bootstrapError) && !report.fontFailures.length };
    assert.ok(report.budget.passed, 'Candidate must meet CLS ≤ 0.1 without renderer or font failures');
  }
} finally { await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); await candidate.close(); await baseline.close(); }
