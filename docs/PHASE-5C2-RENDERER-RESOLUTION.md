# Phase 5C.2 — React 18 renderer resolution and validation

> Historical renderer checkpoint. The subsequent focused regression fixes and
> current local acceptance results are documented in [PHASE-5C2-F.md](PHASE-5C2-F.md).
> The failures recorded below are preserved as evidence of the earlier state.

Date: 24 November 2026, Asia/Riyadh.

**The NUL-byte blocker is resolved in the candidate. Full Phase 5C.2 acceptance
is incomplete: validation found a retry-draft refresh failure and two open
visual checks. Implementation stopped at the business-function checkpoint.**

No commit, push, merge, deployment, React upgrade, dependency change, React
internal patch, unofficial renderer, content edit, or production workflow change
was performed. Branch remains `fix/seo-language-consistency`; HEAD remains
`616197ee00442cf90a38436a52f6f994b9b84e0a`.

## Preservation and scope

All 44 existing modified/untracked source files were copied with SHA-256 hashes
before this investigation to:

`dist-ssr/renderer-resolution-baseline-1795503636469/`

That directory also retains the previous candidate output. The original Phase
5C.1 documentation and earlier generated evidence remain present. The old Node
renderer is retained only in `ssg/diagnostics/entry-pipeable.tsx` for reproducible
A/B testing. The candidate production entry imports only the Web Streams renderer.

The existing `build`, `build:dev`, `build:gh-pages`, `check`, and `test` commands
retain their definitions. `vite.config.ts`, `.github/workflows/deploy.yml`,
`package-lock.json`, business data, translations, service/course/project content,
navigation UI, animation source, and stylesheet source were not changed by this
resolution. The only shared runtime change is a candidate-only guard against
re-emitting an already-selected i18next language during hydration.

## Root cause and exact reproduction

Environment: Node 24.19.0, React/React DOM 18.3.1, Vite 7.3.2.

