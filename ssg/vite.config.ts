import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

const workspace = path.resolve(import.meta.dirname, '..');
export default defineConfig({
  root: path.join(workspace, 'ssg'), envDir: workspace,
  base: process.env.SSG_BASE_PATH || '/ME-2026-Main/',
  publicDir: path.join(workspace, 'public'),
  plugins: [react()],
  resolve: { alias: { '@': path.join(workspace, 'src') } },
  build: { manifest: true, emptyOutDir: true },
});
