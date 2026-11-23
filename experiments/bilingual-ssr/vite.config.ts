import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const workspace = path.resolve(import.meta.dirname, '../..');
const experiment = path.resolve(workspace, 'experiments/bilingual-ssr');
const normalized = (file: string) => file.replace(/\\/g, '/');

function replaceOnce(source: string, original: string, replacement: string, name: string) {
  if (source.split(original).length !== 2) throw new Error(`POC overlay no longer matches ${name}; review the source before building.`);
  return source.replace(original, replacement);
}

function isolatedOverlay(): Plugin {
  return {
    name: 'isolated-ssr-poc-overlay', enforce: 'pre',
    resolveId(id) { if (id === 'virtual:poc-resources') return '\0poc-resources'; },
    load(id) {
      if (id !== '\0poc-resources') return;
      // Reuse translations verbatim without importing the browser singleton or
      // maintaining a second copy. No production source file is rewritten.
      const file = path.join(workspace, 'src/i18n/index.ts');
      const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
      let initializer: ts.Expression | undefined;
      source.forEachChild(node => {
        if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) {
          if (declaration.name.getText(source) === 'resources') initializer = declaration.initializer;
        }
      });
      if (!initializer) throw new Error('POC cannot locate the original translation resources.');
      return `export const resources = ${initializer.getText(source)};`;
    },
    transform(original, id) {
      const file = normalized(id.split('?')[0]);
      const relative = file.slice(normalized(workspace).length + 1);
      if (!['src/components/services/useServicePage.ts', 'src/components/layout/Footer.tsx', 'src/pages/CourseDetail.tsx', 'src/components/sections/HeroSection.tsx'].includes(relative)) return;
      let code = original.replace(/\r\n/g, '\n');
      if (relative.endsWith('useServicePage.ts')) code = replaceOnce(code,
        "import { useReducedMotion } from 'framer-motion';",
        `import { useHydrationSafeReducedMotion as useReducedMotion } from ${JSON.stringify(normalized(path.join(experiment, 'render-phase.ts')))};`, relative);
      if (relative.endsWith('Footer.tsx')) code = replaceOnce(code, 'new Date().getFullYear()', 'new Date(__POC_RENDER_TIME__).getFullYear()', relative);
      if (relative.endsWith('CourseDetail.tsx')) code = replaceOnce(code, 'useState(Date.now)', 'useState(() => __POC_RENDER_TIME__)', relative);
      if (relative.endsWith('HeroSection.tsx')) {
        const begin = code.indexOf('const RollingNumber =');
        const end = code.indexOf('// Single useInView', begin);
        if (begin < 0 || end < 0) throw new Error('POC cannot locate the original counter.');
        let counter = code.slice(begin, end);
        counter = replaceOnce(counter, '    <span className="inline-flex items-center tabular-nums" dir="ltr">', '    <span style={{ position: "relative", display: "inline-block" }}>\n      <span className="poc-static-stat" dir="ltr">{value}</span>\n      <span className="poc-animated-stat inline-flex items-center tabular-nums" dir="ltr">', relative);
        counter = replaceOnce(counter, '    </span>\n  );', '      </span>\n    </span>\n  );', relative);
        code = code.slice(0, begin) + counter + code.slice(end);
      }
      return { code, map: null };
    },
  };
}

export default defineConfig({
  root: experiment,
  envDir: workspace,
  base: process.env.SSR_POC_BASE_PATH || '/ME-2026-Main/',
  publicDir: path.join(workspace, 'public'),
  plugins: [isolatedOverlay(), react()],
  define: { __POC_RENDER_TIME__: process.env.SSR_POC_RENDER_TIME || String(Date.now()) },
  resolve: { alias: [
    { find: '@/contexts/LanguageContext', replacement: path.join(experiment, 'language.ts') },
    { find: '@/components/LanguageLink', replacement: path.join(experiment, 'LanguageLink.tsx') },
    { find: '@/hooks/useLocalizedNavigation', replacement: path.join(experiment, 'navigation.ts') },
    { find: '@', replacement: path.join(workspace, 'src') },
  ] },
  build: { outDir: path.join(workspace, 'dist-ssr/poc/site'), manifest: true, emptyOutDir: true },
});
