import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// Phase 5C.2 replaces the source-text overlays with shared rendering APIs.
// This historical five-page harness remains runnable and isolated.
const workspace = path.resolve(import.meta.dirname, '../..');
const experiment = path.join(workspace, 'experiments/bilingual-ssr');
export default defineConfig({
  root: experiment, envDir: workspace,
  base: process.env.SSR_POC_BASE_PATH || '/ME-2026-Main/',
  publicDir: path.join(workspace, 'public'), plugins: [react()],
  resolve: { alias: [
    { find: '@/contexts/LanguageContext', replacement: path.join(experiment, 'language.ts') },
    { find: '@/components/LanguageLink', replacement: path.join(experiment, 'LanguageLink.tsx') },
    { find: '@/hooks/useLocalizedNavigation', replacement: path.join(experiment, 'navigation.ts') },
    { find: '@', replacement: path.join(workspace, 'src') },
  ] },
  build: { outDir: path.join(workspace, 'dist-ssr/poc/site'), manifest: true, emptyOutDir: true },
});
