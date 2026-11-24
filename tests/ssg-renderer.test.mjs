import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'vite';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

await build({ configFile: path.resolve('ssg/vite.config.ts'), publicDir: false, logLevel: 'silent', build: {
  outDir: path.resolve('dist-ssr/renderer-probes'), manifest: false, ssr: path.resolve('ssg/diagnostics/probes.ts'),
  rollupOptions: { output: { entryFileNames: 'probes.mjs' } },
} });
const { probe } = await import(pathToFileURL(path.resolve('dist-ssr/renderer-probes/probes.mjs')).href);
function contains(error, text) { return error.message.includes(text) || error.errors?.some(item => contains(item, text)); }
test('Web renderer preserves multibyte text across streamed chunks', async () => {
  const html = await probe('unicode');
  assert.equal(html, `<p>${'العربية — English 🏗️ '.repeat(500)}</p>`);
});
test('Web renderer rejects recoverable Suspense errors instead of publishing fallback HTML', async () => {
  await assert.rejects(probe('error'), error => contains(error, 'Expected SSR probe failure'));
});
test('Web renderer aborts unresolved content and rejects instead of publishing a loading shell', async () => {
  await assert.rejects(probe('timeout'), error => contains(error, 'SSR completion timeout'));
});
test('Web renderer rejects NUL bytes rather than removing them', async () => {
  await assert.rejects(probe('nul'), /NUL byte/);
});
