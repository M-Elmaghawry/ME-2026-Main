import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import typography from '@tailwindcss/typography';
const phase = process.argv[2];
assert.ok(['before', 'after'].includes(phase));
const prefix = 'dist-ssr/phase5c3-g4-1/';
fs.mkdirSync(prefix, { recursive: true });
const content = '<article dir="rtl" class="prose prose-slate prose-sm md:prose-lg lg:prose-xl dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600"><h1>العربية English</h1><p>Text <a href="#">link</a><strong>bold</strong><code>code</code></p><blockquote>Quote</blockquote><ol><li>Ordered</li></ol><ul><li>Unordered</li></ul><pre>Code</pre><table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table><figure><img src="local.png"><figcaption>Caption</figcaption></figure><div class="not-prose">Excluded</div></article><article dir="ltr" class="prose prose-lg prose-invert"><h2>English</h2></article>';
const result = await postcss([tailwindcss({ content: [{ raw: content, extension: 'html' }], plugins: [typography] })]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
fs.writeFileSync(prefix + 'typography-' + phase + '.css', result.css);
const summary = { phase, bytes: Buffer.byteLength(result.css), sha256: createHash('sha256').update(result.css).digest('hex'), rules: result.root.nodes.length };
if (phase === 'after') {
  const before = fs.readFileSync(prefix + 'typography-before.css', 'utf8');
  summary.byteIdentical = result.css === before;
  fs.writeFileSync(prefix + 'typography-comparison.json', JSON.stringify(summary, null, 2));
  assert.equal(summary.byteIdentical, true, 'Isolated Typography CSS changed; stop for review');
}
console.log(JSON.stringify(summary, null, 2));
