# Phase 5C.1 — isolated bilingual SSR/hydration proof

This is an experiment, not a deployable replacement for the production build.
It reuses five existing React pages and their content, translations, images,
Framer Motion sequences, and components. No source page is rewritten.

## Git boundary

Started on `fix/seo-language-consistency` at
`77ba313d8617a082d349f383e876ac34013eb551`, with 31 existing modified/untracked
Phase 5B files. Their original contents and SHA-256 hashes were recorded in
`dist-ssr/phase5c1-baseline-1795434548776/`. Do not discard that directory when
reviewing the work. No commit, merge, push, deployment, or branch operation is
part of the experiment.

Only `package.json`, `package-lock.json`, and `eslint.config.js` are extended
outside this experimental directory and its two scripts. The existing npm
production build scripts and deployment workflows remain unchanged.
`playwright-core` is the only new dependency; it uses an installed browser.

## Reproduce

Use a Node version supported by the existing lockfile (validated on Node 24.19).

```powershell
npm.cmd run check
npm.cmd run typecheck:poc
npm.cmd run build:ssr-poc
npm.cmd run test:ssr-poc
```

To repeat only the additional font/hydration isolation and interactive checks
after a completed 20-case run:

```powershell
npm.cmd run test:ssr-poc -- --diagnostics-only
```

This retains the earlier viewport results in the report; it does not rerun the
20 screenshot comparisons. See [VALIDATION.md](./VALIDATION.md) for actual
results and the remaining acceptance limits.

The browser test needs the production `dist` from `npm run build`, installed
Chrome or Edge, and permission to launch it and bind local HTTP ports. It does
not download a browser. Set `CHROME_PATH` for a different installed Chromium.
Google Fonts requests are allowed and cached during a test; unrelated external
Maps/CAPTCHA requests are blocked. No contact messages are submitted.

Output is ignored by Git under `dist-ssr/poc/`:

- `site/`: client assets and exactly ten generated route documents.
- `server/entry-server.mjs`: build-time SSR bundle, never needed on GitHub Pages.
- `ssr-report.json`: static HTML assertions per document.
- `browser-report.json`: actual browser evidence and any failures.
- `screenshots/`: approved CSR, hydrated SSR, no-JavaScript, and pixel diffs.

Default deployment base: `/ME-2026-Main/`. Default canonical origin and base:
`https://m-elmaghawry.github.io/ME-2026-Main/`.
`SSR_POC_BASE_PATH` and `SSR_POC_SITE_URL` can configure a separate experimental
build; their paths must agree. The locale prefix is never part of the asset
base. A custom-domain root would use `/` and its corresponding origin.

| Page | Arabic document under site/ | English document under site/ |
| --- | --- | --- |
| Home | `index.html` | `en/index.html` |
| BIM Training | `services/bim-training/index.html` | `en/services/bim-training/index.html` |
| BIM Fundamentals | `courses/bim-fundamentals/index.html` | `en/courses/bim-fundamentals/index.html` |
| Existing project 1 | `portfolio/1/index.html` | `en/portfolio/1/index.html` |
| Contact | `contact/index.html` | `en/contact/index.html` |

## Rendering and hydration

1. Vite produces an isolated client bundle and a Node SSR bundle.
2. Each document gets a fresh i18next instance, explicit language, logical route,
   production base, build timestamp, and stable React identifier prefix.
3. `StaticRouter` on the server and `BrowserRouter` on the client use the same
   locale-specific basename. Source IDs remain unchanged.
4. `renderToPipeableStream` waits for `onAllReady`. SSR errors or timeouts reject
   the build; the HTML assertions reject empty/loading-only documents.
5. Metadata comes from the existing SEO content. Canonical and reciprocal
   hreflang use the experimental path policy; existing JSON-LD is preserved.
   The Vite manifest supplies page dependency CSS in the initial head, preventing
   lazy service CSS from causing an initial layout change.
6. Bootstrap data initializes i18n before `hydrateRoot`. The initial head is
   retained; navigation updates only the existing metadata group. Recoverable
   errors are recorded, not suppressed. Initial main/H1 node identity and IDs
   are checked in a real browser.
