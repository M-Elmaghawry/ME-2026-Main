import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';
import { metrics, normalizeCapture, geometryDifference, imageDifference } from './ssg-browser-utils.mjs';

const { values } = parseArgs({ options: {
  baseline: { type: 'string' }, candidate: { type: 'string', default: 'dist-ssr/candidate/repo/site' },
  output: { type: 'string', default: 'dist-ssr/phase5c3-c-fonts' },
  stage: { type: 'string', default: 'compare' }, runs: { type: 'string', default: '3' },
  filter: { type: 'string' }, 'performance-only': { type: 'boolean', default: false },
  resume: { type: 'boolean', default: false },
} });
assert.ok(values.baseline, 'Pass --baseline <preserved pre-optimization SSG site>');
assert.ok(['before', 'compare'].includes(values.stage));
const output = path.resolve(values.output); await mkdir(output, { recursive: true });
const base = '/ME-2026-Main/';
const specs = ['ar', 'en'].flatMap(language => [
  { language, name: `${language}-home`, route: '/' },
  { language, name: `${language}-training`, route: '/services/bim-training/' },
  { language, name: `${language}-course`, route: '/courses/revit-structure-workshop-03/' },
]);

// Unlike request interception, CDP URL blocking leaves the normal HTTP cache
// enabled. Fresh contexts + clearBrowserCache establish each cold measurement.
async function serve(directory) {
  const root = path.resolve(directory);
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      assert.ok(url.pathname.startsWith(base));
      let file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
      assert.ok(file === root || file.startsWith(root + path.sep));
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const extension = path.extname(file), bytes = await readFile(file);
      const compress = ['.html', '.js', '.css', '.json', '.svg'].includes(extension);
      const body = compress ? gzipSync(bytes) : bytes;
      response.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'max-age=600', ...(compress ? { 'Content-Encoding': 'gzip' } : {}) });
      response.end(body);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}
const before = await serve(values.baseline), after = values.stage === 'compare' ? await serve(values.candidate) : null;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true, args: ['--disable-lcd-text'] });
let report = { generatedAt: new Date().toISOString(), browser: await browser.version(), baseline: values.baseline, candidate: values.candidate,
  policy: { runs: Number(values.runs), viewport: { width: 390, height: 844 }, network: '100ms latency; 4Mbps down/1Mbps up', cpu: '4x', cache: 'fresh context and cleared cache per cold load; normal within-load cache; max-age=600; separate warm reload control', compression: 'identical gzip for text, original WOFF2 bytes', motion: 'normal real-time during performance measurement; clocks normalized only in separate visual checks', window: 'load + fonts.ready + 4000ms', external: 'HTTPS blocked via CDP; no request interception, external services or form submissions' }, cases: [], visuals: [], switches: [], mixedScript: [], failures: [] };
