import { defineConfig, mergeConfig } from 'vite';
import path from 'node:path';
import candidate from '../vite.config';

const root = path.resolve(import.meta.dirname, '../..');
// This is a separate local fixture, never the candidate/deployment config.
export default mergeConfig(candidate, defineConfig({
  resolve: { alias: [
    { find: '@emailjs/browser', replacement: path.join(root, 'tests/fixtures/emailjs-browser.mjs') },
    { find: '@/config/emailjs', replacement: path.join(root, 'tests/fixtures/emailjs-config.mjs') },
    { find: '@', replacement: path.join(root, 'src') },
  ] },
  define: { 'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify('') },
}));
