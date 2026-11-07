import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const VERSION = 'webp-v1';
sharp.concurrency(2);

async function sourceImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'optimized') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceImages(file));
    else if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name) && entry.name !== 'favicon.png') files.push(file);
  }
  return files.sort();
}

export async function prepareImages(root = process.cwd()) {
  const publicRoot = path.resolve(root, 'public');
  const outputRoot = path.join(publicRoot, 'optimized');
  const manifestFile = path.resolve(root, 'src/data/imageManifest.json');
  await mkdir(outputRoot, { recursive: true });
  const manifest = {};
  const used = new Set();
  let sourceBytes = 0, largestVariantBytes = 0, generatedBytes = 0;
  for (const file of await sourceImages(publicRoot)) {
    const source = await readFile(file);
    const url = '/' + path.relative(publicRoot, file).split(path.sep).join('/');
    const graphic = /\/clients\/|logo/i.test(url);
    const quality = /\/certificates\//.test(url) ? 88 : 82;
    const hash = createHash('sha256').update(VERSION + quality + graphic).update(source).digest('hex').slice(0, 20);
    const meta = await sharp(source).metadata();
    if (!meta.width || !meta.height) throw new Error(`Missing image dimensions: ${url}`);
    const rotated = meta.orientation >= 5 && meta.orientation <= 8;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    const maxWidth = Math.min(width, graphic ? 640 : 1920);
    const widths = [...new Set([...(graphic ? [160, 320, 640] : [320, 640, 1280, 1920]).filter((size) => size < maxWidth), maxWidth])];
    const variants = await Promise.all(widths.map(async (size) => {
      const name = `${hash}-${size}.webp`;
      const output = path.join(outputRoot, name);
      used.add(name);
      try { await stat(output); } catch {
        await sharp(source).rotate().resize({ width: size, withoutEnlargement: true })
          .webp({ quality, lossless: graphic, effort: 4 }).toFile(output);
      }
      const bytes = (await stat(output)).size;
      generatedBytes += bytes;
      return { width: size, src: `/optimized/${name}`, bytes };
    }));
    sourceBytes += source.length;
    largestVariantBytes += variants.at(-1).bytes;
    manifest[url] = { width, height, variants: variants.map(({ width, src }) => ({ width, src })) };
  }
  // Only remove obsolete files created by this generator; never remove originals.
  for (const entry of await readdir(outputRoot, { withFileTypes: true })) {
    if (entry.isFile() && /^[a-f0-9]{20}-\d+\.webp$/.test(entry.name) && !used.has(entry.name)) {
      await unlink(path.join(outputRoot, entry.name));
    }
  }
  const serialized = JSON.stringify(manifest, null, 2) + '\n';
  let existing;
  try { existing = await readFile(manifestFile, 'utf8'); } catch { /* first build */ }
  if (existing !== serialized) await writeFile(manifestFile, serialized);
  return { images: Object.keys(manifest).length, sourceBytes, largestVariantBytes, generatedBytes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepareImages().then((summary) => console.log(JSON.stringify(summary, null, 2))).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
