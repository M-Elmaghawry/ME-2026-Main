# Phase 5C.2-F — focused regression fixes and local release validation

24 November 2026, Asia/Riyadh. Repository: `M-Elmaghawry/ME-2026-Main`.

Branch: `fix/seo-language-consistency`. HEAD remains
`616197ee00442cf90a38436a52f6f994b9b84e0a`. No commit, push, merge or deployment.

**The confirmed local blockers are resolved.** All 174 browser matrix cases,
38 interaction checks, 10 mocked-contact checks and 39 automated Node tests pass.
The candidate is ready for review of the completed local Phase 5C.2 validation.
Production deployment remains a separate approval and verification step.

## Preservation and scope

Before editing, the 58 existing changed/untracked files, their SHA-256 hashes,
Git status and existing candidate artifacts were copied to
`dist-ssr/phase5c2-f-baseline-1795513201966/`. The earlier Phase 5B/5C.1/5C.2
work and renderer diagnostics remain present. The full final change inventory
below distinguishes this phase from those preserved changes.

The user's typography clarification governs this phase: preserve the implemented
**Noto Sans Arabic and Inter**. IBM Plex Arabic/Poppins are not replacements
authorized here. The fix changes font delivery only, preserving the original
families, weights, unicode ranges and display policy. No business data,
translations, service/course/portfolio content, navigation UI, deployment
configuration, dependency version or lockfile is changed by this phase.

The architecture remains 26 Arabic pages at existing paths and their 26 English
counterparts under `/en/`, plus four noindex auxiliary documents. React 18.3.1
Web Streams SSR, `allReady`, fatal UTF-8 decoding and client hydration are retained.
The ordinary production build remains Vite's existing CSR build; the SSG build
remains a separate local candidate.

The retained renderer A/B reproduction, exact NUL-byte offsets and original
Arabic/image-path corruption are documented in
[PHASE-5C2-RENDERER-RESOLUTION.md](PHASE-5C2-RENDERER-RESOLUTION.md).
This phase preserves that supported Web Streams resolution and its build guards.

## Contact retry: cause, fix and privacy

The archived CSR baseline retains retry drafts in React Router's browser history
state and recovers them after refresh. The candidate intentionally withholds
that browser-only state during SSR and the matching first hydration render.
React Hook Form therefore mounts with empty cached defaults. When the history
draft becomes available after hydration, new `defaultValues` alone do not
populate the mounted form. History itself was not lost.

`ContactForm.tsx` now adopts each explicit retry draft once with `reset`, after
hydration releases the state. It subscribes to dirty fields and preserves edits
if the user has already typed. A successful retry replaces its active recovery
entry with the success result, preventing Back from reopening that completed
retry draft. An ordinary successful submission keeps its original navigation.
The path-language switch also carries existing Router state into the counterpart
document's history entry before reloading, preserving the legacy stateful flow.

No contact fields are added to static HTML, bootstrap JSON, URLs, localStorage
or sessionStorage. Drafts remain in the existing retry history flow. CAPTCHA
tokens are excluded and reset after submission. Cleanup covers the active retry
entry; browser history is not treated as secure storage or rewritten wholesale.

Evidence: `dist-ssr/phase5c2-f/contact-report.json` — **10/10 passed**, Arabic
and English: baseline retry/refresh, candidate initial load, mocked failure,
retry, refresh with JavaScript held, all seven expected fields recovered,
subsequent edits preserved, successful retry cleanup, Back behavior and language
switch recovery. Root nodes were retained; recoverable hydration errors: zero.
Real EmailJS requests: **zero**. The test-only EmailJS/config aliases and CAPTCHA
disablement are confined to `contact-fixture`; the build rejects using that
diagnostic config with another variant. The fixture must never be published.

