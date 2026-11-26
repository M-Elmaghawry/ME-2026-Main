import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { JSDOM } from 'jsdom';
import { serve, metrics, normalizeCapture, imageDifference, geometryDifference } from './ssg-browser-utils.mjs';

const output = 'dist-ssr/phase5c3-g1-1';
await mkdir(output, { recursive: true });
const before = process.argv.includes('--before');
const report = { browser: '', cases: [], failures: [] };
const build = JSON.parse(await readFile('dist-ssr/candidate/repo/ssr-report.json', 'utf8'));
const site = await serve('dist-ssr/candidate/repo/site', build.base, true);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
report.browser = await browser.version();
const stage = before ? 'before' : 'after';
try {
  for (const locale of before ? ['en-US'] : ['en-US', 'ar-SA', 'fr-FR']) {
    const context = await browser.newContext({ locale, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === site.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    try {
      for (const language of ['ar', 'en']) for (const route of ['courses/bim-fundamentals/', 'services/bim-training/']) {
        const name = `${locale}:${language}:${route}`;
        try {
          await page.goto(site.origin + build.base + (language === 'en' ? 'en/' : '') + route);
          await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(400);
          const state = await metrics(page);
          const counts = await page.locator('main').innerText();
          const row = { name, state, westernCounts: !route.startsWith('courses') || (counts.includes('300') && counts.includes('1,200')) };
          if (route.startsWith('courses')) {
            const doc = build.documents.find(item => item.language === language && item.route === '/' + route);
            const dom = new JSDOM(await readFile('dist-ssr/candidate/repo/site/' + doc.file, 'utf8'));
            const walker = dom.window.document.createTreeWalker(dom.window.document.querySelector('main'), dom.window.NodeFilter.SHOW_TEXT);
            const values = [];
            while (walker.nextNode()) values.push(walker.currentNode.textContent.trim());
            row.ssrCount = values.find(value => value === '300' || value === '٣٠٠');
            dom.window.close();
          }
          if (!before) {
            assert.deepEqual(state.recoverableErrors, []);
            assert.equal(state.bootstrapError, undefined);
            assert.equal(state.rootPreserved, true);
            assert.equal(state.idsPreserved, true);
            assert.equal(row.westernCounts, true);
            if (route.startsWith('courses')) assert.equal(row.ssrCount, '300');
          }
          if (locale === 'en-US') {
            const file = `${output}/${stage}-${language}-${route.split('/')[0]}.png`;
            await normalizeCapture(page);
            await page.screenshot({ path: file, animations: 'disabled' });
            row.screenshot = file;
            if (!before) {
              const old = JSON.parse(await readFile(`${output}/formatting-before.json`, 'utf8')).cases.find(item => item.name === name);
              row.geometryDifference = geometryDifference(old.state.boxes, state.boxes);
              row.pixels = await imageDifference(old.screenshot, file, file.replace('.png', '-difference.png'));
              assert.ok(row.geometryDifference <= 1, `Geometry changed: ${row.geometryDifference}`);
            }
          }
          report.cases.push(row);
          console.log(`PASSED ${stage} ${name}`);
        } catch (error) { report.failures.push({ name, error: error.stack }); throw error; }
      }
    } finally { await context.close(); }
  }
} finally {
  await writeFile(`${output}/formatting-${stage}.json`, JSON.stringify(report, null, 2));
  await browser.close(); await site.close();
}
console.log(`${report.cases.length} ${stage} formatting/visual cases completed.`);
