# Phase 5C.3-G3 — TypeScript ESLint security remediation

25 November 2026, Asia/Riyadh. **Production release remains BLOCKED.**
**Scoped local G3 validation passes; recommended for review.**

## Repository and baseline safety

Authorized Git root: `G:\ME-Website\ME-2026-Main\ME-2026-Main`.
Branch: `fix/seo-language-consistency`. HEAD remains
`eafb491eb754dee9ba5bb4ea0d42a0e174248455`; changes are uncommitted.
Existing G1/G1.1/G2 source, manifests, tests and documentation were inspected and
preserved. The outer independent clone remains on main at
`77ba313d8617a082d349f383e876ac34013eb551` with its existing untracked artifacts.

All commands used **Node 22.23.5 / npm 10.9.9**, with the temporary Node 22 runtime
prepended to PATH. Ignored `dist-ssr/phase5c3-g3/baseline/` preserves manifests,
ESLint config, G2 runtime outputs and **462 project-file SHA-256 hashes**. Fresh
pre-update lint text/JSON, audit and full dependency tree were captured. Existing
successful G2 TypeScript/test/build logs were copied before changes as baseline
evidence; they were not represented as newly executed pre-update checks. All
required post-update commands were freshly run.

## Actual toolchain and target compatibility

The flat config imports the **typescript-eslint umbrella package**, whose
`config`/recommended setup supplies its parser and plugin. No direct duplicate
parser/plugin declaration is needed. Existing root ESLint **9.39.4**, TypeScript
**5.9.3**, react-hooks **5.2.0** and react-refresh **0.4.26** remain unchanged.

Before installation, npm registry metadata verified the exact **8.73.0** target,
parser/plugin/estree family and intended glob patch floors. The family accepts
ESLint `^8.57.0 || ^9.0.0 || ^10.0.0` and TypeScript `>=4.8.4 <6.1.0`.
Family engines accept Node `^18.18.0 || ^20.9.0 || >=21.1.0`; selected minimatch/
brace leaves require `20 || >=22`, satisfied by the required Node 22.23.5.
This does not certify all older Node versions or Linux. The new estree
`@typescript/native` peer is **optional**; no native TypeScript/TS7 package was
installed. The project continues using TypeScript 5.9.3.

## Exact dependency changes

All eleven family packages align **8.57.2 -> 8.73.0**:

| Package | Purpose |
| --- | --- |
| typescript-eslint | Existing root devDependency, config entry |
| @typescript-eslint/eslint-plugin | Rules |
| @typescript-eslint/parser | Parser |
| @typescript-eslint/project-service | TypeScript project service |
| @typescript-eslint/scope-manager | Scope analysis |
| @typescript-eslint/tsconfig-utils | TS configuration helpers |
| @typescript-eslint/type-utils | Type-aware rule helpers |
| @typescript-eslint/types | AST types |
| @typescript-eslint/typescript-estree | TypeScript AST conversion |
| @typescript-eslint/utils | Rule/tooling utilities |
| @typescript-eslint/visitor-keys | AST traversal keys |

The root requirement changes from **`^8.38.0` to exact `8.73.0`**, retaining its
devDependencies placement. Required family-path changes:

| Path/package | Before | After |
| --- | --- | --- |
| estree -> minimatch | 10.2.4 | **11.0.9** |
| estree -> minimatch -> brace-expansion | 5.0.5 | **5.1.0** |
| minimatch -> @isaacs/nonrecursive-glob-match | Absent | **1.1.0** |

These are npm-selected compatible resolutions, explicitly reviewed against
registry metadata: new estree declares `minimatch ^11.0.1`; selected minimatch
declares `brace-expansion ^5.0.12` and helper `^1.1.0`. The selected versions are
above the earlier proposed patch floors, not an unsupported global major
override. Published engine/dependency/lifecycle metadata and fresh audits were
reviewed. Registry tarball integrity and normal npm installation are retained.
The existing `balanced-match` dependency already satisfies the new brace range.

Standard commands:

```text
npm install --save-dev --save-exact typescript-eslint@8.73.0 --engine-strict --registry=https://registry.npmjs.org
npm ci --engine-strict
```

npm opportunistically refreshed the plugin's nested `ignore` from 7.0.5 to 7.0.17,
although its declared `^7.0.5` range is unchanged. That unnecessary refresh was
removed from the candidate lock, keeping **7.0.5**. Sixteen unrelated optional
sharp `libc` metadata fields stripped by npm were restored exactly. A strict
clean install of this narrowed lock succeeds: **398 packages added, 399 audited**.

The final lock has **15 changed/new records**: root requirement, eleven family
packages, two glob leaves and one new helper. **468 existing records are deeply
unchanged**, with one net package addition. No unrelated graph cleanup or broad
dedupe/update was performed. In particular:

