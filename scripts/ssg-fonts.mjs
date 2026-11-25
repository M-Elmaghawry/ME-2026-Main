import assert from 'node:assert/strict';
import path from 'node:path';

// This controls early fetch/decode hints only. All original CSS faces and
// Unicode ranges stay available for actual text, including mixed-script UI.
const priorityFamilies = {
  ar: ['Noto Sans Arabic', 'Inter'],
  en: ['Inter'],
};

export function documentFontHints(catalog, manifest, base, language) {
  const families = priorityFamilies[language];
  assert.ok(families, `Unsupported font-hint locale: ${language}`);
  const fonts = catalog.files.filter(font => font.preload && families.includes(font.family))
    .sort((a, b) => families.indexOf(a.family) - families.indexOf(b.family))
    .map(font => {
      const matches = Object.values(manifest).filter(entry => path.posix.basename(entry.file).startsWith(font.file.slice(0, -6)));
      assert.equal(matches.length, 1, `Missing or ambiguous font asset: ${font.file}`);
      return { family: font.family, url: `${base}${matches[0].file}` };
    });
  assert.equal(new Set(fonts.map(font => font.url)).size, fonts.length, 'No duplicate font hints');
  const preloads = fonts.map(font => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${font.url}" />`).join('\n');
  // Keep the existing early decode behavior for the same locale-selected files.
  const warmup = `<script>if('FontFace' in window)for(const f of ${JSON.stringify(fonts)})new FontFace(f.family,'url("'+f.url+'")',{weight:'300 800',display:'swap'}).load().catch(error=>console.error('Font decode failed:',error));</script>`;
  return { fonts, preloads, warmup };
}
