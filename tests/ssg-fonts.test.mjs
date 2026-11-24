import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { test } from 'node:test';

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
