import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { serve, metrics, normalizeCapture, imageDifference, geometryDifference } from './ssg-browser-utils.mjs';
const output = 'dist-ssr/phase5c3-g4-1/visuals';
await mkdir(output, { recursive: true });
const before = await serve('dist-ssr/phase5c3-g4-1/baseline/site', '/ME-2026-Main/', true);
const after = await serve('dist-ssr/candidate/repo/site', '/ME-2026-Main/', true);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
const report = { browser: await browser.version(), cases: [], failures: [], policy: 'Paired G3/current screenshots; local requests only, same clock, normal/reduced motion, existing 0.5% pixel/1px geometry gates. No LCP measurement.' };
try {
  for (const [device, viewport] of Object.entries({ mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 1000 } }))
    for (const motion of ['no-preference', 'reduce']) for (const language of ['ar', 'en'])
      for (const [name, route] of [['home', ''], ['training', 'services/bim-training/'], ['workshop', 'courses/revit-structure-workshop-03/'], ['contact', 'contact/']]) {
        const key = `${device}-${motion}-${language}-${name}`, captures = [];
        try {
          for (const [stage, site] of [['before', before], ['after', after]]) {
            const context = await browser.newContext({ viewport, reducedMotion: motion });
            await context.route('**/*', r => new URL(r.request().url()).origin === site.origin ? r.continue() : r.abort());
            const page = await context.newPage();
            try {
              await page.clock.install({ time: new Date('2026-11-25T10:00:00Z') });
              await page.goto(`${site.origin}/ME-2026-Main/${language === 'en' ? 'en/' : ''}${route}`);
              await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
              await page.evaluate(() => document.fonts.ready);
              await page.clock.runFor(5000);
              await normalizeCapture(page, { clocked: true });
              const evidence = await metrics(page);
              assert.deepEqual(evidence.recoverableErrors, []); assert.equal(evidence.bootstrapError, undefined);
              assert.equal(evidence.rootPreserved, true); assert.equal(evidence.idsPreserved, true);
              assert.equal(evidence.lang, language);
              const styles = await page.evaluate(() => Object.fromEntries(['h1', 'main', 'header', 'footer'].map(selector => {
                const element = document.querySelector(selector), css = getComputedStyle(element), box = element.getBoundingClientRect();
                return [selector, { family: css.fontFamily, size: css.fontSize, direction: css.direction, lineHeight: css.lineHeight, color: css.color, height: box.height }];
              })));
              const file = `${output}/${key}-${stage}.png`;
              await page.screenshot({ path: file, animations: 'disabled' });
              captures.push({ file, evidence, styles });
            } finally { await context.close(); }
          }
          const pixels = await imageDifference(captures[0].file, captures[1].file, `${output}/${key}-diff.png`);
          const geometry = geometryDifference(captures[0].evidence.boxes, captures[1].evidence.boxes);
          assert.deepEqual(captures[0].styles, captures[1].styles, 'Typography/direction/header/footer styles changed');
          assert.ok(pixels <= 0.005 && geometry <= 1, `Unexpected visual difference ${pixels}/${geometry}`);
          report.cases.push({ key, pixelDifference: pixels, geometry, beforeStyles: captures[0].styles, afterStyles: captures[1].styles });
          console.log(`PASSED ${key}: pixels=${pixels}, geometry=${geometry}`);
        } catch (error) { report.failures.push({ key, error: error.stack }); throw error; }
        finally { await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2)); }
      }
} finally { await browser.close(); await before.close(); await after.close(); }
console.log(`${report.cases.length} paired visual cases passed.`);
