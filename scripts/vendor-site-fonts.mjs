// Explicit maintenance command, never run by a build. The checked-in CSS pins
// the exact provider versions used by the approved Noto Sans Arabic/Inter site.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const directory = path.resolve('src/assets/fonts'); await mkdir(directory, { recursive: true });
const css = await readFile(path.join(directory, 'google-fonts-source.css'), 'utf8');
const faces = [...css.matchAll(/\/\* ([^*]+) \*\/\s*@font-face\s*\{([^}]+)\}/g)].map(match => ({ subset: match[1], family: /font-family: '([^']+)'/.exec(match[2])[1], url: /url\(([^)]+)\)/.exec(match[2])[1] }));
const files = []; const replacements = new Map();
for (const face of faces) {
  if (replacements.has(face.url)) continue;
  assert.ok(/^https:\/\/fonts\.gstatic\.com\/s\/(inter\/v20|notosansarabic\/v33)\//.test(face.url), 'Font versions must match the pinned baseline');
  const response = await fetch(face.url); if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer()); assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const file = `${face.family.toLowerCase().replaceAll(' ', '-')}-${face.subset}-${sha256.slice(0, 12)}.woff2`;
  await writeFile(path.join(directory, file), bytes); replacements.set(face.url, `./assets/fonts/${file}`);
  files.push({ ...face, file, sha256, bytes: bytes.length, preload: face.subset === 'latin' || face.subset === 'arabic' });
}
let local = css; for (const [url, file] of replacements) local = local.replaceAll(url, file);
await writeFile('src/fonts.css', '/* Same provider faces, weights, Unicode ranges and display:swap; local delivery. */\n' + local);
for (const family of ['inter', 'notosansarabic']) {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if (!response.ok) throw new Error(`Font license failed: ${response.status}`);
  const text = await response.text(); assert.ok(text.includes('SIL OPEN FONT LICENSE'));
  await writeFile(path.join(directory, `${family}-OFL.txt`), text);
}
await writeFile('public/font-licenses.txt', 'Inter and Noto Sans Arabic: pinned site font licenses\n\n' + await readFile(path.join(directory, 'inter-OFL.txt'), 'utf8') + '\n\n' + await readFile(path.join(directory, 'notosansarabic-OFL.txt'), 'utf8'));
await writeFile(path.join(directory, 'sources.json'), JSON.stringify({ source: 'Google Fonts CSS API: Inter v20 / Noto Sans Arabic v33, weights 300–800, unchanged from baseline', files }, null, 2) + '\n');
console.log(`Pinned ${files.length} original WOFF2 files (${files.reduce((sum, f) => sum + f.bytes, 0)} bytes), licenses, and unchanged face definitions.`);