- Shared ESLint minimatch **3.1.5** and brace-expansion **1.1.13** remain unchanged.
- ESLint, TypeScript, G1/G2 dependencies, humanfs, YAML, Browserslist/target data,
  Typography and selector-parser versions remain unchanged.
- No G4 override, direct duplicate parser/plugin, new compiler or framework
  migration was introduced. No lint rule/configuration or application file changed.

## ESLint and diagnostics comparison

Before and after, the actual CLI command `npm run lint` exits **0**, with
**zero errors and eight warnings**. Independent JSON captures compare the full
file list and diagnostics: **201 files before and after, byte-equivalent
normalized messages, positions, severities and rule IDs**. There are no omitted
files, newly introduced warnings or newly exposed source errors in this run.

All eight existing warnings are `react-refresh/only-export-components`, one each
in `badge.tsx`, `button.tsx`, `form.tsx`, `navigation-menu.tsx`, `sidebar.tsx`,
`sonner.tsx`, `toggle.tsx` and `contexts/LanguageContext.tsx`. These remain
documented warnings, not silently reclassified as new G3 issues. The existing
`@typescript-eslint/no-unused-vars: off` and other rule choices were not changed by G3. No broad
suppression, source reformatting or unrelated issue correction was performed.

## Security reassessment

The full audit and tree were freshly captured before and after. The omit=dev
audit was freshly run after G3. Commands:

```text
npm audit --json --package-lock-only --registry=https://registry.npmjs.org
npm audit --json --package-lock-only --omit=dev --registry=https://registry.npmjs.org
npm ls --all --json
```

The before full audit has the **same exact 22 advisory IDs as G2**. After:

| Measure | Before G3 | After G3 |
| --- | --- | --- |
| Unique advisory IDs | 22 | **20** |
| Affected package names | 18 | **11** |
| Maximum package-severity totals | 4 high, 14 moderate | **4 high, 7 moderate** |
| Introduced IDs | — | **0** |
| Post-update omit=dev | Not freshly repeated before G3 | **5 names: 1 high, 4 moderate** |

Resolved globally:

- **GHSA-g3hv-75wg-m249** — minimatch affected `>=7 <11.0.1`; estree's supported
  minimatch **11.0.9** is outside the affected range.
- **GHSA-jxxr-4gwj-5jf2** — brace-expansion affected `>=5.0.0 <5.0.6`; the nested
  **5.1.0** copy is outside the affected range.

Removing seven affected-package rows is **not** seven unique advisory fixes:
several TypeScript ESLint wrappers inherited these same leaf findings. All
previous G1/G2 resolved IDs remain absent. Audit exits **1** for the findings;
the full installed dependency tree exits **0**, without invalid peers/duplicates
requiring correction. No `npm audit fix` or other automated repair was used.

Remaining **20 advisory IDs**:

```text
GHSA-2883-xcg3-v3hh  GHSA-337j-9hxr-rhxg  GHSA-3jxr-9vmj-r5cp
GHSA-52cp-r559-cp3m  GHSA-5p4m-2wfm-xmqj  GHSA-6j4f-fj2g-mc7p
GHSA-6jcc-5g8w-32mx  GHSA-73wf-gq98-2v4g  GHSA-c83g-rgw3-j3cx
GHSA-h67p-54hq-rp68  GHSA-mh99-v99m-4gvg  GHSA-mrhx-c7xc-m3w5
GHSA-p498-v437-472g  GHSA-q2hr-2g5m-vwhr  GHSA-qhr7-859c-m2p7
GHSA-rgw5-rvv9-x895  GHSA-rj75-hqrm-r3gf  GHSA-w5vr-8v7q-w6rv
GHSA-w9m9-85wc-3x92  GHSA-wrjc-x8rr-h8h6
```

Remaining package names are `@humanfs/node`, `@tailwindcss/typography`,
`baseline-browser-mapping`, `brace-expansion`, `browserslist`, `i18next`,
`js-yaml`, `postcss-selector-parser`, `react-router`, `react-router-dom`
and `zod`. The old ESLint -> minimatch 3 -> brace 1 branch remains affected by its
six brace advisory IDs; this is why patching the nested 5.x copy does not clear
brace-expansion globally. That unrelated leaf cleanup was not included in this
TS-family-only authorization. The shared peer path can also be reached through
typescript-eslint -> eslint; a clean direct estree/glob path is not a claim that
all tooling paths are safe.

G3's changed packages are development lint tooling. Their input boundary is the
checked-in TypeScript/glob configuration, not a visitor endpoint. Remaining
browser-delivered affected libraries stay i18next, Router core/DOM and Zod, with
the previous conditional-input assessments and unresolved decisions. No finding
or residual risk was accepted merely because it is tooling or currently trusted.

## TypeScript, tests, builds and runtime reproducibility

