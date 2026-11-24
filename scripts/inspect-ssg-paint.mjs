import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { serve, normalizeCapture, imageDifference } from './ssg-browser-utils.mjs';

const output = path.resolve('dist-ssr/phase5c2-f/paint'); await mkdir(output, { recursive: true });
const candidate = await serve('dist-ssr/candidate/repo/site', '/ME-2026-Main/');
const baseline = await serve('dist-ssr/resume-review-backup-20261124-093527/dist', '/');
const report = { generatedAt: new Date().toISOString(), cases: [], fontFailures: [] };
const cache = new Map();
function snapshot() {
  const root = document.querySelector('main section');
  const names = ['color', 'backgroundColor', 'backgroundImage', 'opacity', 'filter', 'backdropFilter', 'transform', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'boxShadow', 'borderRadius'];
  const elements = [document.documentElement, document.body, root, ...root.querySelectorAll('*')];
  const graph = {};
  for (const element of elements) {
    const rect = element.getBoundingClientRect(); if (rect.top > innerHeight || rect.bottom < 0) continue;
    const style = getComputedStyle(element); const key = `${element.tagName}|${element.getAttribute('class')}|${element.children.length ? '' : element.textContent.slice(0, 100)}`;
    graph[key] = { box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, ...Object.fromEntries(names.map(name => [name, style[name]])) };
  }
  const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
  const metrics = [];
  for (const family of ['Inter', 'Noto Sans Arabic']) for (const weight of [400, 700]) for (const text of [family === 'Inter' ? 'Revit Structure & Architecture Course' : 'طبّق على مبنى سكني من دورين وروف', 'Structural Modeling', 'Templates']) {
    const measure = font => { context.font = `${weight} 100px "${font}"`; const m = context.measureText(text); return { width: m.width, ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent }; };
    const actual = measure(family), fallback = measure('Arial'); metrics.push({ family, weight, text, actual, fallback, widthRatio: actual.width / fallback.width });
  }
  return { graph, metrics, scrollX, scrollY, viewport: { width: innerWidth, height: innerHeight }, fonts: [...document.fonts].map(font => ({ family: font.family, weight: font.weight, status: font.status })), recoverableErrors: window.__SSG_EVIDENCE__?.recoverableErrors || [] };
}
try {
  for (const spec of [
    { name: 'reduced-ar-home', edge: false, language: 'ar', route: '/', reduced: true },
    { name: 'edge-en-training', edge: true, language: 'en', route: '/services/bim-training/', reduced: false },
  ]) {
    const browser = await chromium.launch({ executablePath: spec.edge ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: spec.reduced ? 'reduce' : 'no-preference' });
    await ctx.route('**/*', async route => {
      const url = new URL(route.request().url()); if (url.hostname === '127.0.0.1') return route.continue();
      if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
        try {
          if (!cache.has(url.href)) {
            const response = await route.fetch({ timeout: 15000 }); const headers = response.headers(); delete headers['content-encoding']; delete headers['content-length']; cache.set(url.href, { status: response.status(), headers, body: await response.body() });
          }
          return route.fulfill(cache.get(url.href));
        } catch (error) { report.fontFailures.push({ url: url.href, error: error.message }); }
      }
      return route.abort();
    });
    const row = { ...spec, browser: await browser.version() }; const pages = {};
    for (const kind of ['baseline', 'candidate']) {
      const page = await ctx.newPage(); pages[kind] = page;
      await page.goto(kind === 'candidate' ? candidate.origin + '/ME-2026-Main/' + (spec.language === 'en' ? 'en/' : '') + spec.route.slice(1) : baseline.origin + spec.route + (spec.language === 'en' ? '?lang=en' : ''));
      if (kind === 'candidate') await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated);
      else await page.waitForFunction(() => document.querySelector('h1'));
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(2400);
    }
    for (const kind of ['baseline', 'candidate']) {
      const page = pages[kind]; await page.bringToFront(); await normalizeCapture(page);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const cdp = await ctx.newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable'); const { root } = await cdp.send('DOM.getDocument'); const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'h1' });
      row[kind] = { ...await page.evaluate(snapshot), platformFonts: (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts };
      await page.screenshot({ path: path.join(output, `${spec.name}-${kind}.png`), animations: 'allow', mask: spec.route === '/' ? [page.locator('main [class~="md:h-10"]')] : [] });
    }
    row.graphDifferences = Object.entries(row.candidate.graph).flatMap(([key, value]) => { const old = row.baseline.graph[key]; if (!old) return [{ key, missingInBaseline: true }]; const changed = Object.keys(value).filter(prop => JSON.stringify(value[prop]) !== JSON.stringify(old[prop])); return changed.length ? [{ key, changed, baseline: Object.fromEntries(changed.map(prop => [prop, old[prop]])), candidate: Object.fromEntries(changed.map(prop => [prop, value[prop]])) }] : []; });
    row.pixelDifference = await imageDifference(path.join(output, `${spec.name}-baseline.png`), path.join(output, `${spec.name}-candidate.png`), path.join(output, `${spec.name}-diff.png`));
    report.cases.push(row); await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); console.log(`${spec.name}: pixels=${row.pixelDifference}, differing nodes=${row.graphDifferences.length}`); await browser.close();
  }
} finally { await candidate.close(); await baseline.close(); }
