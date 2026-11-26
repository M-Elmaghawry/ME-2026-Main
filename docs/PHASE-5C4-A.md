# Phase 5C.4-A — Static route alias and hydration compatibility

26 November 2026, Asia/Riyadh. **Production release remains BLOCKED.**

## Repository boundary and environment

- Git root: `D:\zz-CODING\ME-2026-Main` (the current computer's transferred checkout).
- Branch: `fix/seo-language-consistency`.
- Starting HEAD: `fd068038648373ac720883ab7084f90b09f9b8af`, exactly the requested checkpoint.
- The working tree was clean before creating the diagnostic harness or editing source.
- Read `DEVELOPMENT-HANDOVER.md`, its portable alias reproduction, routing/bootstrap
  source, static-host helper and existing browser/history suites before implementation.
- Node **22.23.5**, npm **10.9.9**, Windows. The portable runtime already preserved
  under ignored `dist-ssr/phase5c3-e-1795608028380/tools/` was used. The machine's
  default Node 24 was not used for the accepted build/test results.
- Existing `node_modules` was stale (Router DOM 6.30.3). Ran `npm ci --engine-strict`
  to install the approved lockfile, without modifying the manifest or lockfile.
  The restricted attempt failed on registry EACCES; the permitted retry passed.
- `main` remains `77ba313d8617a082d349f383e876ac34013eb551`. Initial implementation
  and validation preceded any commit/push. The user's later instruction explicitly
  authorized uploading all updates to GitHub on the development branch. This
  supersedes the original no-commit/no-push restriction only; no merge, deployment,
  workflow edit or write to a separate outer repository is authorized or performed.

## Confirmed root cause and before behavior

Rebuilt the unmodified checkpoint with the locked dependencies before changing
application source. The static helper served **the same generated HTML bytes**
for a directory URL and its literal file alias. Recorded the requested URL,
generated file, SHA-256 of the HTTP response body, final browser pathname,
basename-relative Router location, SSR/browser route matches, console errors,
recoverable hydration errors, canonical and all three hreflang links.

`ssg/entry-server.tsx` creates a `StaticRouter` location using `boot.route`, e.g.
`/about/`. `BrowserRouter` instead reads the actual browser pathname. It strips
the locale/deployment basename but does **not** strip `index.html`. The shared
route registry has `/about`, not `/about/index.html`; therefore the browser
selects `NotFound` while SSR emitted `About`. React reports **#418 and #422** and
replaces the server DOM. The same mismatch affects home, service/course details,
Contact and both languages. There were no missing assets in these reproductions.

The negative-control suite completed **72 checks**: 28 canonical openings,
28 corresponding aliases and 16 invalid-path checks. All 28 valid aliases
reproduced the mismatch; their canonical counterparts preserved the SSR DOM with
zero recoverable errors. Expected alias failures are evidence, not test failures.

| Requested URL (repository base) | Served document | Before browser match | After behavior |
| --- | --- | --- | --- |
| `/ME-2026-Main/` | `index.html` | Index | Unchanged |
| `/ME-2026-Main/index.html` | `index.html` | NotFound; #418/#422 | `/ME-2026-Main/`; Index; preserved DOM |
| `/ME-2026-Main/about/index.html` | `about/index.html` | NotFound; #418/#422 | `/ME-2026-Main/about/`; About; preserved DOM |
| `/ME-2026-Main/en/about/index.html` | `en/about/index.html` | NotFound; #418/#422 | `/ME-2026-Main/en/about/`; About; preserved DOM |
| Valid service/course/Contact file aliases | Their generated language document | NotFound; #418/#422 | Existing canonical route; preserved DOM |
| Unknown directory route | Shared `404.html`, HTTP 404 | NotFound | Remains HTTP 404/NotFound |
| Missing literal file alias | Host's empty HTTP 404 | No application document | Remains HTTP 404 |

## Alias policy and smallest correction

The candidate is a static-file artifact. GitHub Pages publishes static files and
does not run application server code; see the official
[Pages creation and static-generator documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
This repository cannot configure a per-path HTTP redirect through a generated
HTML file. A real permanent redirect would need a hosting/edge feature outside
this scoped source fix. No such feature was configured or verified live.

Implemented **client-side `history.replaceState` normalization**, not an HTTP
301/308 redirect. The local alias response is still HTTP **200**, containing the
complete canonical SSR document. With JavaScript disabled it stays at the alias
and displays that SSR document with canonical/hreflang metadata. JavaScript
normalizes the URL before the Router reads location or hydration begins.

One new SSG-only module derives its allowlist from the existing generated page
inventory and the nonindexable directory route in the registry. It only removes
an exact terminal `/index.html` for a known directory document inside the base.
It does not invent missing service/course IDs, fold pathname case, decode arbitrary
paths, redirect unknown paths, or treat `404.html` as a directory alias.

Initialization precedes the existing locale-history listener. Capture-phase
`popstate`/`pageshow` listeners normalize a traversed alias before BrowserRouter
or locale reconciliation consumes it. Replacement preserves the entire
`history.state` (including `usr`, `idx`, `key` and arbitrary extra properties),
history length, the raw search string and fragment. It makes no extra history
entry, reload or network request. Already canonical paths are a no-op, so there
is no normalization loop. Existing legacy-language redirects retain their policy.

No SSR renderer, route definition, navigation component, SEO generator, sitemap,
fallback boundary, CSS, font or integration behavior was rewritten. No hydration
warnings were suppressed. CSR and the earlier POC do not install this helper.

## Exact source and test changes

1. `ssg/route-alias.ts` — centralized allowlist, normalization and traversal listeners.
2. `ssg/entry-client.tsx` — install normalization after legacy migration and before locale reconciliation/hydration.
3. `tests/ssg-route-aliases.test.mjs` — six parameterized unit/history tests over all three bases and both languages; invalid route, repeated slash, case, encoded-name and state checks.
4. `scripts/test-static-route-aliases.mjs` — portable negative control and desktop/mobile alias/refresh/history/404/reduced-motion matrix; HTTP body identity and metadata assertions.
5. `scripts/test-static-route-alias-visuals.mjs` — paired checkpoint-canonical/fixed-alias screenshots, font/style and geometry assertions.
6. `scripts/test-contact-history.mjs` — optional `--alias`/`--base` test modes; direct Contact/result aliases and alias refreshes with real synthetic retry/result history. Default canonical/CSR behavior remains available.
7. `docs/PHASE-5C4-A.md` — this report.
8. `docs/DEVELOPMENT-HANDOVER.md` — current alias status, commands, evidence and remaining release gates.

`package.json`, `package-lock.json`, dependency overrides, production workflow,
the shared route registry, metadata and visual-design source are unchanged.

## Local technical and browser validation

All required application/build/test checks pass. The scoped alias correction is
recommended for local functional acceptance and development review; production
and dependency-residual approval remain blocked.

| Browser suite | Passing checks | Coverage |
| --- | ---: | --- |
| New alias matrix | **1,080** | All 52 indexable documents in both forms on desktop/mobile, three bases; representative refreshes; query/hash/state, language/Back/Forward, invalid routes and reduced motion |
| Checkpoint canonical vs fixed alias visuals | **32 pairs** | Four pages, both languages/viewports, normal/reduced motion |
| Existing wider interactions | **38** | Three bases, language/navigation/history, 404, auxiliary routes, animation, menu, accordion, Contact |
| Canonical SSG Contact history, Chrome | **40** | Desktop/mobile, both languages, retry/success/history/storage denial |
| Alias SSG Contact history, Chrome, repo/root/custom | **120** | 40 per base; direct Contact/result aliases and alias refresh with drafts/result state |
| Alias SSG Contact history, Edge, repo | **40** | Same history/state regressions in Edge |
| CSR Contact control | **40** | Existing production architecture with mocked integrations |
| Course layout/font handoff | **20** | 320–1440px, badge rows, typography and curriculum interaction |
| Browser locale/count formatting | **12** | en-US/ar-SA/fr-FR, both languages, course/service pages |

Chrome reports **158.0.8127.88**; Edge reports its installed version in the Contact
report. The six Contact runs total **240** cases, with **760** SSG
hydration/metadata checks (five SSG runs × 152). No real email requests occur.
The alias matrix and all accepted SSG suites report zero recoverable hydration
errors, no bootstrap/page errors on valid documents, and no broken local assets.
Initial main/H1 nodes and generated IDs are retained. The 404 page's existing
intentional `console.error` is expected only for invalid-route cases; hydration
errors are never suppressed or accepted. Missing literal files retain host 404s.

Visual comparisons have **zero geometry differences** and identical sampled
font/direction/header/footer styles. **29/32 pairs have zero changed pixels**.
The other three have 0.456313%, 0.232106% and 0.083750% pixel differences, within
the existing 0.5% gate. Inspected their diff and before/after images: differences
are confined to the existing rotating home profession text and native Contact
select text paint (same values and control geometry). No design discrepancy was
found. Screenshots use identical viewport/clock settings, local fonts, normalized
decorative animation phases and no hidden/masked regions.

Two harness/setup issues were corrected without changing application behavior:
the new negative control initially treated a native empty-404 navigation failure
and the existing intentional 404 console message as test failures; the final
72-check negative control and 1,080-check regression pass. The historical count
formatting harness required a missing `formatting-before.json` after device
transfer. A fresh **current-version control** generated its four en-US captures,
then all 12 locale assertions passed. Those four captures are not presented as
pre-alias-fix or pre-G1.1 evidence. The separate POC browser comparison was not
repeated; its build and TypeScript check passed, but see its integrity finding below.

The required three TypeScript checks pass. Lint passes with **zero errors and
eight existing warnings**. `npm test` passes **27 tests** and `npm run test:ssg`
passes **32 tests**, including six new alias tests: **59 total Node tests**.
CSR `npm run build`, repo/root/custom candidate builds, mocked Contact builds at
repo/root/custom bases, and the 10-document POC build commands all exit 0. The
Contact fixture was restored to repository base after those suites.

Each normal base produces **52 indexable + four auxiliary documents**, with
**52 sitemap URLs**. Three normal bases total 168 HTML files; with the mocked
Contact fixture the candidate total is **224**. All 224 have **zero NUL bytes,
invalid UTF-8 or replacement characters**; all 27 CSR HTML files also pass.
Strict UTF-8/NUL validation and
static contract checks pass. Every generated asset referenced by the static
contract exists. Repo metadata in all **56** documents and `sitemap.xml` are
identical to the pre-fix checkpoint. Canonicals exclude `index.html`, query and
fragment; Arabic paths, `/en/` alternates and x-default remain unchanged.

CSS and all **Noto Sans Arabic/Inter** font files are byte-identical. The client
entry changes because the allowlist uses the existing collection inventory:
its uncompressed entry grows from 232,463 to 296,384 bytes as existing collection
code is hoisted into the entry. This is module relocation, not a dependency
upgrade. Total emitted JS changes from **802,423 bytes/35 files** to
**801,600 bytes/31 files**. Do not describe all JS assets as byte-identical or
infer an LCP pass from these byte counts.

## Reproduction and evidence

Use Node 22.23.5/npm 10.9.9, installed locked dependencies and an installed
Chrome/Edge. `CHROME_PATH` can select another Chromium executable. All test
forms are mocked and external requests are blocked by the new alias suites.

Before applying the source fix, build the repo candidate and run:

```text
node scripts/test-static-route-aliases.mjs --before
```

Preserve that fresh build under ignored `dist-ssr/phase5c4-a/baseline/` before
rebuilding. The visual harness expects its `site` directory. On the fixed tree:

```text
npm run typecheck
npm run typecheck:ssg
npm run typecheck:poc
npm run lint
npm test
npm run build
npm run build:ssg-candidate -- --variant repo --base /ME-2026-Main/ --site-url https://m-elmaghawry.github.io/ME-2026-Main/
npm run build:ssg-candidate -- --variant root --base / --site-url https://example.com/
npm run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/
npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
npm run build:ssr-poc
npm run test:ssg
node scripts/test-static-route-aliases.mjs
node scripts/test-static-route-alias-visuals.mjs
node scripts/test-ssg-interactions.mjs
node scripts/test-contact-history.mjs
node scripts/test-contact-history.mjs --alias
node scripts/test-contact-history.mjs --alias --edge
node scripts/test-contact-history.mjs --csr
node scripts/test-course-layout.mjs --output dist-ssr/phase5c4-a/course-layout
node scripts/test-locale-formatting-browser.mjs --before
node scripts/test-locale-formatting-browser.mjs
```

For Contact at root/custom bases, rebuild **only the mocked fixture** with the
corresponding `--base`/`--site-url`, then pass `--alias --base /` or
`--alias --base /company/site/` to the history suite. Restore the repo-base
fixture afterward. These diagnostic builds must never be published.

Raw local evidence lives under ignored `dist-ssr/phase5c4-a/`: `before.json`,
`after.json`, `static-summary.json`, browser-command logs and `visuals/report.json`
with paired PNGs. Existing suites write their usual ignored report directories;
the task's command logs record those paths. These are current-machine artifacts,
not files recoverable from Git after transfer. The before run must use the
checkpoint source; running `--before` on the fixed source deliberately fails its
negative-control assertion.

The last two commands generate a same-version formatting control for that older
harness, then check all three browser locales. They are additional controls;
the alias visual comparison uses the actual preserved pre-fix build.

## Remaining blockers and acceptance

Production remains **BLOCKED**. This phase does not verify Linux/Node 22,
optional-native/libc selection, live GitHub Pages behavior or SSG cutover,
provider authorization, target-environment performance, or production readiness.
The G1–G4.1 dependency versions/overrides are preserved. The historical residual
security position remains **20 advisory IDs across ten affected package names**
(four high/six moderate package totals); no new security audit/remediation or
residual-risk approval is claimed. The previous machine's LCP pass is not a
certification for this machine. Existing production workflow still builds CSR.

An additional **`npm ls --all --json` exits 1** on this computer despite the
successful locked install: it marks optional `@emnapi/runtime@1.11.3` and
`@img/sharp-wasm32@0.35.5` as extraneous and Tailwind's parser **6.1.2** as invalid
against a displayed **6.1.5** override requirement. The installed Typography
parser is 6.1.5; Tailwind/postcss-nested copies remain at the approved 6.1.2.
These are the requested preserved versions. This graph diagnostic was not
resolved by altering dependencies/overrides/lockfile or deleting package copies;
it needs separate dependency/installer investigation. Do not carry forward G4.1's
historical successful tree-check statement as a fresh tree-check pass here.
Full machine output is in ignored `dist-ssr/phase5c4-a/dependency-tree.json`.

The extra integrity scan of the **unchanged, separate Phase 5C.1 POC** finds
**ten NUL bytes in two of its ten HTML files** (nine in Arabic home, one in
Arabic portfolio/1). That older experiment does not use the corrected candidate
renderer. Its successful build command is not an integrity acceptance. Its
browser comparison was not continued, and it must never be published. The
actual bilingual SSG candidate and its mocked fixture remain clean (224/224).
Correcting the historical POC renderer is outside this alias-only scope.

**Recommendation:** accept the literal-alias correction for local development
review. The routing/hydration blocker is cleared in the tested static-host
emulation. Preserve all other blockers, including the fresh dependency-tree
diagnostic, isolated POC integrity finding and live-host/HTTP-policy verification.
A development-branch upload under the user's subsequent instruction is a
backup/review checkpoint, not an SSG cutover or production release approval.
