import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "node:fs";
import { DEFAULT_SITE_URL, metadataHtml, normalizeSiteUrl, pageMetadata, seoPaths, sitemapXml } from "./src/lib/seo";
import { prepareImages } from './scripts/optimize-images.mjs';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  await prepareImages();
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH || "/";

  if (!base.startsWith("/") || base.startsWith("//") || /[?#\\]/.test(base)) {
    throw new Error("VITE_BASE_PATH must be an absolute pathname, such as / or /ME-2026-Main/.");
  }
  const basePath = base.endsWith("/") ? base : `${base}/`;
  let resolvedBase = basePath;
  let siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || new URL(basePath, DEFAULT_SITE_URL).href);
  const withMetadata = (html: string, route: string) => html.replace(
    /<!-- PAGE_SEO_START -->[\s\S]*?<!-- PAGE_SEO_END -->/,
    `<!-- PAGE_SEO_START -->\n${metadataHtml(pageMetadata(route, 'en', siteUrl))}\n<!-- PAGE_SEO_END -->`,
  );

  return {
    base: basePath,
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      {
        name: "github-pages-spa-fallback",
        enforce: "post",
        configResolved(config) {
          resolvedBase = config.base;
          siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || new URL(resolvedBase, DEFAULT_SITE_URL).href);
        },
        transformIndexHtml(html) {
          return withMetadata(html, '/');
        },
        generateBundle(_options, bundle) {
          this.emitFile({
            type: "asset",
            fileName: "404.html",
            source: readFileSync(path.resolve(__dirname, "templates/404.html"), "utf8")
              .replace("__APP_BASE__", JSON.stringify(resolvedBase)),
          });
          const entry = bundle['index.html'];
          if (entry?.type === 'asset') {
            for (const route of seoPaths.filter((route) => route !== '/')) {
              this.emitFile({ type: 'asset', fileName: `${route.slice(1)}/index.html`, source: withMetadata(String(entry.source), route) });
            }
          }
          this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) });
          this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n` });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