7. Switching language deliberately requests the corresponding static document,
   preserving unrelated query parameters and hash. Within one language,
   navigation continues through React Router.

### Experimental compatibility adapters

Vite aliases redirect only the experimental bundle to language/navigation
adapters. A guarded in-memory plugin extracts the existing translation object
and adapts four source modules without writing them:

- Footer: stable first-render year from the build snapshot.
- Course detail: stable initial pricing/countdown timestamp, then the existing
  effect adopts the actual browser time and continues its original timer.
- Service motion hook: server and first client render share a reduced-motion
  value; the actual preference is adopted after the Suspense boundary hydrates.
- Hero rolling counters: a no-JavaScript final-value alternative occupies the
  same layout space as the animated counter. The existing animated counter
  remains visible with JavaScript.

No animation controls are added. Existing Framer Motion and normal interactions
remain in place. Reduced-motion CSS applies immediately, and noscript CSS
reveals initially hidden content. Every overlay requires an exact source match
and fails if the source changes unexpectedly.

These overlays establish feasibility with minimal risk to Phase 5B. They are
not a maintenance strategy for 52 documents: replace them with reviewed shared
resource, render-clock, routing, and hydration APIs before production adoption.

The server/client API pairing and shared identifier-prefix requirement follow
the [React SSR documentation](https://react.dev/reference/react-dom/server/renderToPipeableStream)
and [hydration documentation](https://react.dev/reference/react-dom/client/hydrateRoot).
The implementation was executed with this repository's React 18.3.1.

## Legacy URLs — planned only

No automatic migration redirects or production 404 changes are implemented.

| Incoming form | Future destination | Proposed handling after approval |
| --- | --- | --- |
| `/route/` | `/route/` Arabic | Retain as canonical |
| `/route/?lang=ar` | `/route/` | Remove only the language parameter with client `replace` |
| `/route/?lang=en` | `/en/route/` | Client document `replace` before hydration |
| `/en/route/` | same English URL | Native generated static document |
| Unrelated query/hash | same query/hash at destination | Preserve values; do not send fragments to the server |
| Missing final slash | slash form | Verify GitHub Pages directory normalization before release |
| Unknown route | unknown | Separate reviewed localized 404 design; no soft-404 success fallback |

GitHub Pages does not select a different HTML file for a query parameter. A
client redirect cannot provide an HTTP 301/308, cannot fix the original HTML for
JavaScript-disabled readers, and is weaker for migration than a server redirect.
Real query-aware permanent redirects need hosting/edge support beyond static
Pages. Do not invent `_redirects` support or deploy a global SPA fallback.

## Deliberate limits and approval before Phase 5C.2

- Only these five route families exist in the experimental router. Existing
  links to other pages retain their destinations, but those pages are not
  generated by this PoC. The output must not be deployed as the full website.
- The production sitemap/robots/404 pipeline is not migrated. Any copied public
  files are not a complete locale-aware site configuration.
- Existing structured data is carried through and syntax-checked; no new
  business claims or page-specific schema types are invented.
- Contact fields may be disabled without EmailJS environment configuration,
  matching the current app. Real email/CAPTCHA/Maps integration is unverified.
- Course prices and footer dates in static HTML are build snapshots. Offer
  expiry/new-year freshness requires a production rebuild policy or an approved
  deterministic placeholder strategy; the client alone cannot refresh no-JS HTML.
- Browser CLS values are local lab observations, not field Core Web Vitals.
  Screenshot diffs compare settled viewport renders with a small allowance for
  ongoing automatic animation. They are not proof of every animation frame.
- GitHub Pages response codes, legacy redirects, custom-domain deployment, and
  other browsers need separate staging validation. This PoC does not change them.

Before full migration, approve: shared adapter extraction and clock policy;
the full 26-route bilingual registry and sitemap; legacy URL handling and real
404 behavior; a production/staging build integration; and the final reviewed
visual/browser evidence. Full migration, production deployment, and Git actions
require their own explicit authorization.