The Node pipeable renderer flushes an incompletely occupied byte buffer at some
multibyte boundaries. The local symptom matches
[React issue #31134](https://github.com/facebook/react/issues/31134). Its upstream
discussion identifies the chunk-boundary bug and a fix not backported to this
installed React version. No dependency or renderer internals were patched here.

The fixed Arabic-homepage fixture uses the same route, translations, build clock,
React identifier prefix, components, and initial state for both renderers.
Each renderer runs in a fresh production-mode Node process: interleaving two
different SSR implementations in one process caused shared React context state
to contaminate an initial diagnostic attempt. The successful comparison is isolated.

Zero-based offsets in the original pipeable output:

| Index | UTF-8 byte offset | UTF-16 string offset |
| --- | ---: | ---: |
| 1 | 16383 | 16004 |
| 2 | 26623 | 25965 |
| 3 | 28671 | 27730 |
| 4 | 36863 | 34754 |
| 5 | 53247 | 50253 |
| 6 | 75775 | 71710 |
| 7 | 114687 | 109991 |
| 8 | 118783 | 113845 |

Example affected text: `مشروع م\u0000نجز` instead of `مشروع منجز`.
Every difference between the main A/B HTML strings is an inserted NUL in A.
No string replacement cleans either renderer's published HTML.

A second paired fixture changes only the React identifier prefix length to 107
characters, moving a multibyte image filename onto a boundary. A inserts a NUL
at byte **40959** in `/ME-2026-Main/clients/04-مكتب-فارس-الهندسى.png`.
Parsing A produces `/ME-2026-Main/clients/04-مكتب-فارس-الهندس�ى.png`, which is
invalid. B has zero NUL bytes and all its image paths resolve. This demonstrates
why changing content/markup until the boundary moves cannot fix the renderer.
The initially reported client-01 URL corruption was also documented in the
historical checkpoint; the new fixed fixture hits text, and the alignment fixture
independently reproduces the image-path failure.

## A/B result

| Check | A: pipeable | B: readable |
| --- | --- | --- |
| Main fixture byte length | 127903 | 127895 |
| Main fixture NUL bytes | 8 | 0 |
| Malformed UTF-8 | No; inserted NULs are themselves legal UTF-8 | None |
| Replacement characters in B | — | 0 |
| Arabic text | Corrupted by inserted NULs | Preserved |
| HTML structure | Same apart from inserted bytes | Preserved |
| H1/main | Present, some body text corrupt | Complete |
| SEO head | Identical input metadata | Identical |
| Image alignment fixture | Broken filename | All valid |
| Main fixture image paths | 21 checked | 21 valid |
| Suspense completion | Awaited `onAllReady` | Awaited `allReady`; no loading shell |
| Isolated browser hydration | Corrupt output not accepted | Desktop/mobile Arabic Home passed |

The isolated B browser check preserved main/H1 nodes and IDs, captured no
recoverable hydration errors, and matched baseline geometry with zero difference.
Full results are in `dist-ssr/renderer-ab/comparison.json` and
`dist-ssr/renderer-ab/browser-report.json`.

## Candidate implementation

`ssg/render-readable.ts` imports the existing package's public
`react-dom/server.browser` entry and calls `renderToReadableStream`.
It awaits `stream.allReady`, reads byte chunks with a reader, and uses a fatal,
streaming UTF-8 decoder, including the final decoder flush. An AbortController
bounds completion. Renderer errors, unresolved content, malformed encoding, and
raw NUL bytes reject generation; partial or loading-only HTML is not published.
The installed React package explicitly exports this subpath. The declaration
file supplies its Web Stream type because the installed types package does not
declare that subpath. No polyfill or server runtime is shipped to Pages.

The [React Web Streams API](https://react.dev/reference/react-dom/server/renderToReadableStream)
documents `allReady` and hydration support. Its general guidance recommends the
Node pipeable API for Node servers; this candidate deliberately uses the public
Web Streams entry at build time, tested here on Node 24, to avoid the confirmed
React 18 Node-buffer defect. The existing CI Node 22 runtime has not been executed
in this environment and still needs CI verification.

The HTML writer uses replacement callbacks so replacement-string metacharacters
inside content cannot alter the generated document. Every written HTML file is
read back as bytes and permanently checked for NULs, malformed UTF-8, and U+FFFD.
Per-document integrity results are retained in each `ssr-report.json`.

### Hydration issue found and corrected

Initial B browser testing found React error #421 and a replaced Suspense tree.
The language provider unconditionally emitted `changeLanguage` even though the
candidate i18n instance had already been initialized in the correct language.
The candidate now avoids that redundant event; the legacy query-mode app retains
its existing behavior. The error is not suppressed. Subsequent normal Chrome
tests recorded zero recoverable errors and zero root/H1 replacements in all 104
desktop/mobile cases.

## Generation, UTF-8, metadata and sitemap results

| Configuration | Base | Canonical origin | Indexable | Auxiliary | NUL / invalid UTF-8 / U+FFFD |
| --- | --- | --- | ---: | ---: | --- |
| Repository | `/ME-2026-Main/` | `https://m-elmaghawry.github.io` | 52/52 | 4/4 | 0 / 0 / 0 |
| Root | `/` | `https://elmekawy-bim.com` | 52/52 | 4/4 | 0 / 0 / 0 |
| Nested custom-domain configuration | `/company/site/` | `https://custom.example` | 52/52 | 4/4 | 0 / 0 / 0 |

Total: **168 valid HTML documents**, including 156 indexable variants and 12
auxiliary documents across the three configurations. The origin/base values are
build configurations; nothing was uploaded to those hosts.

All configurations passed checks for complete main/H1 content, resolved Suspense,
lang/dir, a single metadata group, localized titles/descriptions, canonical and
reciprocal ar/en/x-default alternates, OG locale/URL, unchanged JSON-LD scope,
existing local image/asset paths, and initial page CSS. Each sitemap contains
exactly 52 distinct canonical URLs. Robots points to the matching sitemap;
thank-you and 404 documents remain excluded and noindex. The final per-route
table and file inventories are appended below.

## Checks actually performed

| Check | Result |
| --- | --- |
| Production TypeScript | Passed |
| Candidate TypeScript | Passed |
| Phase 5C.1 TypeScript | Passed |
| ESLint | Passed, zero errors and the original eight Fast Refresh warnings |
| Existing tests | 27/27 passed |
| New candidate/integrity/renderer tests | 11/11 passed |
| Existing production build | Passed |
| Candidate builds | All three configurations passed |
| Static metadata/sitemap/asset validation | All 168 documents passed |
| Isolated B Arabic Home browser comparison | 2/2 desktop/mobile cases passed |
| Chrome normal desktop/mobile matrix | 104/104 passed |
| Chrome representative tablet matrix | 12/12 passed |
| Chrome reduced-motion visual matrix | 12 passed, 1 failed; 11 remaining cases not completed |
| Edge representative visual matrix | 20 passed, 1 failed; 3 remaining cases not completed |
| Navigation/interaction suite | 33 passed, 1 failed; stopped at retry-draft refresh |

The new tests reject deliberately malformed/truncated UTF-8, inserted NULs,
replacement characters, recoverable server errors inside Suspense, and unresolved
render timeouts. They also verify chunked Arabic/emoji preservation, legacy URL
value/hash retention and safety, and the complete generated contract under all
three bases. No renderer error is converted into a successful result.

Chrome: **158.0.8127.88**. Edge: **158.0.4370.33**. These are both Chromium-based;
Firefox, Safari/WebKit, and physical devices were not tested. No browser or
dependency was downloaded. Final recorded runs have zero font-fetch failures;
an earlier transient font timeout was preserved separately and was not accepted
as visual evidence.

### Browser coverage and visual findings

Normal desktop/mobile cases check hydration errors, main/H1 identity, IDs,
metadata counts, direction/language, missing local assets, horizontal overflow,
initial versus hydrated content, no-JavaScript content, and baseline geometry.
Every Chrome normal case had zero measured geometry difference. Maximum changed
pixel ratios among accepted cases were approximately 1.2441% desktop/mobile and
1.9433% tablet, below the test's 2.5% capture threshold. These are viewport checks,
not a full-page or every-animation-frame visual audit.

Screenshot test issues found and recorded: the archived legal-page baseline lacks
a main landmark; early checks needed to locate its H1 directly. Independent browser
runs initially shared screenshot filenames; output is now isolated by mode/browser.
Finite entrance animations must settle before overflow measurement. Decorative
animation clocks are normalized for capture, and the automatic profession title
is masked in some Home pixel comparisons and tested separately as an interaction.
Unmasked Home captures are retained. Some continued Edge cases use a controlled
JavaScript clock plus real-time settling for native animations. Reports record
those conditions and previous failed attempts; no application animation or UI
control was added, removed, paused, or restyled.

Open pixel checks are **not marked passed**:

- Reduced-motion Arabic mobile Home: **3.0666%** changed pixels.
- Edge English mobile BIM Training: **4.2083%** changed pixels.

Both have matching measured geometry and zero captured hydration errors. A
background/animation timing explanation was investigated but has not been proven
for the remaining failures. Computed Home decoration styles match in the captured
diagnostic, so the difference cannot be closed merely by asserting a CSS opacity
cause. A provisional selector change was reverted; `ssg/index.html` is byte-identical
to the preserved start-of-investigation file. Exact pixel parity and full reduced-
motion/Edge acceptance are not claimed.

### Font loading and CLS

No font, typography, or font-delivery changes were made. This larger local suite
recorded normal-run CLS as high as **0.21703** and tablet CLS as high as **0.03010**.
Those values exceed the earlier five-route experiment's maximum and remain an
open performance investigation. Server main/H1 nodes were preserved; these data
do not prove the shift's cause. Font timing, route-specific content, and concurrent
lab execution require isolation before release. Clock-controlled captures are
not used as field performance evidence. No Lighthouse or field Core Web Vitals
pass is claimed.

## Navigation, auxiliary routes and business-function stop

The 33 passed interaction checks cover:

- Arabic/English direct visits and refreshes under repository, root, and nested bases.
- Legacy language queries, unrelated encoded query values and fragments, old
  `__spa` links, and directory slash normalization.
- Local custom-404 status/content under all three bases, without a global success fallback.
- Direct thank-you visits safely returning to Contact without manufacturing success.
- Desktop language switching, same-language SPA navigation and history.
- Mobile Radix menu navigation and English-to-Arabic switching.
- Automatic Home title transitions and About slideshows, plus reduced-motion
  suppression of the About slideshow.
- A real course accordion expansion and reachable footer.
- Client-side contact success state and its refresh behavior, without submitting email.

**The failed check is retry-draft preservation on refresh.** A simulated local
error result passes a draft to Contact when “Try again” is clicked. The form then
contains `Local SSR test` as expected. After a real refresh, the name is empty.
The saved report contains the assertion and exact reproduction step; only dummy
local test data was used and no external submission occurred.

The code-based diagnosis is that browser history state is deliberately withheld
for the matching first SSR/client render, while react-hook-form consumes its
default values only when mounted. Adopting history state later does not by itself
restore those defaults. This is a candidate state-adoption issue; no evidence
ties it to byte corruption or to a changed business-data file. It remains unfixed.

The approved Phase 5C.2 checkpoint requires stopping and reporting an unexpected
business-function change. Implementation stopped here rather than changing the
contact workflow under the renderer-only scope. No further product fixes were made.

Real GitHub Pages status/normalization behavior is not verified by the local server
emulation. Pages serves its root 404 for unknown English paths too; the generated
root fallback contains an alternate-language message/link. No query-aware HTTP
301/308 support is claimed. EmailJS delivery, CAPTCHA and Maps remain unverified.
Contact-result state across a full document language switch was not validated.

## Recommendation, CI and rollback

Retain the Web Streams replacement in the candidate: raw encoding, all-page
generation and normal hydration validation support it. Do not switch production
builds or deploy yet. Resume Phase 5C.2 with a reviewed, narrowly scoped history-
draft hydration fix, then rerun that regression. Separately close the two visual
flags and investigate the larger-suite CLS before full release acceptance.

No CI/deployment adjustments were applied. Proposed next CI work remains a separate
candidate job using locked dependencies, existing checks, candidate typechecking,
all three build configurations, byte/HTML/sitemap tests and installed-browser
coverage. Supply a known-good baseline artifact for screenshot comparison; the
local harness currently references the preserved local baseline. Verify Node 22
and other browser engines. Change the active build/upload selection only after
separate release approval and complete acceptance.

There is no deployed change to roll back. Keep the current workflow and Pages
deployment. All local changes and start-state snapshots are preserved; selectively
reverting this investigation would require explicit direction and review, without
resetting or discarding the earlier 44 files. A future approved release should
retain its predecessor artifact and revert the build/upload selection through an
approved change if needed.

## Evidence and reproduction commands

Evidence roots:

- `dist-ssr/renderer-ab/`: fixed input, exact A/B HTML, offsets, image-boundary
  fixture and isolated browser report.
- `dist-ssr/candidate/{repo,root,custom}/ssr-report.json`: all documents and byte checks.
- `dist-ssr/candidate/repo/{browser,tablet,reduced,edge-smoke}-report.json`.
- `dist-ssr/candidate/interaction-report.json`: 33 successes and the draft-refresh failure.
- `dist-ssr/candidate/validation-summary.json`: aggregated results and remaining failures.

Build all configurations before running the candidate contract tests:

```powershell
npm.cmd run compare:ssg-renderers
npm.cmd run build:ssg-candidate
npm.cmd run build:ssg-candidate -- --base / --site-url https://elmekawy-bim.com/ --variant root
npm.cmd run build:ssg-candidate -- --base /company/site/ --site-url https://custom.example/company/site/ --variant custom
npm.cmd run check
npm.cmd run typecheck:ssg
npm.cmd run typecheck:poc
npm.cmd run test:ssg
npm.cmd run test:ssg-browser
npm.cmd run test:ssg-browser -- --tablet
npm.cmd run test:ssg-browser -- --reduced
npm.cmd run test:ssg-browser -- --smoke --edge
npm.cmd run test:ssg-browser -- --extra
```

Browser commands need installed Chrome/Edge, local-port/browser-launch permissions,
and Google Fonts access. The reduced/Edge/extra commands currently contain the
reported acceptance failures. `--resume` preserves prior successful cases and
records earlier failures; `--clocked` enables controlled JS capture timing. Those
diagnostic options do not turn failed assertions into successes.

## Per-route integrity and source inventory

The following appendix is generated from the final reports and preserved Git state.

### NUL-byte result for every logical route

Each row has both language documents. The same zero-NUL and fatal UTF-8 checks
passed in all three base configurations. Physical file paths are in each JSON report.

| Logical route | Arabic NUL bytes | English NUL bytes | Valid UTF-8, all bases |
| --- | ---: | ---: | --- |
| `/` | 0 | 0 | Yes |
| `/about/` | 0 | 0 | Yes |
| `/services/` | 0 | 0 | Yes |
| `/services/bim-training/` | 0 | 0 | Yes |
| `/services/bim-coordination/` | 0 | 0 | Yes |
| `/services/autoCAD-to-revit/` | 0 | 0 | Yes |
| `/services/infrastructure-bim/` | 0 | 0 | Yes |
| `/services/structural-shop-drawings/` | 0 | 0 | Yes |
| `/services/structural-quantity-takeoffs/` | 0 | 0 | Yes |
| `/courses/` | 0 | 0 | Yes |
| `/courses/bim-fundamentals/` | 0 | 0 | Yes |
| `/courses/revit-structure-professional-training/` | 0 | 0 | Yes |
| `/courses/revit-structure-workshop-01/` | 0 | 0 | Yes |
| `/courses/revit-structure-workshop-02/` | 0 | 0 | Yes |
| `/courses/revit-structure-workshop-03/` | 0 | 0 | Yes |
| `/portfolio/` | 0 | 0 | Yes |
| `/portfolio/1/` | 0 | 0 | Yes |
| `/portfolio/2/` | 0 | 0 | Yes |
| `/portfolio/3/` | 0 | 0 | Yes |
| `/portfolio/4/` | 0 | 0 | Yes |
| `/portfolio/5/` | 0 | 0 | Yes |
| `/portfolio/6/` | 0 | 0 | Yes |
| `/portfolio/7/` | 0 | 0 | Yes |
| `/contact/` | 0 | 0 | Yes |
| `/privacy-policy/` | 0 | 0 | Yes |
| `/terms/` | 0 | 0 | Yes |
| `/thank-you/` (auxiliary) | 0 | 0 | Yes |
| `/404/` (auxiliary) | 0 | 0 | Yes |

### Exact files changed in this renderer-resolution turn

Modified from the preserved starting state:

```text
docs/PHASE-5C2.md
package.json
scripts/build-ssg.mjs
src/contexts/LanguageContext.tsx
ssg/entry-server.tsx
ssg/tsconfig.json
```

Created:

```text
docs/PHASE-5C2-RENDERER-RESOLUTION.md
scripts/compare-ssg-renderers.mjs
scripts/ssg-browser-utils.mjs
scripts/ssg-integrity.mjs
scripts/test-ssg-browser.mjs
scripts/test-ssg-interactions.mjs
ssg/compare-entry.tsx
ssg/diagnostics/entry-pipeable.tsx
ssg/diagnostics/probes.ts
ssg/render-readable.ts
ssg/web-stream.d.ts
tests/ssg-contract.test.mjs
tests/ssg-integrity.test.mjs
tests/ssg-renderer.test.mjs
```

Deleted: none. 38 of the original 44 changed/untracked files remain byte-identical to the start-of-investigation snapshot. All original snapshot copies match their recorded hashes.

### Cumulative Phase 5C.2 working-tree inventory

This also includes the earlier approved implementation changes, retained without resetting them:

```text
docs/PHASE-5C2-RENDERER-RESOLUTION.md
docs/PHASE-5C2.md
experiments/bilingual-ssr/App.tsx
experiments/bilingual-ssr/README.md
experiments/bilingual-ssr/VALIDATION.md
experiments/bilingual-ssr/i18n.ts
experiments/bilingual-ssr/index.html
experiments/bilingual-ssr/vite.config.ts
package.json
scripts/build-ssg.mjs
scripts/compare-ssg-renderers.mjs
scripts/ssg-browser-utils.mjs
scripts/ssg-html.mjs
scripts/ssg-integrity.mjs
scripts/test-ssg-browser.mjs
scripts/test-ssg-interactions.mjs
src/App.tsx
src/app/RouteContent.tsx
src/components/ContactForm.tsx
src/components/PageSeo.tsx
src/components/layout/Footer.tsx
src/components/sections/HeroSection.tsx
src/components/services/useServicePage.ts
src/contexts/LanguageContext.tsx
src/contexts/RenderProvider.tsx
src/contexts/RoutingContext.ts
src/contexts/renderState.ts
src/hooks/useLocalizedNavigation.ts
src/i18n/createPageI18n.ts
src/i18n/index.ts
src/i18n/resources.ts
src/lib/legacy.ts
src/lib/routePaths.ts
src/lib/routes.ts
src/lib/seo.ts
src/lib/urls.ts
src/pages/About.tsx
src/pages/ContactResult.tsx
src/pages/CourseDetail.tsx
src/pages/NotFound.tsx
src/pages/PrivacyPolicy.tsx
src/pages/Terms.tsx
ssg/App.tsx
ssg/compare-entry.tsx
ssg/diagnostics/entry-pipeable.tsx
ssg/diagnostics/probes.ts
ssg/entry-client.tsx
ssg/entry-server.tsx
ssg/index.html
ssg/render-readable.ts
ssg/tsconfig.json
ssg/types.ts
ssg/vite.config.ts
ssg/web-stream.d.ts
tests/navigation-language.test.mjs
tests/ssg-contract.test.mjs
tests/ssg-integrity.test.mjs
tests/ssg-renderer.test.mjs
```
