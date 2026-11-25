import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';
import { metrics } from './ssg-browser-utils.mjs';

const { values } = parseArgs({ options: {
  site: { type: 'string', multiple: true }, runs: { type: 'string', default: '7' },
  route: { type: 'string', default: 'both' }, output: { type: 'string', default: 'dist-ssr/phase5c3-d-audit' },
  trace: { type: 'boolean', default: false }, 'probe-adjust': { type: 'string' },
  'probe-fallback': { type: 'string' }, 'no-app-js': { type: 'boolean', default: false }, desktop: { type: 'boolean', default: false },
  'assert-budget': { type: 'boolean', default: false },
  'budget-cohort': { type: 'string' },
  language: { type: 'string', default: 'en' }, reduced: { type: 'boolean', default: false },
} });
assert.ok(values.site?.length); assert.ok(['course', 'training', 'both'].includes(values.route));
const output = path.resolve(values.output); await mkdir(output, { recursive: true });
const base = '/ME-2026-Main/';
assert.ok(['ar', 'en', 'both'].includes(values.language));
const specs = (values.language === 'both' ? ['ar', 'en'] : [values.language]).flatMap(language => [
  { language, name: `${language}-course`, route: `${language === 'en' ? 'en/' : ''}courses/revit-structure-workshop-03/` },
  { language, name: `${language}-training`, route: `${language === 'en' ? 'en/' : ''}services/bim-training/` },
]).filter(spec => values.route === 'both' || spec.name.endsWith(`-${values.route}`));
async function serve(directory) {
  const root = path.resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost'); assert.ok(url.pathname.startsWith(base));
      let file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
      assert.ok(file === root || file.startsWith(root + path.sep));
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const ext = path.extname(file); let bytes = await readFile(file);
      // Diagnostic only: a measured fallback-metric hypothesis, never a score
      // workaround. Unmodified acceptance runs omit this flag entirely.
      if (values['probe-adjust'] && ext === '.html') {
        assert.match(values['probe-adjust'], /^0\.\d+$/);
        bytes = Buffer.from(bytes.toString('utf8').replace('</head>', `<style>:lang(en) main span.cursor-default{font-size-adjust:${values['probe-adjust']}}</style></head>`));
      }
      if (values['probe-fallback'] && ext === '.html') {
        assert.match(values['probe-fallback'], /^\d+(\.\d+)?$/);
        bytes = Buffer.from(bytes.toString('utf8').replace('</head>', `<style>@font-face{font-family:'Inter Workshop Fallback';src:local('Arial');font-style:normal;font-weight:500;size-adjust:${values['probe-fallback']}%}:lang(en) main span.cursor-default{font-family:Inter,'Inter Workshop Fallback',sans-serif}</style></head>`));
      }
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
      const compress = ['.html', '.js', '.css', '.json', '.svg'].includes(ext), body = compress ? gzipSync(bytes) : bytes;
      response.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'max-age=600', ...(compress ? { 'Content-Encoding': 'gzip' } : {}) }); response.end(body);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}
const sites = [];
for (const option of values.site) { const separator = option.indexOf('='); assert.ok(separator > 0); const name = option.slice(0, separator); assert.match(name, /^[a-z0-9-]+$/); sites.push({ name, directory: option.slice(separator + 1), server: await serve(option.slice(separator + 1)) }); }
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true, args: ['--disable-lcd-text'] });
const report = { generatedAt: new Date().toISOString(), browser: await browser.version(), sites: sites.map(({ server, ...site }) => site),
  policy: { runs: Number(values.runs), viewport: values.desktop ? { width: 1440, height: 1000 } : { width: 390, height: 844 }, network: '100ms, 4Mbps down, 1Mbps up', cpu: 4, coldCache: 'fresh context, cleared HTTP cache, normal within-load cache', server: 'same gzip/text and max-age=600 policy', order: 'alternating order for two cohorts; rotated Latin-square order for three cohorts', trace: values.trace, applicationJS: !values['no-app-js'], experimentalAdjustment: values['probe-adjust'] ?? null, experimentalFallback: values['probe-fallback'] ?? null, motion: 'normal; no clock, hiding, animation suppression or preload removal' }, cases: [], failures: [] };
