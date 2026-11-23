# Phase 5C.1 validation — 23 November 2026

The limited SSR/hydration architecture is proven for the ten requested
documents. This is not approval to deploy or migrate all pages. Strict zero
initial layout shift and exact native-control pixel parity remain unresolved.

## Git safety

- Branch remains `fix/seo-language-consistency`.
- Original and final HEAD: `77ba313d8617a082d349f383e876ac34013eb551`.
- Initial working tree had 31 existing modified/untracked Phase 5B files.
- Baseline contents, status and hashes are under
  `../../dist-ssr/phase5c1-baseline-1795434548776/`.
- SHA-256 comparison of 33 recorded files shows only `package.json` and
  `package-lock.json` changed since that snapshot. All recorded source,
  navigation, SEO, tests, and production Vite configuration remain byte-identical.
- `eslint.config.js` additionally ignores generated `dist-ssr` output. The
  actual experimental TypeScript remains linted.
- No commit, push, merge, deploy, branch deletion, history rewrite or production
  workflow/404 modification occurred.

## Exact implementation inventory

Modified existing files in this phase:

1. `package.json`: isolated typecheck/build/browser commands, playwright-core.
2. `package-lock.json`: one new playwright-core package; Phase 5B jsdom retained.
3. `eslint.config.js`: exclude generated output and the safety snapshot from lint.

Created under `experiments/bilingual-ssr/`:

- `App.tsx`
- `entry-client.tsx`
- `entry-server.tsx`
- `env.d.ts`
- `i18n.ts`
- `index.html`
- `language.ts`
- `LanguageContext.tsx`
- `LanguageLink.tsx`
- `navigation.ts`
- `render-phase.ts`
- `RenderPhaseProvider.tsx`
- `routes.ts`
- `tsconfig.json`
- `vite.config.ts`
- `README.md`
- `VALIDATION.md`

Created scripts:

- `scripts/build-ssr-poc.mjs`
- `scripts/test-ssr-poc.mjs`

The many pre-existing Phase 5B source changes visible in `git status` are not
new Phase 5C.1 edits. The generated reports and screenshots are ignored outputs.

## Static HTML results

Output root: `dist-ssr/poc/site/`. Each row passed in both languages before
JavaScript: lang/dir, exactly one meaningful H1, main content, links, one title,
description, canonical, reciprocal ar/en/x-default, OG locale/URL, parseable
JSON-LD, correctly based image assets, and no loading-only fallback.

| Page | Arabic document | English document | SSR |
| --- | --- | --- | --- |
| Home | `index.html` | `en/index.html` | 2/2 passed |
| BIM Training | `services/bim-training/index.html` | `en/services/bim-training/index.html` | 2/2 passed |
| BIM Fundamentals | `courses/bim-fundamentals/index.html` | `en/courses/bim-fundamentals/index.html` | 2/2 passed |
| Existing project ID 1 | `portfolio/1/index.html` | `en/portfolio/1/index.html` | 2/2 passed |
| Contact | `contact/index.html` | `en/contact/index.html` | 2/2 passed |

The source build fails on an SSR error, render timeout, missing manifest entry,
missing page CSS, or failed HTML assertion. No hydration mismatch is suppressed.

## Actual validation commands

| Command | Result |
| --- | --- |
| `npm.cmd run check` | Passed after implementation |
| ESLint, included in check | 0 errors; 8 existing Fast Refresh warnings |
| Production TypeScript, included in check | Passed |
| Existing automated tests, included in check | 27/27 passed |
| Existing production build, included in check | Passed; original route pipeline retained |
| `npm.cmd run typecheck:poc` | Passed |
| `npm.cmd run build:ssr-poc` | 10/10 complete documents passed |
| `npm.cmd run test:ssr-poc` viewport run | 20/20 passed |
| `npm.cmd run test:ssr-poc -- --diagnostics-only` | Passed including added font isolation and interactive checks |
| `git diff --check` | Passed |

The old Browserslist data warning remains. No unrelated package updates were made.

## Real-browser evidence

Installed Chrome `157.0.8103.79`, Playwright Core, headless, browser sandbox
enabled. Widths: desktop 1440×1000 and mobile 390×844. Each width tested all ten
variants in ordinary motion, reduced motion, and with JavaScript disabled.

- 20/20 viewport cases passed ordinary and reduced-motion hydration checks.
- Zero captured recoverable hydration errors, bootstrap errors or root/H1
  replacements. Original IDs remained present.
