import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';
import { documentFontHints } from '../scripts/ssg-fonts.mjs';

test('local font files and face definitions preserve the exact approved provider fonts', async () => {
  const root = 'src/assets/fonts/';
  const catalog = JSON.parse(await readFile(root + 'sources.json', 'utf8'));
  const original = await readFile(root + 'google-fonts-source.css', 'utf8');
  let restored = (await readFile('src/fonts.css', 'utf8')).split('\n').slice(1).join('\n');
  assert.equal(catalog.files.length, 12);
  assert.deepEqual([...new Set(catalog.files.map(font => font.family))].sort(), ['Inter', 'Noto Sans Arabic']);
  for (const font of catalog.files) {
    const bytes = await readFile(root + font.file);
    assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), font.sha256);
    restored = restored.replaceAll('./assets/fonts/' + font.file, font.url);
  }
  assert.equal(restored, original, 'Only delivery URLs change; families, weights, ranges and display policy remain intact');
  assert.ok(!(await readFile('src/index.css', 'utf8')).includes('fonts.googleapis.com'));
  for (const family of ['inter', 'notosansarabic']) assert.ok((await readFile(root + family + '-OFL.txt', 'utf8')).includes('SIL OPEN FONT LICENSE'));
  assert.equal((await readFile('public/font-licenses.txt', 'utf8')).split('SIL OPEN FONT LICENSE').length - 1, 2);
});

test('font hints reject an unsupported locale or missing/ambiguous asset', async () => {
  const catalog = JSON.parse(await readFile('src/assets/fonts/sources.json', 'utf8'));
  assert.throws(() => documentFontHints(catalog, {}, '/', 'fr'), /Unsupported/);
  assert.throws(() => documentFontHints(catalog, {}, '/', 'en'), /Missing or ambiguous/);
  const file = catalog.files.find(font => font.family === 'Inter' && font.preload).file;
  const entry = { file: 'assets/' + file };
  assert.throws(() => documentFontHints(catalog, { a: entry, b: entry }, '/', 'en'), /Missing or ambiguous/);
});

for (const variant of ['repo', 'root', 'custom']) test(`all ${variant} documents select matching locale preloads and decode requests`, async () => {
  const directory = `dist-ssr/candidate/${variant}`;
  const report = JSON.parse(await readFile(`${directory}/ssr-report.json`, 'utf8'));
  for (const document of report.documents) {
    const dom = new JSDOM(await readFile(`${directory}/site/${document.file}`, 'utf8'));
    try {
      const doc = dom.window.document;
      const preloads = [...doc.querySelectorAll('link[rel="preload"][as="font"]')].map(link => link.getAttribute('href'));
      assert.equal(new Set(preloads).size, preloads.length);
      assert.equal(preloads.length, document.language === 'en' ? 1 : 3);
      assert.ok(preloads.every(url => url.startsWith(report.base + 'assets/') && url.endsWith('.woff2')));
      if (document.language === 'en') assert.ok(preloads.every(url => url.includes('/inter-latin-')));
      else assert.ok(preloads[0].includes('/noto-sans-arabic-arabic-'), 'Arabic face gets first priority');
      const warmups = [...doc.scripts].filter(script => script.textContent.includes('new FontFace'));
      assert.equal(warmups.length, 1);
      const loads = [];
      runInNewContext(warmups[0].textContent, { window: { FontFace: true }, FontFace: class {
        constructor(family, source) { loads.push({ family, source }); }
        load() { return Promise.resolve(); }
      }, console });
      assert.deepEqual(loads.map(font => font.source), preloads.map(url => `url("${url}")`));
      assert.ok(loads.every(font => document.language !== 'en' || font.family === 'Inter'));
    } finally { dom.window.close(); }
  }
});