const persist = () => writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
report.policy.rasterization = 'grayscale (--disable-lcd-text), same as Phase 5C.3-C';
report.policy.language = values.language;
if (values.reduced) report.policy.motion = 'prefers-reduced-motion: reduce; separate regression profile';
async function stopTrace(cdp, file) {
  const complete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve)); await cdp.send('Tracing.end');
  const { stream } = await complete; const chunks = [];
  for (;;) { const item = await cdp.send('IO.read', { handle: stream }); chunks.push(Buffer.from(item.data, item.base64Encoded ? 'base64' : 'utf8')); if (item.eof) break; }
  await cdp.send('IO.close', { handle: stream }); await writeFile(file, Buffer.concat(chunks));
}
async function platformFonts(cdp, selector) {
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable'); const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
  return nodeId ? (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts : [];
}
async function run(site, spec, iteration) {
  const ctx = await browser.newContext({ viewport: report.policy.viewport, reducedMotion: values.reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage(), cdp = await ctx.newCDPSession(page), network = new Map(), errors = [];
  await cdp.send('Network.enable'); await cdp.send('Network.setBlockedURLs', { urls: ['https://*', ...(values['no-app-js'] ? ['*/assets/*.js'] : [])] });
  await cdp.send('Network.clearBrowserCache'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 100, downloadThroughput: 500000, uploadThroughput: 125000, connectionType: 'cellular4g' });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  cdp.on('Network.requestWillBeSent', e => network.set(e.requestId, { url: e.request.url, type: e.type, priority: e.request.initialPriority, start: e.timestamp }));
  cdp.on('Network.responseReceived', e => { const row = network.get(e.requestId); if (row) Object.assign(row, { status: e.response.status, timing: e.response.timing, mime: e.response.mimeType, response: e.timestamp }); });
  cdp.on('Network.loadingFinished', e => { const row = network.get(e.requestId); if (row) Object.assign(row, { bytes: e.encodedDataLength, end: e.timestamp }); });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ trace }) => {
    const probe = window.__PERFORMANCE_AUDIT__ = { lcp: [], shifts: [], fontEvents: [], frames: [], longTasks: [], hydratedAt: null };
    let evidence;
    Object.defineProperty(window, '__SSG_EVIDENCE__', { configurable: true, get: () => evidence, set(value) {
      evidence = value; let hydrated = value.hydrated;
      Object.defineProperty(value, 'hydrated', { enumerable: true, configurable: true, get: () => hydrated, set(next) { if (next && !hydrated) { probe.hydratedAt = performance.now(); performance.mark('audit:hydrated'); } hydrated = next; } });
    } });
    new PerformanceObserver(list => { for (const e of list.getEntries()) probe.lcp.push({ time: e.startTime, renderTime: e.renderTime, loadTime: e.loadTime, size: e.size, url: e.url, tag: e.element?.tagName, classes: e.element?.className, text: e.element?.textContent?.slice(0, 150) }); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) probe.shifts.push({ time: e.startTime, value: e.value, recentInput: e.hadRecentInput, interLoaded: document.fonts.check('500 12px Inter', 'Saudi Building Code'), sources: e.sources.map(s => ({ tag: s.node?.tagName, classes: s.node?.getAttribute?.('class'), text: s.node?.textContent?.slice(0, 100), before: s.previousRect.toJSON(), after: s.currentRect.toJSON() })) }); }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) probe.longTasks.push({ start: e.startTime, duration: e.duration }); }).observe({ type: 'longtask', buffered: true });
    for (const name of ['loading', 'loadingdone', 'loadingerror']) document.fonts.addEventListener(name, () => { probe.fontEvents.push({ name, time: performance.now(), interLoaded: document.fonts.check('500 12px Inter', 'Saudi Building Code') }); performance.mark('audit:fonts-' + name); });
    if (trace) {
      const sample = () => {
        const intro = document.querySelector('.bt-intro'), tags = [...document.querySelectorAll('main span.cursor-default')];
        const box = e => e ? { rect: e.getBoundingClientRect().toJSON(), opacity: getComputedStyle(e).opacity, transform: getComputedStyle(e).transform, font: getComputedStyle(e).fontFamily, fontSizeAdjust: getComputedStyle(e).fontSizeAdjust } : null;
        if (intro || tags.length) probe.frames.push({ time: performance.now(), fontStatus: document.fonts.status, interLoaded: document.fonts.check('500 12px Inter', 'Saudi Building Code'), intro: box(intro), tags: tags.map(e => ({ text: e.textContent, ...box(e) })) });
        if (performance.now() < 3000) requestAnimationFrame(sample);
      }; requestAnimationFrame(sample);
    }
  }, { trace: values.trace });
  const name = `${site.name}-${spec.name}-${iteration}`, traceFile = path.join(output, name + '.trace.json');
  if (values.trace) await cdp.send('Tracing.start', { categories: 'devtools.timeline,loading,blink.user_timing,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack', transferMode: 'ReturnAsStream' });
  try {
    let earlyFonts;
    await page.goto(site.server.origin + base + spec.route, { waitUntil: values.trace ? 'commit' : 'load' });
    if (values.trace) {
      const selector = spec.name.endsWith('-course') ? 'main span.cursor-default' : '.bt-intro';
      await page.locator(selector).first().waitFor({ state: 'attached' });
      await page.waitForFunction(({ selector, language }) => getComputedStyle(document.querySelector(selector)).fontFamily.includes(language === 'ar' ? 'Noto' : 'Inter'), { selector, language: spec.language });
      earlyFonts = await platformFonts(cdp, selector);
    }
    await page.waitForLoadState('load');
    if (!values['no-app-js']) await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3500);
    const data = await page.evaluate(() => ({ ...window.__PERFORMANCE_AUDIT__, navigation: performance.getEntriesByType('navigation')[0].toJSON(), resources: performance.getEntriesByType('resource').map(e => ({ url: e.name, type: e.initiatorType, start: e.startTime, responseStart: e.responseStart, end: e.responseEnd, bytes: e.transferSize, size: e.encodedBodySize })), images: [...document.images].map(e => ({ src: e.currentSrc, width: e.width, height: e.height, intrinsicWidth: e.naturalWidth, intrinsicHeight: e.naturalHeight, priority: e.fetchPriority, loading: e.loading, y: e.getBoundingClientRect().y })), metrics: (() => { const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'); ctx.font = '500 2048px Inter'; return { interXAscent: ctx.measureText('x').actualBoundingBoxAscent, units: 2048 }; })() }));
    const evidence = await metrics(page), lcp = data.lcp?.at(-1), ttfb = data.navigation.responseStart;
    const local = [...network.values()].filter(row => row.url.startsWith(site.server.origin));
    const row = { cohort: site.name, name: spec.name, iteration, cls: evidence.cls, lcpMs: lcp?.time, breakdown: { ttfb, resourceLoadDelay: 0, resourceLoadDuration: 0, elementRenderDelay: lcp ? lcp.time - ttfb : null, basis: 'Text LCP using font-display:swap; font and image timings recorded separately, not treated as a required LCP image resource' }, earlyFonts, finalFonts: values.trace ? await platformFonts(cdp, spec.name.endsWith('-course') ? 'main span.cursor-default' : '.bt-intro') : undefined, transferBytes: local.reduce((sum, row) => sum + (row.bytes || 0), 0), network: local, evidence, errors, ...data };
    report.cases.push(row); await persist();
    assert.deepEqual(errors, []); assert.deepEqual(evidence.recoverableErrors, []); assert.equal(evidence.bootstrapError, undefined); assert.ok(local.every(row => !row.status || row.status < 400));
    console.log(`${name}: CLS=${row.cls.toFixed(6)} LCP=${row.lcpMs?.toFixed(0)}ms hydrated=${data.hydratedAt?.toFixed(0)}ms`);
  } finally { if (values.trace) await stopTrace(cdp, traceFile); await ctx.close(); }
}
try {
  for (const spec of specs) for (let iteration = 1; iteration <= Number(values.runs); iteration++) {
    const order = sites.length === 2 ? (iteration % 2 ? sites : [...sites].reverse()) : sites.map((_, i) => sites[(i + iteration - 1) % sites.length]);
    for (const site of order) await run(site, spec, iteration);
  }
  if (values['assert-budget']) {
    const rows = report.cases.filter(row => !values['budget-cohort'] || row.cohort === values['budget-cohort']);
    assert.ok(rows.length, 'Budget cohort must exist');
    for (const row of rows) { assert.ok(row.cls <= 0.1, row.name + ' CLS budget'); assert.ok(row.name !== 'en-training' || row.lcpMs <= 2500, row.name + ' LCP budget'); }
    report.budget = { cohort: values['budget-cohort'] ?? 'all', cases: rows.length, clsMaximum: Math.max(...rows.map(row => row.cls)), lcpMaximum: Math.max(...rows.filter(row => row.name === 'en-training').map(row => row.lcpMs)), passed: true };
  }
} catch (error) { report.failures.push(error.stack); throw error; }
finally { await persist(); await browser.close(); for (const site of sites) await site.server.close(); }
console.log(path.join(output, 'report.json'));
