import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright-core';
import { matchRoutes } from 'react-router-dom';
import { serve, metrics } from './ssg-browser-utils.mjs';

// --before records the unfixed behavior without changing application source.
const before = process.argv.includes('--before');
const output = 'dist-ssr/phase5c4-a';
await mkdir(output, { recursive: true });
const report = { stage: before ? 'before' : 'after', cases: [], failures: [], browser: '', policy: 'Local static host; external requests blocked. No HTTP alias redirect is simulated.' };
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, chromiumSandbox: true });
report.browser = await browser.version();
const routes = [{ path: '/', id: 'Index' }, { path: '/about', id: 'About' }, { path: '/services', id: 'Services' }, { path: '/services/:id', id: 'ServiceDetail' }, { path: '/courses', id: 'Courses' }, { path: '/courses/:id', id: 'CourseDetail' }, { path: '/portfolio', id: 'Portfolio' }, { path: '/portfolio/:id', id: 'ProjectDetail' }, { path: '/contact', id: 'Contact' }, { path: '/thank-you', id: 'ContactResult' }, { path: '/privacy-policy', id: 'PrivacyPolicy' }, { path: '/terms', id: 'Terms' }, { path: '*', id: 'NotFound' }];
const representatives = new Set(['Index', 'About', 'ServiceDetail', 'CourseDetail', 'Contact']);
const hash = text => createHash('sha256').update(text).digest('hex');
async function record(name, action) {
  try { report.cases.push({ name, passed: true, ...await action() }); }
  catch (error) { report.failures.push({ name, error: error.stack }); throw error; }
  finally { await writeFile(`${output}/${report.stage}.json`, JSON.stringify(report, null, 2)); }
}
try {
  for (const variant of before ? ['repo'] : ['repo', 'root', 'custom']) {
    const build = JSON.parse(await readFile(`dist-ssr/candidate/${variant}/ssr-report.json`, 'utf8'));
    const site = await serve(`dist-ssr/candidate/${variant}/site`, build.base, true);
    try {
      for (const [device, viewport] of Object.entries(before ? { desktop: { width: 1440, height: 1000 } } : { desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
        const ctx = await browser.newContext({ viewport });
        await ctx.route('**/*', r => new URL(r.request().url()).origin === site.origin ? r.continue() : r.abort());
        const page = await ctx.newPage(); page.setDefaultTimeout(15000);
        let errors = [], assets = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if ((message.type() === 'error' && !/Failed to load resource.*status of 404/.test(message.text())) || /No routes matched|not able to match the URL/.test(message.text())) errors.push(message.text()); });
        page.on('response', response => { if (response.status() >= 400 && !response.request().isNavigationRequest() && response.url().startsWith(site.origin)) assets.push(response.url()); });
        async function ready(allowNotFound = false) {
          await page.waitForFunction(() => window.__SSG_EVIDENCE__?.hydrated || window.__SSG_EVIDENCE__?.bootstrapError);
          const state = await metrics(page);
          if (!before) { assert.deepEqual(state.recoverableErrors, []); assert.equal(state.bootstrapError, undefined); assert.deepEqual(allowNotFound ? errors.filter(message => !message.startsWith('404 Error: User attempted to access non-existent route:')) : errors, []); assert.deepEqual(assets, []); }
          return state;
        }
        try {
          const docs = build.documents.filter(doc => doc.indexable && (!before || representatives.has(doc.id)));
          for (const doc of docs) for (const alias of [false, true]) {
            const requested = doc.url + (alias ? 'index.html' : '');
            await record(`${variant}:${device}:${doc.language}:${doc.route}:${alias ? 'alias' : 'canonical'}`, async () => {
              errors = []; assets = [];
              const response = await page.goto(site.origin + requested, { waitUntil: 'load' });
              assert.equal(response.status(), 200);
              const html = await response.text(), expectedHtml = await readFile(`dist-ssr/candidate/${variant}/site/${doc.file}`, 'utf8');
              assert.equal(hash(html), hash(expectedHtml), 'Host serves the exact generated document');
              const state = await ready();
              const location = new URL(page.url()), basename = build.base + (doc.language === 'en' ? 'en/' : '');
              const routerLocation = '/' + location.pathname.slice(basename.length);
              const browserMatch = matchRoutes(routes, routerLocation)?.at(-1)?.route.id;
              const ssrMatch = matchRoutes(routes, doc.route)?.at(-1)?.route.id;
              const alternates = await page.locator('link[hreflang]').evaluateAll(nodes => nodes.map(n => ({ language: n.hreflang, href: n.href })));
              if (!before) {
                assert.equal(location.pathname, doc.url); assert.equal(browserMatch, ssrMatch);
                assert.equal(state.rootPreserved, true); assert.equal(state.idsPreserved, true); assert.equal(state.lang, doc.language);
                assert.equal(state.canonical, doc.canonical);
                assert.deepEqual(state.counts, { title: 1, description: 1, canonical: 1, alternates: 3, jsonld: 1 });
                assert.deepEqual(alternates, [...Object.entries(doc.alternates).map(([language, href]) => ({ language, href })), { language: 'x-default', href: doc.alternates.ar }]);
              }
              return { requested, servedFile: doc.file, documentSha256: hash(html), finalLocation: location.pathname, routerLocation, ssrMatch, browserMatch, canonical: state.canonical, alternates, rootPreserved: state.rootPreserved, recoverableErrors: state.recoverableErrors, consoleErrors: [...errors], assetFailures: [...assets] };
            });
            // Refresh the literal form as well as the canonical form directly.
            if (!before && representatives.has(doc.id)) await record(`${variant}:${device}:${doc.language}:${doc.route}:${alias ? 'alias' : 'canonical'}:refresh`, async () => {
              if (alias) await page.evaluate(url => history.replaceState(history.state, '', url), requested);
              errors = []; assets = [];
              assert.equal((await page.reload()).status(), 200); const state = await ready();
              assert.equal(new URL(page.url()).pathname, doc.url); assert.equal(state.rootPreserved, true);
              return { rootPreserved: state.rootPreserved, recoverableErrors: state.recoverableErrors };
            });
          }
          for (const language of ['ar', 'en']) {
            const prefix = build.base + (language === 'en' ? 'en/' : '');
            for (const invalid of ['missing/', 'services/missing/', 'courses/missing/', 'about/extra/']) for (const alias of [false, true]) await record(`${variant}:${device}:${language}:invalid:${invalid}:${alias}`, async () => {
              errors = []; assets = [];
              const requested = prefix + invalid + (alias ? 'index.html' : '');
              if (alias) {
                const response = await ctx.request.get(site.origin + requested); assert.equal(response.status(), 404);
                let browserError;
                try { await page.goto(site.origin + requested); } catch (error) { browserError = error.message; assert.match(browserError, /ERR_HTTP_RESPONSE_CODE_FAILURE/); }
                assert.equal(await page.locator('#root').count(), 0);
                return { requested, status: 404, sharedDocument: false, browserError };
              }
              const response = await page.goto(site.origin + requested);
              assert.equal(response.status(), 404);
              // Missing literal files return an empty host 404; route-shaped paths use the shared 404 document.
              const state = await ready(true); assert.equal(state.h1, '404'); assert.equal(state.rootPreserved, true);
              return { requested, status: 404, sharedDocument: true, canonical: state.canonical, recoverableErrors: state.recoverableErrors };
            });
            if (!before) {
              await record(`${variant}:${device}:${language}:history-query-hash-switch`, async () => {
                errors = []; assets = [];
                const suffix = '?ref=a%26b&x=%2F&x=2#form';
                await page.goto(site.origin + prefix + 'contact/index.html' + suffix); await ready();
                assert.equal(page.url(), site.origin + prefix + 'contact/' + suffix);
                // Re-enter an alias in same-document history, retaining arbitrary state and router idx/key.
                await page.evaluate(({ prefix, suffix }) => {
                  history.replaceState({ ...history.state, aliasProbe: { value: 42 } }, '', prefix + 'contact/index.html' + suffix);
                  history.pushState({ ...history.state, idx: history.state.idx + 1 }, '', prefix + 'about/');
                }, { prefix, suffix });
                await page.goBack(); await ready();
                assert.equal(page.url(), site.origin + prefix + 'contact/' + suffix);
                assert.deepEqual(await page.evaluate(() => history.state.aliasProbe), { value: 42 });
                await page.goForward(); await page.waitForURL(site.origin + prefix + 'about/'); await ready();
                await page.goBack(); await page.waitForURL(site.origin + prefix + 'contact/' + suffix); await ready();
                await page.getByRole('button', { name: language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية', exact: true }).click();
                const otherPrefix = build.base + (language === 'ar' ? 'en/' : '');
                await page.waitForURL(site.origin + otherPrefix + 'contact/' + suffix); await ready();
                await page.goBack(); await page.waitForURL(site.origin + prefix + 'contact/' + suffix); await ready();
                await page.goForward(); await page.waitForURL(site.origin + otherPrefix + 'contact/' + suffix); await ready();
                return { queryHashPreserved: true, statePreserved: true, backForward: true, languageSwitch: true };
              });
              await record(`${variant}:${device}:${language}:reduced-motion-alias`, async () => {
                await page.emulateMedia({ reducedMotion: 'reduce' }); errors = []; assets = [];
                await page.goto(site.origin + prefix + 'about/index.html'); const state = await ready();
                assert.equal(state.rootPreserved, true);
                assert.equal(await page.locator('h1').evaluate(el => { for (let n = el; n instanceof HTMLElement; n = n.parentElement) if (getComputedStyle(n).opacity === '0' || getComputedStyle(n).display === 'none') return false; return true; }), true);
                await page.emulateMedia({ reducedMotion: 'no-preference' });
                return { visible: true, recoverableErrors: state.recoverableErrors };
              });
            }
          }
        } finally { await ctx.close(); }
        console.log(`${report.stage}: ${variant}/${device}: ${report.cases.length} cumulative checks`);
      }
    } finally { await site.close(); }
  }
} finally { await browser.close(); await writeFile(`${output}/${report.stage}.json`, JSON.stringify(report, null, 2)); }
if (before) assert.ok(report.cases.some(row => row.recoverableErrors?.length), 'Negative control must reproduce hydration failures');
assert.deepEqual(report.failures, []);
console.log(`${report.stage}: ${report.cases.length} checks; ${report.failures.length} failures`);
