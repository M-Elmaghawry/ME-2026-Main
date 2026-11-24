> Historical checkpoint: the NUL-byte renderer blocker below has since been
> resolved in the candidate. See [the renderer resolution and resumed-validation report](./PHASE-5C2-RENDERER-RESOLUTION.md)
> for current results and the remaining contact-draft/visual acceptance blockers.

# Phase 5C.2 checkpoint — renderer blocker

Date: 24 November 2026 (Asia/Riyadh)

Status: **implementation stopped during Stage B; not release-ready**.
This is a checkpoint report, not an assertion that Stages A–F passed.

## Safety and approval boundary

Repository: `M-Elmaghawry/ME-2026-Main`.
Branch: `fix/seo-language-consistency`.
Unchanged HEAD: `616197ee00442cf90a38436a52f6f994b9b84e0a`.
The working tree was clean at the start; the uncommitted changes listed below
are this implementation attempt. No commit, push, merge, deployment, branch
change, reset, or file discard was performed.

The approved checkpoint says:

> If an architectural blocker, substantial visual regression, or unexpected change to business functionality is found, stop and report it before continuing.

The candidate's Node streaming renderer corrupts some Arabic output. The build
rejects that output. Implementation stopped rather than filtering corrupted
HTML, patching dependencies, upgrading React, or proceeding to browser validation.

The existing `build`, `build:dev`, `build:gh-pages`, `check`, and `test` commands,
root `vite.config.ts`, dependency lockfile, and active GitHub Pages workflow
remain unchanged. Shared source refactors are present, and the existing build
and tests still pass. This does not constitute a completed visual audit.

## Blocker and reproduction

Installed environment: Node 24.19.0, React/React DOM 18.3.1, Vite 7.3.2.

Run:

```powershell
npm.cmd run build:ssg-candidate
```

Client and server bundle compilation completes, but rendering the first Arabic
document inserts NUL bytes into the streamed HTML. The final build guard fails
before publishing the first document or writing a success report/sitemap.

Captured evidence (ignored generated files):

- `dist-ssr/candidate/repo/debug-body.html`: actual corrupt SSR output.
- `dist-ssr/candidate/repo/blocker-report.json`: eight NUL bytes and surrounding text.

Example text, with the invisible byte escaped: `مشروع م\u0000نجز`.
An affected image attribute contains `شرك\u0000ة` where the source filename is
`شركة`. HTML parsing turns that byte into U+FFFD, so the image URL no longer
matches the real file. Source content and filenames do not contain that byte.
The error also reproduces by importing the generated server bundle in a fresh
Node process with `NODE_ENV=production`; it is not just the HTML validator.