- Exactly one title, description, canonical and JSON-LD group after hydration;
  three language alternate links. Initial and hydrated H1, metadata, lang and dir
  matched.
- No failed local asset requests were observed in the tested page loads.
- No horizontal overflow at either viewport.
- Settled H1/main/header geometry matched the no-JavaScript SSR view and current
  approved CSR view with a measured maximum difference of 0 px.
- Screenshot changed-pixel ratios were 0% on most cases; maximum 0.23180% on
  English mobile Contact. Inspection localized that difference to native select
  text painting. Exact pixel parity is not claimed.
- Desktop language switch, unrelated query/hash retention, SPA navigation,
  direct refresh, back/forward history and mobile Radix menu passed.
- An automatic homepage title transition and a real course Radix accordion
  expansion passed. Footer remained reachable after scrolling.
- No animation-control UI was introduced. Production CSS files retain identical
  content hashes: `index-BE38AlGl.css` and `ServiceDetail-BfM4W0i9.css`.

The contact form is intentionally disabled in both local builds because EmailJS
is not configured. The disabled state and fallback are preserved. Actual email
delivery, editable-field interaction, CAPTCHA and Maps remain unverified.
External Maps/CAPTCHA were blocked during browser tests; Google Fonts were
allowed with zero fetch failures. No form was submitted.

### Initial layout shift — acceptance limit

Normal local lab CLS ranged from 0 to 0.0122292; the settled CSR baseline recorded
0 in these runs. The highest value was the English desktop course. These are
local observations, not field Core Web Vitals or a Lighthouse score.

An additional experiment withheld all application JavaScript until HTML/CSS and
fonts settled. English Home and Course reproduced their initial shifts before
application JavaScript was released, and recorded zero shifts after release
through the hydration observation window. Thus those shifts are not caused by
React replacing or re-rendering the server tree. The existing Google Fonts
`@import`/`display=swap` loading behavior is implicated, with sources and phase
recorded in `browser-report.json`.

This proves hydration consistency but does not fulfill a literal zero-load-shift
requirement. A reviewed font-loading/fallback-metrics solution, and rechecking
native select painting, are required before production adoption.

### Problems found and corrected during this experiment

1. Lazy service CSS initially arrived with JavaScript and caused a substantial
   first-layout change. The builder now traverses the Vite manifest and links
   the selected page's dependency CSS in the initial head. Training CLS became
   0 in all four ordinary viewport/language cases.
2. Replacing animated counters with narrower static text in noscript changed the
   Arabic desktop hero width. The final alternative preserves the animated
   element's layout space; the 22 px discrepancy was eliminated.
3. Additional test development initially read the next closed accordion instead
   of the clicked accordion. The final test uses its stable aria-controls ID and
   passes a real expansion. No application workaround was added.

## Evidence files and screenshots

All under `dist-ssr/poc/`:

- `ssr-report.json`: ten initial documents, paths, canonical, title and body size.
- `browser-report.json`: twenty cases, reduced motion, layout measurements,
  hydration errors, interactions, font isolation traces and diagnostics status.
- `git-safety-report.json`: branch, HEAD, hash comparison.
- `screenshots/{desktop|mobile}-{ar|en}-{home|training|course|project|contact}-approved-csr.png`
- Same prefix with `-hydrated.png`, `-ssr-nojs.png`, and `-diff.png`.

These are viewport screenshots, not an exhaustive visual audit of every lower
section or every frame of an animation. Both the ordinary and reduced-motion
tests retain the actual motion runtime.

## Migration and recommendation

The planned legacy `?lang=en` → `/en/` document replacement, preserving other
query parameters and hash, is documented in README only. No global redirects or
production 404 behavior changed. GitHub Pages is
[static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages);
query-aware HTTP redirects would require capabilities beyond this static build.

The output deliberately lacks the other 21 route types, a full bilingual
sitemap, complete localized 404 handling and production deployment integration.
It must not be published as the whole website. Static offer/date freshness,
active paid-course offers, other browser engines and actual Pages response
behavior need coverage before production migration.

Recommendation: the SSR approach is technically viable. Phase 5C.2 can be
approved as a controlled implementation phase to replace the guarded overlays
with shared APIs, resolve the font/native-control acceptance limits, then
extend the route registry and build integration. Do not approve immediate full
migration or deployment on the strength of this PoC alone. No Phase 5C.2 work
has been started.
