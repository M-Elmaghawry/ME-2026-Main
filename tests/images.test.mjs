import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { prepareImages } from '../scripts/optimize-images.mjs';

await prepareImages();
const manifest = JSON.parse(readFileSync('src/data/imageManifest.json', 'utf8'));

test('responsive derivatives decode correctly and preserve dimensions and transparency', async () => {
  assert.ok(Object.keys(manifest).length >= 100, 'all current source images must be covered');
  let originalBytes = 0, largestBytes = 0;
  for (const [url, image] of Object.entries(manifest)) {
    const source = 'public' + url;
    originalBytes += statSync(source).size;
    assert.ok(image.width > 0 && image.height > 0);
    let lastWidth = 0;
    for (const variant of image.variants) {
      assert.ok(variant.width > lastWidth && variant.width <= image.width);
      assert.match(variant.src, /^\/optimized\/[a-f0-9]{20}-\d+\.webp$/);
      const meta = await sharp('public' + variant.src).metadata();
      assert.equal(meta.format, 'webp');
      assert.equal(meta.width, variant.width);
      assert.ok(Math.abs(meta.height - image.height * variant.width / image.width) <= 1);
      lastWidth = variant.width;
    }
    const largest = image.variants.at(-1);
    largestBytes += statSync('public' + largest.src).size;
    const sourceMeta = await sharp(source).metadata();
    if (sourceMeta.hasAlpha) assert.equal((await sharp('public' + largest.src).metadata()).hasAlpha, true);
  }
  assert.ok(largestBytes < originalBytes * 0.35, 'largest responsive alternatives must remain at least 65% smaller in aggregate');
});

test('regeneration preserves originals and leaves the cached output unchanged', async () => {
  const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
  const originals = new Map(Object.keys(manifest).map((url) => ['public' + url, hash('public' + url)]));
  const variants = Object.values(manifest).flatMap((image) => image.variants.map((variant) => 'public' + variant.src));
  const before = variants.map((file) => statSync(file).mtimeMs);
  const manifestBefore = readFileSync('src/data/imageManifest.json', 'utf8');
  await prepareImages();
  for (const [file, digest] of originals) assert.equal(hash(file), digest, file);
  assert.deepEqual(variants.map((file) => statSync(file).mtimeMs), before);
  assert.equal(readFileSync('src/data/imageManifest.json', 'utf8'), manifestBefore);
});

for (const base of ['/', '/ME-2026-Main/']) {
  test(`image markup uses ${base}, correct loading priority, and original fallback`, async () => {
    const server = await createServer({ configFile: false, base, resolve: { alias: { '@': path.resolve('src') } }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
    try {
    const { default: Image } = await server.ssrLoadModule('/src/components/ResponsiveImage.tsx');
    const html = renderToStaticMarkup(createElement(Image, { src: '/hero/Mahmoud Elmekawy.jpg', alt: 'Profile', sizes: '448px' }));
    assert.ok(html.includes('<picture class="contents">'));
    assert.ok(html.includes('type="image/webp"'));
    assert.ok(html.includes(`srcSet="${base}optimized/`));
    assert.ok(html.includes(`src="${base}hero/Mahmoud Elmekawy.jpg"`));
    assert.ok(html.includes('loading="lazy"'));
    assert.ok(html.includes('decoding="async"'));
    assert.ok(/width="\d+" height="\d+"/.test(html));
    const priority = renderToStaticMarkup(createElement(Image, { src: '/hero/Mahmoud Elmekawy.jpg', alt: 'Profile', priority: true }));
    assert.ok(priority.includes('loading="eager"'));
    assert.ok(priority.includes('fetchpriority="high"'));
    } finally {
      await server.close();
    }
  });
}
