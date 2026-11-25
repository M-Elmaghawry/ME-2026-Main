import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { serve, metrics } from './ssg-browser-utils.mjs';

const { values } = parseArgs({ options: { site: { type: 'string', default: 'dist-ssr/candidate/repo/site' }, width: { type: 'string' }, output: { type: 'string', default: 'dist-ssr/phase5c3-d-course-layout' } } });
const output = path.resolve(values.output); await mkdir(output, { recursive: true });
const base = '/ME-2026-Main/', server = await serve(values.site, base, true);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
const report = { browser: await browser.version(), site: values.site, policy: 'Controlled font handoff regression, not a performance score. Inter held only until fallback geometry is recorded; acceptance benchmarks use unmodified network timing.', cases: [], failures: [] };
const persist = () => writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
const snapshot = () => {
  const tags = [...document.querySelectorAll('main span.cursor-default')];
  return { family: getComputedStyle(tags[0]).fontFamily, rows: new Set(tags.map(tag => tag.getBoundingClientRect().y)).size, text: tags.map(tag => tag.textContent), sizes: tags.map(tag => ({ width: tag.getBoundingClientRect().width, height: tag.getBoundingClientRect().height, clipped: tag.scrollWidth > tag.clientWidth + 1 })), interLoaded: document.fonts.check('500 12px Inter', 'Saudi Building Code') };
};
try {
  for (const width of values.width ? [Number(values.width)] : [320, 360, 375, 390, 414, 428, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    let release; const gate = new Promise(resolve => { release = resolve; });
    await ctx.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== '127.0.0.1') return route.abort();
      if (/\/inter-latin-[a-f\d]+-.*\.woff2$/.test(url.pathname)) await gate;
      return route.continue();
    });
    const page = await ctx.newPage();
    try {
      await page.goto(server.origin + base + 'en/courses/revit-structure-workshop-03/', { waitUntil: 'commit' });
      await page.waitForFunction(() => { const tag = document.querySelector('main span.cursor-default'); return tag && getComputedStyle(tag).fontFamily.includes('Inter') && getComputedStyle(tag).fontSize === '12px' && !document.fonts.check('500 12px Inter', 'Saudi Building Code'); });
      // Allow the local fallback to resolve without waiting for held Inter.
      await page.waitForTimeout(150);
      const fallback = await page.evaluate(snapshot); release();
      await page.waitForLoadState('load'); await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated);
      const loaded = await page.evaluate(snapshot), evidence = await metrics(page);
      report.cases.push({ name: `font-handoff-${width}`, fallback, loaded }); await persist();
      assert.equal(fallback.interLoaded, false); assert.equal(loaded.interLoaded, true);
      assert.deepEqual(fallback.text, loaded.text); assert.equal(fallback.rows, loaded.rows, `Font swap changes badge rows at ${width}px`);
      assert.ok([...fallback.sizes, ...loaded.sizes].every(size => !size.clipped));
      assert.deepEqual(evidence.recoverableErrors, []); assert.equal(evidence.bootstrapError, undefined);
      console.log(`PASSED font-handoff-${width}: ${fallback.rows} rows remain ${loaded.rows}`);
    } finally { release(); await ctx.close(); }
  }
  if (!values.width) {
    const docs = JSON.parse(await readFile('dist-ssr/candidate/repo/ssr-report.json', 'utf8')).documents.filter(doc => doc.id === 'CourseDetail');
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const page = await ctx.newPage();
    try {
      for (const doc of docs) {
        await page.goto(server.origin + doc.url); await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated); await page.evaluate(() => document.fonts.ready);
        const family = await page.locator('main span.cursor-default').first().evaluate(tag => getComputedStyle(tag).fontFamily);
        const active = family.includes('Inter Workshop Fallback');
        assert.equal(active, doc.language === 'en' && doc.route === '/courses/revit-structure-workshop-03/');
        report.cases.push({ name: `scope-${doc.language}-${doc.route}`, active });
        if (doc.route === '/courses/revit-structure-workshop-03/') {
          const trigger = page.locator('main button[aria-expanded][aria-controls]').first();
          const original = await trigger.getAttribute('aria-expanded');
          await trigger.click();
          await page.waitForFunction(({ id, original }) => document.getElementById(id)?.getAttribute('aria-expanded') !== original, { id: await trigger.getAttribute('id'), original });
          await trigger.click();
          await page.waitForFunction(({ id, original }) => document.getElementById(id)?.getAttribute('aria-expanded') === original, { id: await trigger.getAttribute('id'), original });
          report.cases.push({ name: `curriculum-toggle-${doc.language}`, restoredOriginalState: true });
        }
      }
    } finally { await ctx.close(); }
  }
} catch (error) { report.failures.push(error.stack); throw error; }
finally { await persist(); await browser.close(); await server.close(); }
console.log(`${report.cases.length} course layout cases passed.`);