The symptom matches [React issue #31134](https://github.com/facebook/react/issues/31134),
which documents React 18.3.1 `renderToPipeableStream` emitting extra NUL bytes
at multibyte chunk boundaries. The issue links the upstream fix and describes
alternative renderers. This is supporting evidence; the local captured output
is the basis for blocking this candidate.

Recommended next investigation: evaluate React 18's `renderToReadableStream`
from `react-dom/server.browser` in the build-time Node process, awaiting
`allReady`, then repeat raw-byte, asset, and hydration validation. This keeps
React 18 and streaming SSR without a dependency upgrade or HTML sanitization.
It has **not** been implemented or tested here. A narrowly maintained upstream
backport or a React upgrade would need separate review and broader regression
coverage. Changing markup until the byte boundary moves is not a reliable fix.

## Architecture work present

- `src/lib/routes.ts` is the shared registry of route patterns and page IDs.
  Existing content collections expand its dynamic routes to the 26 indexable
  paths in `src/lib/routePaths.ts`. IDs and slug case are retained.
- `src/app/RouteContent.tsx` maps registry IDs to lazy page modules; the existing
  browser app and candidate both consume it. No content page was duplicated.
- URL and SEO helpers accept an explicit `query` or `path` mode. The ordinary
  browser app retains the existing query-language policy. The candidate selects
  Arabic paths and `/en/` English paths. Assets use the independent deployment base.
- Translation resources were extracted verbatim into `src/i18n/resources.ts`.
  A direct comparison against HEAD confirmed exact content preservation after
  changing only the export declaration. Each SSR document gets a new i18next instance.
- Shared render context carries a serialized build timestamp, site-timezone year
  and localized date strings. Course timers still adopt real browser time through
  their existing effect. Legal dates/footer remain build snapshots in the candidate.
- About and service reduced-motion hooks share a deterministic hydration phase.
  Ordinary motion and slideshows remain in source; no Pause/Play controls were added.
- Candidate-only counter markup offers final no-JavaScript values while retaining
  animated layout. Privacy Policy and Terms gain a main landmark without copy changes.
- Browser-only history state is withheld during candidate hydration. The auxiliary
  contact-result shell reuses Contact content and never asserts a successful send.
- `ssg/` contains the separate candidate app, server/client entries, template,
  configuration, and TypeScript project. It uses the shared page components.
- The Phase 5C.1 harness now consumes shared translation/render APIs instead of
  guarded source replacements. Its original documentation is retained with a
  dated-context maintenance note; new browser results have not been claimed.

## Intended candidate output and SEO

The builder is designed for 26 Arabic and 26 English indexable documents plus
two contact-result shells and two localized 404 files. It collects dependency CSS
from the Vite manifest and serializes language, route, clock, base, site URL, and
React identifier prefix before hydration. Server errors, timeouts, incomplete
content, invalid characters, missing assets, and invalid metadata reject the build.

The HTML validator checks main/H1 content, lang/dir, metadata uniqueness,
canonical/alternate/OG values, unchanged JSON-LD, bootstrap data, base-aware assets,
and initial page CSS. The sitemap validator expects 52 distinct canonical URLs
with reciprocal ar/en/x-default alternates; thank-you and 404 documents are excluded.

**Actual generation result: 0/52 accepted indexable documents.** The first
document is rejected; no successful 52-document or sitemap report exists.
The candidate client/server bundles and template under `site/` are incomplete
intermediate output and must not be published.

## Validation actually performed after these changes

| Command or inspection | Result |
| --- | --- |
| `npm.cmd run typecheck` | Passed |
| `npm.cmd run typecheck:ssg` | Passed |
| `npm.cmd run typecheck:poc` | Passed |
| `npm.cmd run lint` | Passed, 0 errors and the original 8 Fast Refresh warnings |
| `npm.cmd test` | 27/27 passed |
| `npm.cmd run build` | Passed using the unchanged production command |
| `npm.cmd run build:ssg-candidate` | Blocked: invalid characters in first Arabic SSR document |
| Translation extraction comparison against HEAD | Identical resources |
| Business data/configuration and dependency lockfile | No changes |
| Production CSS output | Same `index-BE38AlGl.css` and `ServiceDetail-BfM4W0i9.css` hashes as baseline |

Existing tests cover production contact validation, prices, images, routing,
query-language navigation, canonical/hreflang behavior, and root/repository/custom
base policies. They do not validate the new candidate's complete behavior.
The old Browserslist data warning remains; no unrelated update was made.

Not performed for this candidate: 52-document acceptance, full sitemap acceptance,
hydration/error/root-identity tests, desktop/mobile/tablet browser tests,
no-JavaScript and reduced-motion browser checks, visual screenshot comparisons,
slideshow interaction checks, legacy URL browser tests, auxiliary/404 browser tests,
or candidate builds under root/custom-domain configurations. Phase 5C.1's earlier
20-case browser success predates these refactors and cannot substitute for them.

## Routing, 404, and remaining integration risks

The early-head legacy helper is intended to migrate `?lang=en` to `/en/`, remove
`?lang=ar`, retain unrelated query values and fragments, and safely restore old
same-origin `__spa` links within the deployment base. No candidate redirect tests
have run. Language switching requests the counterpart document; same-language
navigation remains client-side. Router links remove the obsolete language query.

The candidate does not emit the old global success-page SPA redirect fallback.
It prepares a noindex 404 document with an alternate-language home link and an
English 404 file. GitHub Pages generally serves the root custom 404 for unknown
paths, including unknown `/en/` paths; the root fallback therefore includes both
languages. English fallback selection and actual response status need staging
verification. No query-aware HTTP 301/308 redirect capability is assumed.

The contact-result hydration and state adoption need dedicated tests, including
retry-draft restoration on direct refresh. They are incomplete candidate work,
not verified business-function parity. No contact messages were sent.
EmailJS delivery, CAPTCHA, and Maps remain unverified locally.

No candidate font-loading changes were made. Phase 5C.1 observed font-related
initial CLS up to roughly 0.01223 and a Contact native-select screenshot difference
up to roughly 0.232%. They remain open investigations; no new CLS or browser
compatibility claim is made. Typography and existing stylesheet content are unchanged.

Static prices, date labels, and footer years require an explicit rebuild/freshness
policy before release. The current data contains no active scheduled offers;
offer-boundary behavior still needs candidate coverage.

## Proposed CI/deployment changes — not applied

Only after candidate acceptance, propose a separate CI job that installs the
locked dependencies, runs existing checks plus candidate typechecking, builds
repository/root/custom configurations, validates all 52 documents and sitemap,
and runs installed-browser hydration/visual/interaction coverage. Keep candidate
artifacts separate from the currently uploaded `dist` artifact. Review Node/browser
versions and contact environment configuration in that job.

Switching the deployment build/upload target to a validated candidate must be
separately approved. The current `main` push/workflow-dispatch deployment remains
unchanged. No release or deployment action has begun.

## Rollback strategy

There is no deployed change to roll back. Leave current Pages deployment and
workflow as they are. To abandon this local attempt, first preserve/review its
diff and new files; obtain explicit direction before reverting the specific
Phase 5C.2 files. Do not reset, clean, or discard other work. The baseline commit
remains `616197e`, and earlier generated evidence was preserved under
`dist-ssr/resume-review-backup-20261124-093527/` during the initial verification.
For a future approved release, retain its predecessor artifact/commit and revert
the build/upload selection to the last known-good artifact through a separately
approved change; do not route all unknown URLs to a success page.

## Full source-file inventory at this checkpoint

Modified:

```text
experiments/bilingual-ssr/App.tsx
experiments/bilingual-ssr/README.md
experiments/bilingual-ssr/VALIDATION.md
experiments/bilingual-ssr/i18n.ts
experiments/bilingual-ssr/index.html
experiments/bilingual-ssr/vite.config.ts
package.json
src/App.tsx
src/components/ContactForm.tsx
src/components/PageSeo.tsx
src/components/layout/Footer.tsx
src/components/sections/HeroSection.tsx
src/components/services/useServicePage.ts
src/contexts/LanguageContext.tsx
src/hooks/useLocalizedNavigation.ts
src/i18n/index.ts
src/lib/seo.ts
src/lib/urls.ts
src/pages/About.tsx
src/pages/ContactResult.tsx
src/pages/CourseDetail.tsx
src/pages/NotFound.tsx
src/pages/PrivacyPolicy.tsx
src/pages/Terms.tsx
tests/navigation-language.test.mjs
```

Created:

```text
docs/PHASE-5C2.md
scripts/build-ssg.mjs
scripts/ssg-html.mjs
src/app/RouteContent.tsx
src/contexts/RenderProvider.tsx
src/contexts/RoutingContext.ts
src/contexts/renderState.ts
src/i18n/createPageI18n.ts
src/i18n/resources.ts
src/lib/legacy.ts
src/lib/routePaths.ts
src/lib/routes.ts
ssg/App.tsx
ssg/entry-client.tsx
ssg/entry-server.tsx
ssg/index.html
ssg/tsconfig.json
ssg/types.ts
ssg/vite.config.ts
```

Deleted: none. Dependency upgrades: none. Generated ignored build/debug files are
not source changes. All changes remain uncommitted and available for review.
