import assert from 'node:assert/strict';
import { build } from 'vite';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { JSDOM } from 'jsdom';

const output = path.resolve('dist-ssr/renderer-ab');
await mkdir(output, { recursive: true });
if (process.argv[2] === '--render') {
  const kind = process.argv[3];
  assert.ok(['pipeable', 'readable', 'pipeable-image', 'readable-image'].includes(kind));
  const api = await import(pathToFileURL(path.join(output, 'server/comparison.mjs')).href);
  const boot = JSON.parse(await readFile(path.join(output, kind.endsWith('-image') ? 'image-boundary-input.json' : 'input.json'), 'utf8'));
  const html = await (kind.startsWith('pipeable') ? api.renderPipeable(boot) : api.renderWeb(boot));
  await writeFile(path.join(output, `${kind}.html`), Buffer.from(html));
  process.exit(0);
}
process.env.SSG_BASE_PATH = '/ME-2026-Main/';
await build({ configFile: path.resolve('ssg/vite.config.ts'), logLevel: 'warn', build: { outDir: path.join(output, 'site') } });
await writeFile(path.join(output, 'template.html'), await readFile(path.join(output, 'site/index.html')));
await build({ configFile: path.resolve('ssg/vite.config.ts'), publicDir: false, logLevel: 'warn', build: {
  outDir: path.join(output, 'server'), manifest: false, ssr: path.resolve('ssg/compare-entry.tsx'),
  rollupOptions: { output: { entryFileNames: 'comparison.mjs' } },
} });
const api = await import(pathToFileURL(path.join(output, 'server/comparison.mjs')).href);
const boot = { language: 'ar', route: '/', pageId: 'Index', base: '/ME-2026-Main/', siteUrl: 'https://m-elmaghawry.github.io/ME-2026-Main/', snapshot: { renderedAt: 1795492800000, year: '2026', dates: { ar: '٢٤ نوفمبر ٢٠٢٦', en: 'November 24, 2026' } }, identifierPrefix: 'ssg-ar-Index-0-', fallback404: false };
await writeFile(path.join(output, 'input.json'), JSON.stringify(boot));
// Different server renderer implementations share React context slots. Isolate
// each in a fresh process, with identical input, rather than interleave them.
for (const kind of ['pipeable', 'readable']) execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--render', kind], { env: { ...process.env, NODE_ENV: 'production' }, stdio: 'inherit' });
const a = await readFile(path.join(output, 'pipeable.html'), 'utf8');
const b = await readFile(path.join(output, 'readable.html'), 'utf8');
const bytesA = Buffer.from(a), bytesB = Buffer.from(b);
const offsets = bytes => [...bytes.keys()].filter(i => bytes[i] === 0);
const positions = [...a.matchAll(/\0/g)].map(match => match.index);
assert.ok(offsets(bytesA).length > 0, 'old failure must be reproduced');
assert.deepEqual(offsets(bytesB), []);
assert.ok(!b.includes('\ufffd'));
assert.equal(new TextDecoder('utf-8', { fatal: true }).decode(bytesB), b);
// Diagnostic comparison only: prove that EVERY difference is an extra NUL in A.
// This does not clean A or alter either render's published output.
let ai = 0, bi = 0;
while (ai < a.length || bi < b.length) {
  if (a.charCodeAt(ai) === 0) { ai++; continue; }
  assert.equal(a[ai], b[bi], `unexpected renderer difference at A:${ai}, B:${bi}`);
  ai++; bi++;
}
const head = api.metadataHtml(api.pageMetadata('/', 'ar', boot.siteUrl, 'path'));
const docA = new JSDOM(`<html lang="ar" dir="rtl"><head>${head}</head><body><div id="root">${a}</div></body></html>`);
const docB = new JSDOM(`<html lang="ar" dir="rtl"><head>${head}</head><body><div id="root">${b}</div></body></html>`);
const d = docB.window.document;
assert.equal(d.querySelectorAll('main').length, 1); assert.equal(d.querySelectorAll('h1').length, 1);
assert.equal(d.querySelector('[data-route-loading],template[data-msg],template[data-dgst]'), null);
assert.ok(!b.includes('<!--$!-->'));
const images = [...d.querySelectorAll('img[src]')].map(img => img.getAttribute('src'));
for (const image of images) await access(path.join('public', decodeURIComponent(image.slice(boot.base.length))));
assert.ok(images.some(src => src.includes('/clients/01-شركة-دار-وإعمار.png')));
assert.equal(docA.window.document.head.innerHTML, d.head.innerHTML);
// A second identical-input A/B pair places Arabic inside a URL on a chunk edge.
// Only React's identifier prefix changes; page/business content is untouched.
const imageBoot = { ...boot, identifierPrefix: boot.identifierPrefix + 'x'.repeat(92) };
await writeFile(path.join(output, 'image-boundary-input.json'), JSON.stringify(imageBoot));
for (const kind of ['pipeable-image', 'readable-image']) execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--render', kind], { env: { ...process.env, NODE_ENV: 'production' }, stdio: 'inherit' });
const imageA = await readFile(path.join(output, 'pipeable-image.html'));
const imageB = await readFile(path.join(output, 'readable-image.html'));
const imageDocA = new JSDOM(new TextDecoder('utf-8', { fatal: true }).decode(imageA));
const imageDocB = new JSDOM(new TextDecoder('utf-8', { fatal: true }).decode(imageB));
const badImages = [...imageDocA.window.document.querySelectorAll('img[src]')].map(img => img.getAttribute('src')).filter(src => src.includes('\ufffd'));
assert.ok(badImages.length > 0, 'image URL boundary failure must be reproduced');
assert.deepEqual(offsets(imageB), []);
for (const img of imageDocB.window.document.querySelectorAll('img[src]')) await access(path.join('public', decodeURIComponent(img.getAttribute('src').slice(boot.base.length))));
const imageBoundaryCase = { identifierPrefixLength: imageBoot.identifierPrefix.length, pipeableNulByteOffsets: offsets(imageA), parsedInvalidImages: badImages, readableNulBytes: 0, allReadableImagesValid: true };
imageDocA.window.close(); imageDocB.window.close();
const report = { generatedAt: new Date().toISOString(), node: process.version, react: '18.3.1', boot, pipeable: { byteLength: bytesA.length, nulByteOffsets: offsets(bytesA), nulUTF16Offsets: positions, contexts: positions.map(i => a.slice(Math.max(0, i - 35), i + 35)), parsedInvalidImages: [...docA.window.document.querySelectorAll('img[src]')].map(img => img.getAttribute('src')).filter(src => src.includes('\ufffd')) }, readable: { byteLength: bytesB.length, nulByteOffsets: offsets(bytesB), validUtf8: true, replacementCharacters: 0, imageUrlsValidated: images.length }, imageBoundaryCase, comparison: { onlyDifferencesAreNulInsertions: true, arabicTextPreserved: true, structurePreserved: true, h1: d.querySelector('h1').textContent, metadataIdentical: true, suspenseComplete: true, hydration: 'see renderer-ab/browser-report.json' } };
await writeFile(path.join(output, 'pipeable.html'), bytesA);
await writeFile(path.join(output, 'readable.html'), bytesB);
await writeFile(path.join(output, 'comparison.json'), JSON.stringify(report, null, 2));
docA.window.close(); docB.window.close();
console.log(JSON.stringify(report, null, 2));