React Hook Form documents cached defaults and the reset/dirty-field contract:
[useForm](https://react-hook-form.com/docs/useform),
[reset](https://react-hook-form.com/docs/useform/reset).

## CLS: traced cause and focused fix

Chrome performance traces and `PerformanceObserver` record every shift, affected
node, old/new rectangles, font events, resource timing and hydration completion.
These measurements use normal motion, real time, one browser/page at a time,
and no hidden content, animation disabling or clock mocking. The external font
binary response has the same controlled 200ms cold-network delay in baseline
and candidate tests. Local font delivery is intentionally unaffected by that
external-network delay. These are repeatable lab results, not field CWV claims.

The large shifts are **font swaps before hydration**. On Arabic Workshop 03 at
390×844, the instructor row moves from y=491 to y=525 and the following content
from y=563 to y=597 as text/tags reflow. In the JavaScript-held reproduction,
the shift occurs at 341ms, font loading finishes at 342ms, JavaScript is released
at 646ms and hydration completes at 701ms. CLS is 0.217026 before React starts.
The English paid-course text/tags similarly reflow by 28px. Trace inspection
does not identify root replacement, missing image dimensions, header injection
or an unresolved Suspense boundary as the cause of these large shifts.

The exact original Google font binaries are now bundled locally: Inter v20 and
Noto Sans Arabic v33, 12 WOFF2 files, 470,004 bytes total. The candidate preloads
the three primary faces (245,632 bytes) and begins asynchronous font decoding
early using detached `FontFace.load()` calls. These do not wait for fonts, hide
content or register replacement faces. Errors are reported. CSS still uses the
original `font-display: swap`. Vite fingerprints the files and base-relative
URLs; all three deployment-base candidates validate their references. Original
provider CSS, URL/version provenance, SHA-256 catalog and OFL licenses are kept;
licenses also ship in `font-licenses.txt`. Downloads are an explicit maintenance
script, not a build-time network dependency.

Preload-only testing retained one 0.165 English shift, so it was not accepted.
The final early-decode series includes five runs per route/viewport:

| Route and viewport | Candidate before, 3 runs | Candidate final, 5 runs | Archived CSR final-series comparison |
| --- | --- | --- | --- |
| Arabic Workshop 03, 390×844 | 0.136328–0.217384 | 0, 0, 0, 0, 0 | 0.136351–0.139090 |
| English paid course, 390×844 | 0.165081 each | 0, 0, 0, 0, 0 | 0.165081 each |
| Arabic Workshop 03, 1440×1000 | max 0.001983 | 0, 0, 0, 0.001983, 0 | max 0.004979 |

Final candidate maximum: **0.001983404**, below the **0.1** target in **15/15**
load runs. The two final JavaScript-held isolations also score zero. Font network
failures and hydration errors: zero. Input-triggered shifts are recorded and
excluded using the layout-shift API's `hadRecentInput` and CLS session windows.

Evidence directories under `dist-ssr/phase5c2-f/`:
`layout-before/` (20 traces), `layout-after/` (20 preload-only traces),
`layout-after-decode/` (32 final traces), each with screenshots and `report.json`.
The final report includes the asserted 15-run budget. Future traces can enforce
it directly with `--assert-budget`.

## Reduced motion and visual verification

The initial reduced Home discrepancy was real: the archived CSR stat cards
could remain at opacity zero while waiting for their scroll intersection.
The shared stat-card component now exposes the final values for reduced motion
without that scroll dependency. Normal-motion entrance and rolling behavior are
preserved. A second reduced-motion issue appeared in service headings: the SSR
hidden variant's 30px offset could remain after hydration changed `initial` to
false. The shared service reveal now explicitly animates to its existing visible
variant when the preference becomes known. No service content/layout is edited.

The reduced matrix compares the candidate with the newly built shared CSR source
because the archived CSR contains the stat-card accessibility defect. Normal,
Edge and tablet comparisons retain the archived approved design baseline.

Visual diagnostics also separated test artifacts from product defects:
foreground/font-readiness synchronization fixes premature no-JS text measurement;
explicit document clips fix inconsistent RTL screenshot framing; matching
grayscale text rasterization avoids LCD/composited-layer smoothing differences
when computed fonts, colors and geometry are identical. Earlier failure summaries
remain in `priorFailures`; the 2.5% pixel threshold was not raised. Live geometry and CLS
are measured separately from normalized screenshot animation phases. Automatic
home-title text is masked only in static comparisons, with unmasked captures
retained and live progression tested separately. No visitor-facing motion controls
were introduced. No product animations are disabled by the capture harness.

All **174** accumulated browser matrix cases pass, with zero recoverable
hydration errors, missing local assets or geometry differences between static,
hydrated and baseline H1/main/header boxes. Maximum changed-pixel fractions
remain below the unchanged 2.5% threshold:

| Matrix | Passed | Maximum changed pixels | Baseline |
| --- | ---: | ---: | --- |
| Chrome normal, all routes, desktop/mobile | 104 | 1.0958% | Archived approved CSR |
| Chrome reduced, representative routes, desktop/mobile | 28 | 0% | Current shared CSR |
| Edge, representative routes, desktop/mobile | 28 | 1.0959% | Archived approved CSR |
| Chrome tablet, representative routes, 768×1024 | 14 | 1.9462% | Archived approved CSR |

Representatives are Home, About, BIM Training, BIM Coordination, paid Course
Detail, Portfolio 1 and Contact, in both languages. Edge was actually run with
the installed Microsoft Edge executable. It agrees with Chrome on the checked
typography, RTL/LTR, card/form geometry, images, hydration and responsive layouts;
there is no outstanding Edge-specific difference in this matrix. Detailed
computed-style/platform-font diagnostics are in `dist-ssr/phase5c2-f/paint/`;
final aggregate results are in `dist-ssr/phase5c2-f/browser-summary.json`.

## Reproduction commands

```powershell
npm.cmd run check
npm.cmd run typecheck:ssg
npm.cmd run typecheck:poc
npm.cmd run test:ssg
npm.cmd run build:ssg-candidate
npm.cmd run build:ssg-candidate -- --variant root --base / --site-url https://elmekawy-bim.com/
npm.cmd run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/
npm.cmd run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
node scripts/test-contact-retry.mjs
node scripts/test-ssg-browser.mjs --clocked
node scripts/test-ssg-browser.mjs --reduced --baseline dist --clocked
node scripts/test-ssg-browser.mjs --smoke --edge --clocked
node scripts/test-ssg-browser.mjs --tablet --clocked
node scripts/test-ssg-browser.mjs --extra
node scripts/trace-ssg-layout.mjs --stage final --runs 5 --investigate --assert-budget
```

Browser commands require an installed Chrome/Edge and local process permission.
`--resume` preserves successful case evidence and retains prior failures while
continuing an interrupted matrix. A fresh run omits that option.

## Validation results and limits

Environment: Node 24.19.0; React/React DOM 18.3.1; Chrome 158.0.8127.88;
Edge 158.0.4370.33. Dependencies and lockfile are unchanged.

| Check | Result |
| --- | --- |
| ESLint | Passed: 0 errors, 8 existing Fast Refresh warnings |
| Production application and Vite TypeScript | Passed |
| SSG TypeScript | Passed |
| Phase 5C.1 experiment TypeScript | Passed |
| Existing tests | 27/27 passed |
| SSG renderer, static contract, integrity and exact-font tests | 12/12 passed |
| Existing production build | Passed |
| Repo, root and custom-base candidate builds | Passed: 52 indexable + 4 auxiliary each |
| Separate mocked-contact fixture build | Passed; excluded from publishable candidates |
| Chrome normal motion | 104/104 passed: all 52 routes at desktop and mobile |
| Chrome reduced motion | 28/28 passed: 7 representative routes × 2 languages × 2 viewports |
| Edge representative desktop/mobile | 28/28 passed |
| Chrome tablet representative routes | 14/14 passed |
| Focused mocked-contact browser checks | 10/10 passed |
| Routing/interaction checks, including added reduced-motion regressions | 38/38 passed |
| Dedicated repeated CLS budget | 15/15 passed; maximum 0.001983404 |
| JavaScript syntax checks | 10 changed/new modules passed |
| Git whitespace check | Passed; existing LF/CRLF conversion notices only |

Each candidate's 56 documents has a per-file integrity result in its
`ssr-report.json`. An independent final read-back of all **168 documents** is
recorded in `dist-ssr/phase5c2-f/integrity-report.json`: **zero NUL bytes,
invalid UTF-8 sequences and replacement characters**. The complete static
contract also verifies Arabic/English language and direction, H1/main content,
one title/description/canonical/JSON-LD set, reciprocal alternates, asset paths,
resolved SSR, 52 canonical sitemap URLs, auxiliary noindex and `.nojekyll`.
The existing raw-byte and fatal-decoding guard remains mandatory in generation
and tests; it rejects corruption rather than cleaning strings.

Hydration checks verify preservation of original main/H1 nodes and IDs, no
recoverable or bootstrap errors, no missing local assets and correct bilingual
metadata. Browser reports and baseline/hydrated/no-JS screenshots are under
`dist-ssr/candidate/repo/`; the wider interaction report covers root and arbitrary
subpath direct navigation, refresh, history, language switching, legacy query
URLs, old SPA restoration, 404 behavior, auxiliary routes, mobile menus,
accordions, footer, automatic title/slideshow progression and reduced motion.

Matrices were completed incrementally with `--resume`. Successful unaffected
cases are retained, failed cases are rerun after diagnosis, and the reports
identify clock-controlled captures. This is not a claim that every accumulated
case used the same capture-harness revision. The dedicated performance traces
use real time and are independent of screenshot normalization.

Build notices: the existing Browserslist dataset is old, and Vite notes that SEO
is imported both dynamically and statically in the SSR server bundle. Neither
is a failing check; no dependency update was performed.

Limits: all results are local lab checks. Real EmailJS, CAPTCHA and Maps calls
were blocked or mocked. No physical-device, Safari or Firefox coverage is
claimed. CI's Node 22 environment and actual GitHub Pages/custom-domain response
headers, redirects and 404 status handling were not executed. Local servers
emulate those paths. Deployment remains unchanged and no candidate was uploaded.

## Exact change scope

Runtime fixes are confined to Contact form recovery/cleanup, stateful language
switching, reduced-motion stat/reveal completion and delivery of existing fonts.
`src/index.css` differs only in its first import; the remainder is byte-identical
to HEAD. `ssg/index.html` is byte-identical to the starting snapshot. Dependency
objects, existing production/check/test command definitions, `vite.config.ts`,
deployment workflow, lockfile, business data and site configuration were checked
for preservation. The only added npm commands are `test:contact-retry` and
`test:layout`.

Generator/test support includes early font hints, preload asset validation,
an isolated contact fixture, focused contact and reduced-motion regressions,
layout tracing/budget enforcement and stable browser capture diagnostics. The
font integrity test reconstructs the original provider stylesheet exactly after
substituting the original remote URLs back in, and checks all 12 SHA-256 hashes.

The cumulative Git inventory below lists every changed/untracked source file,
including work inherited from earlier phases. Generated artifacts remain in
ignored `dist`/`dist-ssr` directories and are not part of the source inventory.

## Remaining blockers and recommendation

No confirmed local regression blocker remains. Contact recovery and cleanup,
font-swap CLS, reduced-motion visibility/reveal completion and Edge acceptance
are resolved within the authorized scope. Typography and normal automatic motion
remain unchanged. Recommend reviewing the completed local candidate and then,
under separate approval, verifying it in the intended hosting environment before
production release. The current production workflow still builds the existing CSR
site; this phase does not switch deployment to SSG.

The evidence is retained locally. No commit, push, merge or deployment was made.

## Full Git change inventory

86 source paths: 60 untracked and 26 tracked modifications. This phase updates 11 earlier-work files, modifies one previously clean file, and adds 27 files; 47 earlier-work files are byte-identical to the starting snapshot. No starting file was deleted; all 58 saved copies retain their original SHA-256 hashes.

| Git status | Path | This phase |
| --- | --- | --- |
| `M` | `experiments/bilingual-ssr/App.tsx` | Preserved earlier work |
| `M` | `experiments/bilingual-ssr/README.md` | Preserved earlier work |
| `M` | `experiments/bilingual-ssr/VALIDATION.md` | Preserved earlier work |
| `M` | `experiments/bilingual-ssr/i18n.ts` | Preserved earlier work |
| `M` | `experiments/bilingual-ssr/index.html` | Preserved earlier work |
| `M` | `experiments/bilingual-ssr/vite.config.ts` | Preserved earlier work |
| `M` | `package.json` | Updated earlier work |
| `M` | `src/App.tsx` | Preserved earlier work |
| `M` | `src/components/ContactForm.tsx` | Updated earlier work |
| `M` | `src/components/PageSeo.tsx` | Preserved earlier work |
| `M` | `src/components/layout/Footer.tsx` | Preserved earlier work |
| `M` | `src/components/sections/HeroSection.tsx` | Updated earlier work |
| `M` | `src/components/services/useServicePage.ts` | Updated earlier work |
| `M` | `src/contexts/LanguageContext.tsx` | Updated earlier work |
| `M` | `src/hooks/useLocalizedNavigation.ts` | Preserved earlier work |
| `M` | `src/i18n/index.ts` | Preserved earlier work |
| `M` | `src/index.css` | Modified previously clean file |
| `M` | `src/lib/seo.ts` | Preserved earlier work |
| `M` | `src/lib/urls.ts` | Preserved earlier work |
| `M` | `src/pages/About.tsx` | Preserved earlier work |
| `M` | `src/pages/ContactResult.tsx` | Preserved earlier work |
| `M` | `src/pages/CourseDetail.tsx` | Preserved earlier work |
| `M` | `src/pages/NotFound.tsx` | Preserved earlier work |
| `M` | `src/pages/PrivacyPolicy.tsx` | Preserved earlier work |
| `M` | `src/pages/Terms.tsx` | Preserved earlier work |
| `M` | `tests/navigation-language.test.mjs` | Preserved earlier work |
| `??` | `docs/PHASE-5C2-F.md` | New file |
| `??` | `docs/PHASE-5C2-RENDERER-RESOLUTION.md` | Updated earlier work |
| `??` | `docs/PHASE-5C2.md` | Preserved earlier work |
| `??` | `public/font-licenses.txt` | New file |
| `??` | `scripts/build-ssg.mjs` | Updated earlier work |
| `??` | `scripts/compare-ssg-renderers.mjs` | Preserved earlier work |
| `??` | `scripts/inspect-ssg-paint.mjs` | New file |
| `??` | `scripts/ssg-browser-utils.mjs` | Updated earlier work |
| `??` | `scripts/ssg-html.mjs` | Updated earlier work |
| `??` | `scripts/ssg-integrity.mjs` | Preserved earlier work |
| `??` | `scripts/test-contact-retry.mjs` | New file |
| `??` | `scripts/test-ssg-browser.mjs` | Updated earlier work |
| `??` | `scripts/test-ssg-interactions.mjs` | Updated earlier work |
| `??` | `scripts/trace-ssg-layout.mjs` | New file |
| `??` | `scripts/vendor-site-fonts.mjs` | New file |
| `??` | `src/app/RouteContent.tsx` | Preserved earlier work |
| `??` | `src/assets/fonts/google-fonts-source.css` | New file |
| `??` | `src/assets/fonts/inter-OFL.txt` | New file |
| `??` | `src/assets/fonts/inter-cyrillic-71d5ee93cc1e.woff2` | New file |
| `??` | `src/assets/fonts/inter-cyrillic-ext-ca157063339a.woff2` | New file |
| `??` | `src/assets/fonts/inter-greek-1be3448e292f.woff2` | New file |
| `??` | `src/assets/fonts/inter-greek-ext-6e9e020a25f9.woff2` | New file |
| `??` | `src/assets/fonts/inter-latin-3100e775e861.woff2` | New file |
| `??` | `src/assets/fonts/inter-latin-ext-34b9c504cab7.woff2` | New file |
| `??` | `src/assets/fonts/inter-vietnamese-5c66f9e07e90.woff2` | New file |
| `??` | `src/assets/fonts/noto-sans-arabic-arabic-ce85091f0209.woff2` | New file |
| `??` | `src/assets/fonts/noto-sans-arabic-latin-ext-27fe6458d54b.woff2` | New file |
| `??` | `src/assets/fonts/noto-sans-arabic-latin-fed070abc960.woff2` | New file |
| `??` | `src/assets/fonts/noto-sans-arabic-math-2c7bffd56133.woff2` | New file |
| `??` | `src/assets/fonts/noto-sans-arabic-symbols-090786c8626f.woff2` | New file |
| `??` | `src/assets/fonts/notosansarabic-OFL.txt` | New file |
| `??` | `src/assets/fonts/sources.json` | New file |
| `??` | `src/contexts/RenderProvider.tsx` | Preserved earlier work |
| `??` | `src/contexts/RoutingContext.ts` | Preserved earlier work |
| `??` | `src/contexts/renderState.ts` | Preserved earlier work |
| `??` | `src/fonts.css` | New file |
| `??` | `src/i18n/createPageI18n.ts` | Preserved earlier work |
| `??` | `src/i18n/resources.ts` | Preserved earlier work |
| `??` | `src/lib/legacy.ts` | Preserved earlier work |
| `??` | `src/lib/routePaths.ts` | Preserved earlier work |
| `??` | `src/lib/routes.ts` | Preserved earlier work |
| `??` | `ssg/App.tsx` | Preserved earlier work |
| `??` | `ssg/compare-entry.tsx` | Preserved earlier work |
| `??` | `ssg/diagnostics/entry-pipeable.tsx` | Preserved earlier work |
| `??` | `ssg/diagnostics/probes.ts` | Preserved earlier work |
| `??` | `ssg/diagnostics/vite.contact.config.ts` | New file |
| `??` | `ssg/entry-client.tsx` | Preserved earlier work |
| `??` | `ssg/entry-server.tsx` | Preserved earlier work |
| `??` | `ssg/index.html` | Preserved earlier work |
| `??` | `ssg/render-readable.ts` | Preserved earlier work |
| `??` | `ssg/tsconfig.json` | Preserved earlier work |
| `??` | `ssg/types.ts` | Preserved earlier work |
| `??` | `ssg/vite.config.ts` | Preserved earlier work |
| `??` | `ssg/web-stream.d.ts` | Preserved earlier work |
| `??` | `tests/fixtures/emailjs-browser.mjs` | New file |
| `??` | `tests/fixtures/emailjs-config.mjs` | New file |
| `??` | `tests/ssg-contract.test.mjs` | Preserved earlier work |
| `??` | `tests/ssg-fonts.test.mjs` | New file |
| `??` | `tests/ssg-integrity.test.mjs` | Preserved earlier work |
| `??` | `tests/ssg-renderer.test.mjs` | Preserved earlier work |