const reportFile = path.join(output, values.stage === 'before' ? 'baseline.json' : 'comparison.json');
if (values.resume) {
  const prior = JSON.parse(await readFile(reportFile, 'utf8'));
  assert.equal(prior.baseline, values.baseline); assert.equal(prior.candidate, values.candidate);
  assert.equal(prior.browser, report.browser); assert.deepEqual(prior.policy, report.policy);
  report = { ...prior, failures: [] };
}
const persist = () => writeFile(reportFile, JSON.stringify(report, null, 2));
const href = (server, spec) => server.origin + base + (spec.language === 'en' ? 'en/' : '') + spec.route.slice(1);
async function prepare(ctx, page, throttled = false) {
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });
  await cdp.send('Network.setBlockedURLs', { urls: ['https://*'] });
  if (throttled) {
    await cdp.send('Network.clearBrowserCache');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 100, downloadThroughput: 500000, uploadThroughput: 125000, connectionType: 'cellular4g' });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  return cdp;
}
async function ready(page) {
  await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
  await page.evaluate(() => document.fonts.ready);
  const evidence = await metrics(page);
  assert.deepEqual(evidence.recoverableErrors, []); assert.equal(evidence.bootstrapError, undefined);
  assert.deepEqual(evidence.counts, { title: 1, description: 1, canonical: 1, alternates: 3, jsonld: 1 });
  return evidence;
}
async function usedFonts(cdp, selectors) {
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument'); const rows = [];
  for (const selector of selectors) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    if (nodeId) rows.push({ selector, ...(await cdp.send('CSS.getPlatformFontsForNode', { nodeId })) });
  }
  return rows;
}
async function measure(server, kind, spec, iteration) {
  const ctx = await browser.newContext({ viewport: report.policy.viewport, reducedMotion: 'no-preference' });
  const page = await ctx.newPage(), cdp = await prepare(ctx, page, true), requests = new Map(), warnings = [], errors = [];
  cdp.on('Network.responseReceived', event => requests.set(event.requestId, { url: event.response.url, type: event.type, status: event.response.status, diskCache: event.response.fromDiskCache, bytes: 0 }));
  cdp.on('Network.loadingFinished', event => { if (requests.has(event.requestId)) requests.get(event.requestId).bytes = event.encodedDataLength; });
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__FONT_PERF__ = { lcp: [], shifts: [], fonts: [] };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__FONT_PERF__.lcp.push({ time: entry.startTime, size: entry.size, element: entry.element?.tagName }); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__FONT_PERF__.shifts.push({ time: entry.startTime, value: entry.value, recentInput: entry.hadRecentInput, sources: entry.sources.map(source => ({ tag: source.node?.tagName, classes: source.node?.getAttribute?.('class'), text: source.node?.textContent?.slice(0, 120), before: source.previousRect.toJSON(), after: source.currentRect.toJSON() })) }); }).observe({ type: 'layout-shift', buffered: true });
    document.fonts.addEventListener('loadingdone', () => window.__FONT_PERF__.fonts.push({ time: performance.now(), event: 'loadingdone' }));
  });
  async function capture(cache) {
    await ready(page); await page.waitForTimeout(4000);
    const evidence = await metrics(page);
    const data = await page.evaluate(() => ({ lcp: window.__FONT_PERF__.lcp.at(-1), shiftSources: window.__FONT_PERF__.shifts, fontEvents: window.__FONT_PERF__.fonts,
      preloads: [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(link => link.href),
      fontCSSRequests: performance.getEntriesByType('resource').filter(entry => /fonts\.googleapis\.com/.test(entry.name)).map(entry => entry.name),
      resources: performance.getEntriesByType('resource').map(entry => ({ url: entry.name, initiator: entry.initiatorType, start: entry.startTime, end: entry.responseEnd, transfer: entry.transferSize, encoded: entry.encodedBodySize })),
      visibleArabicElements: [...document.querySelectorAll('h1,p,button span')].filter(node => /[\u0600-\u06ff]/.test(node.textContent) && node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden').length,
    }));
    const rows = [...requests.values()].filter(row => row.url.startsWith(server.origin));
    const fonts = rows.filter(row => /\.woff2(?:\?|$)/.test(row.url));
    const row = { kind, ...spec, iteration, cache, totalBytes: rows.reduce((sum, row) => sum + row.bytes, 0), fontBytes: fonts.reduce((sum, row) => sum + row.bytes, 0), fonts, requests: rows, warnings, errors, cls: evidence.cls, lcpMs: data.lcp?.time, rootPreserved: evidence.rootPreserved, metadata: evidence.counts, ...data,
      usage: await usedFonts(cdp, ['h1', 'main p', 'main span.cursor-default', 'header button span', 'footer p']) };
    report.cases.push(row); await persist();
    assert.deepEqual(errors, []); assert.ok(rows.every(row => row.status < 400));
    assert.equal(data.fontCSSRequests.length, 0); assert.equal(evidence.rootPreserved, true);
    console.log(`${kind} ${spec.name} ${iteration} ${cache}: bytes=${row.totalBytes} fonts=${row.fontBytes} CLS=${row.cls.toFixed(6)} LCP=${row.lcpMs?.toFixed(0)}`);
  }
  try {
    await page.goto(href(server, spec), { waitUntil: 'load' }); await capture('cold');
    if (spec.name === 'en-training' && iteration === 1) { requests.clear(); warnings.length = 0; await page.reload(); await capture('warm'); }
  } finally { await ctx.close(); }
}
async function visual(spec, viewport, device) {
  const captures = [];
  for (const [kind, server] of [['before', before], ['after', after]]) {
    const ctx = await browser.newContext({ viewport }); const page = await ctx.newPage(); const cdp = await prepare(ctx, page);
    try {
      await page.clock.install({ time: new Date('2026-11-25T10:00:00Z') });
      await page.goto(href(server, spec)); await ready(page); await page.clock.runFor(5000);
      await normalizeCapture(page, { clocked: true });
      const evidence = await metrics(page), file = path.join(output, `${device}-${spec.name}-${kind}.png`);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: viewport.width, height: viewport.height } });
      captures.push({ file, evidence, usage: await usedFonts(cdp, ['h1', 'main p', 'main span.cursor-default', 'header button span', 'footer p']) });
    } finally { await ctx.close(); }
  }
  const pixels = await imageDifference(captures[0].file, captures[1].file, path.join(output, `${device}-${spec.name}-diff.png`));
  const geometry = geometryDifference(captures[0].evidence.boxes, captures[1].evidence.boxes);
  report.visuals.push({ name: `${device}-${spec.name}`, pixelDifference: pixels, geometryPx: geometry, beforeUsage: captures[0].usage, afterUsage: captures[1].usage }); await persist();
  assert.deepEqual(captures[1].usage, captures[0].usage, `Rendered font families/glyph counts changed: ${device}-${spec.name}`);
  assert.ok(pixels <= 0.005 && geometry <= 1, `Visual mismatch ${device}-${spec.name}: pixels=${pixels}, geometry=${geometry}`);
  console.log(`VISUAL ${device}-${spec.name}: pixels=${(pixels * 100).toFixed(3)}% geometry=${geometry}`);
}
async function interactions() {
  for (const spec of specs) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await ctx.newPage(), cdp = await prepare(ctx, page), fontRequests = new Map();
    cdp.on('Network.responseReceived', event => { if (/\.woff2(?:\?|$)/.test(event.response.url)) fontRequests.set(event.requestId, { url: event.response.url, diskCache: event.response.fromDiskCache, bytes: 0 }); });
    cdp.on('Network.loadingFinished', event => { if (fontRequests.has(event.requestId)) fontRequests.get(event.requestId).bytes = event.encodedDataLength; });
    try {
      await page.goto(href(after, spec)); await ready(page);
      const first = await metrics(page);
      fontRequests.clear();
      await page.getByRole('button', { name: spec.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية', exact: true }).click();
      await page.waitForURL(href(after, { ...spec, language: spec.language === 'ar' ? 'en' : 'ar' })); await ready(page);
      const switchRequests = [...fontRequests.values()]; fontRequests.clear();
      await page.goBack(); await page.waitForURL(href(after, spec)); await ready(page);
      const current = await metrics(page); assert.equal(current.lang, spec.language); assert.equal(current.h1, first.h1);
      const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll(links => links.map(link => link.href));
      assert.equal(new Set(preloads).size, preloads.length);
      report.switches.push({ name: spec.name, languageAndBack: true, preloads, switchRequests, backRequests: [...fontRequests.values()] });
      // Test-only mixed-script element inherits the existing body family stack.
      await page.evaluate(() => { const probe = document.createElement('p'); probe.id = 'font-mixed-probe'; probe.textContent = 'English BIM — العربية 123'; document.body.append(probe); });
      await page.evaluate(() => { document.querySelector('#font-mixed-probe').getBoundingClientRect(); return document.fonts.ready; });
      const mixed = await usedFonts(cdp, ['#font-mixed-probe']);
      const families = mixed.flatMap(row => row.fonts.map(font => font.familyName));
      assert.ok(families.some(name => name.includes('Inter')) && families.some(name => name.includes('Noto Sans Arabic')));
      report.mixedScript.push({ name: spec.name, usage: mixed });
    } finally { await ctx.close(); await persist(); }
  }
}
try {
  for (const spec of specs.filter(spec => !values.filter || spec.name === values.filter)) for (let iteration = 1; iteration <= Number(values.runs); iteration++) {
    if (!report.cases.some(row => row.kind === 'before' && row.name === spec.name && row.iteration === iteration && row.cache === 'cold')) await measure(before, 'before', spec, iteration);
    if (after && !report.cases.some(row => row.kind === 'after' && row.name === spec.name && row.iteration === iteration && row.cache === 'cold')) await measure(after, 'after', spec, iteration);
  }
  if (after && !values['performance-only']) {
    report.visuals = []; report.switches = []; report.mixedScript = [];
    for (const [device, viewport] of Object.entries({ mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 1000 } })) for (const spec of specs) await visual(spec, viewport, device);
    await interactions();
  }
  if (after) {
    report.clsBudget = { maximum: Math.max(...report.cases.filter(row => row.kind === 'after').map(row => row.cls)), limit: 0.1 };
    assert.ok(report.clsBudget.maximum <= report.clsBudget.limit, `CLS ${report.clsBudget.maximum} exceeds good range; before/after data retained`);
  }
} catch (error) { report.failures.push(error.stack); throw error; }
finally { await persist(); await browser.close(); await before.close(); await after?.close(); }
console.log(reportFile);