| Required command/check | Result |
| --- | --- |
| npm ci --engine-strict | Pass |
| npm run typecheck | Pass |
| npm run typecheck:ssg | Pass |
| npm run typecheck:poc | Pass |
| npm run lint | Pass: 0 errors / 8 unchanged warnings |
| npm test | 27 pass |
| npm run test:ssg | 26 pass |
| npm run build | Existing production CSR build passes |
| Repo/root/custom SSG builds | 56 documents and 52 sitemap URLs each |
| Mock Contact SSG fixture | 56 documents |

**53 automated tests pass.** All **224 normal/fixture HTML documents** pass
existing strict UTF-8, NUL/replacement-character, referenced-asset, canonical/
hreflang and sitemap checks. There are 168 normal documents across the three
documented deployment bases. Generated timestamps naturally change; runtime
assets are compared separately instead of demanding timestamp-containing HTML
byte identity.

**Every CSR/SSG JS, CSS and WOFF2 asset matches the preserved G2 baseline bytes.**
No unexpected output difference requires a runtime/source correction. Aggregate
raw/gzip byte totals, unchanged before/after:

| Output | JS files / raw / gzip | CSS files / raw / gzip | Fonts / raw |
| --- | --- | --- | --- |
| CSR | 35 / 799,848 / 254,932 | 3 / 134,968 / 20,179 | 12 / 470,004 |
| SSG | 35 / 802,425 / 255,962 | 3 / 135,904 / 20,200 | 12 / 470,004 |

This verifies reproducible runtime bundles across the tooling update, preserves
G1 Router behavior, numeric formatting, CSS, font/preload strategy and the
Workshop fallback, and introduces no G3 lint code into browser payloads.

Targeted browser checks pass on Windows Chrome **158.0.8127.88**:

| Existing suite | Fresh G3 result |
| --- | --- |
| `npm run test:ssg-browser -- --extra` | 38 interaction cases |
| `npm run test:contact-history` | 40 mocked SSG cases; 152 hydration/metadata checks |
| G1.1 course/service formatting runner in en-US/ar-SA/fr-FR contexts | 12 cases |

These **90 passing cases** cover bilingual service/course/contact pages, Arabic
default and English /en/ routing, legacy paths, supported canonical 404 behavior,
direct visits and refresh, locale switching, Back/Forward, mobile navigation,
reduced motion, retry drafts and success invalidation, plus blocked/read-only
storage. **Zero recoverable hydration errors** were observed. Real submissions
are blocked and only mocked synthetic Contact data is used.

The locale runner is an evidence-path-only ignored copy of the unchanged G1.1
runner; no application or test-source edit is needed. Larger historical G2
352-case/full-route, focused layout and font/performance suites are not counted
as fresh G3 results. The smoke scope is proportionate to a lint-only graph update
with byte-identical runtime assets. Linux and live-hosting behavior remain unverified.

## Performance status, files and disposition

**The independent LCP release-readiness concern remains open and was not
re-measured or fixed in G3.** G2's paired English Training median LCPs were
2,752ms baseline / 2,844ms G2; neither met the earlier 2,500ms target. Byte-identical
bundles do not establish an LCP score. Any investigation needs separate scope
and reproducible target-environment measurement.

G3 changes only:

1. `package.json` — exact existing umbrella dependency target.
2. `package-lock.json` — aligned family and required glob subtree.
3. `docs/PHASE-5C3-G3.md` — this report.
4. `docs/DEVELOPMENT-HANDOVER.md` — current state and remaining blockers.

Ignored evidence is under `dist-ssr/phase5c3-g3/`: before/after audits/trees,
registry metadata, dependency-changes JSON, lint JSON and comparison, complete
validation logs, baseline/runtime asset inventories and browser reports. Source
snapshots protect the existing G1/G1.1/G2 work; generated image-manifest line
endings are restored without altering data. No application-source, lint/build-config or workflow edits,
main changes, staging, commits, pushes, merges or deployments are performed.
Final verification of all 462 baseline project-file hashes finds only the
manifest, lockfile and handover changed; this G3 report is the sole new project
file. All prior application/test/configuration and report files retain their
starting bytes. The combined tree has four modified and eight untracked project
files, including preserved prior phases. Outer main's HEAD, tracked status and
59/154-file artifact inventories remain unchanged.

**Recommendation: accept the scoped local G3 change for review.** The supported
family alignment removes the two intended unique advisory IDs; strict install,
unchanged lint diagnostics/file coverage, TypeScript, all 53 Node tests,
CSR/SSG integrity/reproducibility and 90 targeted browser cases pass. No genuine
new source issue or runtime asset regression surfaced. This is not acceptance
of remaining security risks or production approval. Remaining
release blockers include G4 and separately scoped residual tooling cleanup,
Router/i18next/Zod security decisions, Node 22/Linux, literal index.html aliases,
provider/hosting readiness, the independent LCP concern and separate release
approval. **Production remains BLOCKED.**
