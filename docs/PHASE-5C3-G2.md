# Phase 5C.3-G2 — Vite and PostCSS security remediation

25 November 2026, Asia/Riyadh. **Production release remains BLOCKED.**
**Scoped local G2 validation passes; recommended for review.** The current-machine
absolute LCP target is not cleared; comparison limitations are stated below.

## Scope, safety and target review

Authorized Git root: `G:\ME-Website\ME-2026-Main\ME-2026-Main`.
Branch: `fix/seo-language-consistency`. HEAD remains
`eafb491eb754dee9ba5bb4ea0d42a0e174248455`, with the existing uncommitted G1/G1.1
changes preserved. The outer independent clone remains on main at
`77ba313d8617a082d349f383e876ac34013eb551`.

All npm/build/test commands use **Node 22.23.5 / npm 10.9.9**, prepending the
temporary Node 22 distribution to PATH. The system-default Node 24 is not used.
The staged remediation plan and actual Vite, SSG, PostCSS and Tailwind configs
were reviewed before installation.

Registry checks confirmed Vite **7.3.8** and PostCSS **8.5.33** before changes.
Vite engines require `^20.19.0 || >=22.12.0`; PostCSS accepts `^10 || ^12 || >=14`.
Installed React/React DOM remain **18.3.1**. Vite is framework-agnostic and installed
`@vitejs/plugin-react-swc` **3.11.0** explicitly supports Vite 7. Autoprefixer
**10.4.27** accepts PostCSS `^8.1.0`; Tailwind **3.4.19**, Typography **0.5.19** and
Rollup **4.60.1** remain unchanged. Existing optional Vite peers were not added.

## Baseline preservation

Before installation, ignored `dist-ssr/phase5c3-g2/baseline/` preserves:

- The accepted G1.1 repo SSG site and production CSR output, including CSS/JS/fonts.
- The accepted G1.1 build/test/browser logs and reports. Existing successful builds
  were reused as baseline evidence; no unrelated pre-update rebuild was needed.
- The starting manifest, lockfile, Vite/SSG/PostCSS/Tailwind configurations.
- SHA-256 snapshots of all **461** tracked/relevant untracked project files.

Fresh before/after npm audits and complete dependency trees are separate local
artifacts. Output inventories retain every asset's raw/gzip size and SHA-256.
The historical G1.1 locale fix and browser reports are preserved, not overwritten
as a substitute for new G2 evidence.

## Exact dependency changes

| Package | Starting installed | G2 installed | Resolution |
| --- | --- | --- | --- |
| vite | 7.3.2 | **7.3.8** | Exact root devDependency |
| postcss | 8.5.8 | **8.5.33** | Exact root devDependency |
| esbuild | 0.27.7 | **0.28.2** | Vite permits `^0.27.0 || ^0.28.0` |
| nanoid | 3.3.11 | **3.3.20** | New PostCSS floor `^3.3.20` |
| source-map-js | 1.2.1 | **1.2.4** | Within new PostCSS range `^1.2.2` |

Root requirements change from `vite: ^7.3.2` / `postcss: ^8.5.6` to the exact
versions above, retaining their devDependencies placement.

Standard resolution used:

```text
npm install --save-dev --save-exact vite@7.3.8 postcss@8.5.33 --engine-strict --registry=https://registry.npmjs.org
npm update esbuild --package-lock-only --ignore-scripts --engine-strict --registry=https://registry.npmjs.org
npm ci --engine-strict
```

The direct install retained old esbuild; the targeted compatible update resolves
0.28.2 without a root dependency or override. All **26** `@esbuild/*` native
optional packages align from 0.27.7 to 0.28.2:

```text
aix-ppc64, android-arm, android-arm64, android-x64,
darwin-arm64, darwin-x64, freebsd-arm64, freebsd-x64,
linux-arm, linux-arm64, linux-ia32, linux-loong64, linux-mips64el,
linux-ppc64, linux-riscv64, linux-s390x, linux-x64,
netbsd-arm64, netbsd-x64, openbsd-arm64, openbsd-x64,
openharmony-arm64, sunos-x64, win32-arm64, win32-ia32, win32-x64
```

**Reviewed leaf difference from the earlier plan:** npm selected source-map-js
**1.2.4**, rather than the proposed 1.2.2 floor. Its published metadata was checked
before accepting the lock: same-major patch within PostCSS's declared range,
Node `>=6`, no dependencies and no install lifecycle script. Normal registry URL/
integrity is preserved, and its old advisory is absent from the fresh audit.
This is a documented compatible transitive resolution, not a substituted Vite
or PostCSS target or an override.

Exactly **32 lock records** change: root declaration, five packages and 26 native
packages. No package names are added or removed. All **450 other records** remain
deeply equal to the G1.1 baseline. npm stripped unrelated optional sharp `libc`
metadata from 16 records; those fields were restored exactly before strict clean
installation. No lockfile deletion, broad update, dedupe sweep or audit repair.

React, React DOM, Router DOM/core 6.30.6, remix router 1.23.4, i18next, Zod,
TypeScript ESLint and selector-parser/Typography dependency requirements are
unchanged. G3/G4 are unimplemented. There are **no application source, Vite,
PostCSS, Tailwind, SSG or GitHub Actions configuration changes in G2**.

## Security comparison

Fresh audits use `npm audit --json --package-lock-only --registry=https://registry.npmjs.org`;
post-update omit=dev is also recorded. Audit exit 1 denotes remaining findings.
The installed full dependency tree exits **0**, with no peer/version problems.

| Measure | Before G2 | After G2 |
| --- | --- | --- |
| Unique advisory IDs | 38 | **22** |
| Affected package names | 23 | **18** |
| Package severity totals | 8 high, 14 moderate, 1 low | **4 high, 14 moderate** |
| Introduced IDs | — | **0** |
| Post-update omit=dev | Not repeated before G2 | 5 names: 1 high, 4 moderate |

Resolved advisory IDs, grouped by affected leaf:

- Vite: **GHSA-v6wh-96g9-6wx3**, **GHSA-698v-4r3x-3vcv**,
  **GHSA-r825-w8mm-5pxw**, **GHSA-587h-7wmj-h5pm**,
  **GHSA-9jrq-w75r-8gcw**, **GHSA-rq7h-c2jc-7f22**,
  **GHSA-fx2h-pf6j-xcff**.
- PostCSS: **GHSA-qx2v-qp2m-jg93**, **GHSA-6g55-p6wh-862q**,
  **GHSA-fxqj-rqcc-2cmp**, **GHSA-r28c-9q8g-f849**.
- esbuild: **GHSA-g7r4-m6w7-qqqr**.
- Nano ID: **GHSA-28wg-ghj8-5hjv**, **GHSA-2v37-7h3g-55p8**,
  **GHSA-xwg4-73v4-xw9w**.
- source-map-js: **GHSA-68fv-2mgg-jv7q**.

All **22 remaining IDs**:

```text
GHSA-2883-xcg3-v3hh  GHSA-337j-9hxr-rhxg  GHSA-3jxr-9vmj-r5cp
GHSA-52cp-r559-cp3m  GHSA-5p4m-2wfm-xmqj  GHSA-6j4f-fj2g-mc7p
GHSA-6jcc-5g8w-32mx  GHSA-73wf-gq98-2v4g  GHSA-c83g-rgw3-j3cx
GHSA-g3hv-75wg-m249  GHSA-h67p-54hq-rp68  GHSA-jxxr-4gwj-5jf2
GHSA-mh99-v99m-4gvg  GHSA-mrhx-c7xc-m3w5  GHSA-p498-v437-472g
GHSA-q2hr-2g5m-vwhr  GHSA-qhr7-859c-m2p7  GHSA-rgw5-rvv9-x895
GHSA-rj75-hqrm-r3gf  GHSA-w5vr-8v7q-w6rv  GHSA-w9m9-85wc-3x92
GHSA-wrjc-x8rr-h8h6
```

An in-memory Vite client build records actual emitted module identities. None of
the five G2 target packages ships as an application browser module. Remaining
affected browser packages are **i18next, react-router, react-router-dom and zod**.
Their advisory ranges and F's conditional-input assessments remain unresolved;
no residual risk is accepted here. The two IDs removed by G1 stay absent.

Remaining developer/build/CI findings include selector parsing (G4), glob/brace
chains and TypeScript ESLint, YAML/target-query/statistics/filesystem helpers.
Trusted current inputs limit some conditions but do not patch those versions or
approve deferral. Workflow credential/permission hardening, Linux execution and
live hosting are separate outstanding work. This version/audit reassessment is
not a penetration test or a claim that every build/CI exposure is removed.

## Build, HTML and bundle comparison

Strict clean installation passed. All three TypeScript scripts, lint (zero
errors/eight existing warnings), `npm test` (**27**) and `test:ssg` (**26**) pass:
**53 automated tests**. Existing CSR production build, repo/root/custom SSG
builds and mocked Contact fixture build all pass. Each candidate variant produces
52 indexable and four auxiliary documents, with 52 sitemap URLs: **224 HTML
documents** across all four outputs. Existing strict byte/UTF-8/NUL/replacement,
asset, canonical/hreflang and sitemap guards pass. SSR remains the existing
React 18 web-stream renderer; no renderer or import migration.

Aggregate output assets, before **and** after (these are full asset sets, not
the transfer size of any individual route):

| Output | JS files / raw / gzip bytes | CSS files / raw / gzip bytes | Font files / raw bytes |
| --- | --- | --- | --- |
| CSR | 35 / 799,848 / 254,932 | 3 / 134,968 / 20,179 | 12 / 470,004 |
| SSG | 35 / 802,425 / 255,962 | 3 / 135,904 / 20,200 | 12 / 470,004 |

**Every JS, CSS and WOFF2 asset is byte-identical to baseline.** This includes
Tailwind/Autoprefixer output, RTL/LTR, responsive/reduced-motion styles and the
approved Inter/Noto Sans Arabic font assets. Hash inventories are preserved.
Generated HTML naturally has a new render timestamp; static integrity/metadata
checks validate it rather than requiring timestamp-containing HTML byte identity.

## Browser, visual and performance results

All functional suites pass on Windows Chrome **158.0.8127.88**:

| Suite | Result |
| --- | --- |
| Full G1 canonical-route/hydration/query/refresh sweep | 222 cases |
| Existing SSG interactions | 38 cases |
| Mocked SSG Contact history | 40 cases; 152 hydration/metadata checks |
| Mocked CSR Contact history | 40 cases |
| Real en-US/ar-SA/fr-FR contexts for ar/en course/service pages | 12 cases |
| Workshop font handoff, breakpoint/scope and curriculum layout | 20 cases |

This repeats the **352 functional browser cases**, plus 20 focused course-layout
cases. Coverage includes both homepages, six services, all course/project pages,
Contact/ContactResult, language switching, Back/Forward, direct load/refresh,
legacy language URLs, canonical 404 behavior, desktop/mobile navigation,
reduced motion, retry drafts and success invalidation across history/locale/
storage-denial cases. **Zero recoverable hydration errors** were observed. G1.1's
deterministic number-formatting checks remain effective. Real submissions and
external integrations are blocked in the test fixtures. Literal `index.html`
aliases remain an independent unresolved issue, not included as a G2 regression.

The existing font-comparison harness compares the **preserved actual G1.1 site**
with the new candidate: 390x844 mobile and 1440x1000 desktop, both locales,
home/BIM Training/Workshop 03. It passes **12 screenshot comparisons**, with
unchanged rendered font-family/glyph usage and **zero geometry differences**.
Eleven pairs have zero pixels beyond the existing channel-delta threshold of 20.
The English desktop home has eight such pixels out of 1,440,000
(**0.000556%**), localized to the small animated scroll indicator on inspection;
it is within the existing 0.5% visual gate. No content, typography or layout
change was identified. Six additional font-aware language-switch/Back checks
and six mixed-script Inter/Noto checks pass. Workshop fallback remains scoped
correctly across the eight controlled widths and all course routes.

### Repeatable local performance comparison

The unchanged `test-ssg-font-loading.mjs` runs **three paired cold loads per cohort
per page**, with fresh contexts/cleared cache, normal within-load cache,
100ms latency, 4Mbps download/1Mbps upload, 4x CPU throttling, identical gzip/
max-age=600 serving and HTTPS blocking. Performance loads use normal real-time
motion; clocks are normalized only in separate screenshot checks. Browser suites
and builds finish before this sequential comparison. The fixed before-then-after
ordering and small sample limit statistical inference.

There are **36 cold measurements plus two warm reload controls**. Median LCPs:

| Page | G1.1 baseline ms | G2 ms | Difference ms |
| --- | --- | --- | --- |
| Arabic home | 5,088 | 4,844 | -244 |
| Arabic training | 4,024 | 3,920 | -104 |
| Arabic Workshop 03 | 1,824 | 1,816 | -8 |
| English home | 3,728 | 3,716 | -12 |
| English training | 2,752 | 2,844 | +92 (+3.34%) |
| English Workshop 03 | 1,376 | 1,440 | +64 (+4.65%) |

Maximum CLS is **0.001352373** before and after; all measured cases satisfy the
existing comparison harness's **CLS <= 0.1** gate. Cold transfer totals, font-byte
totals, requested font paths and preload sets match in every measured cohort.
Arabic samples retain 260,937 font-transfer bytes, English home 63,200, and
English training/course **48,436**. English Training cold total stays **371,512
bytes**; its warm reload has **zero font-transfer bytes**, baseline and G2 alike.
No remote Google-font CSS requests, new font requests or duplicate preloads are
introduced. Locale-aware font optimization is preserved.

**No material G2 regression is confirmed by this sample.** The small positive
English timing differences are retained, not hidden or called equivalent by a
statistical test. All runtime JS/CSS/font payloads are byte-identical; this does
not prove timing equivalence or field CWV. **The previous 2,500ms English Training
LCP target is not met on this computer in either baseline or G2**: medians are
2,752/2,844ms and maxima 3,372/2,848ms. This run does not re-establish the old
device's absolute performance-budget result. Target-device/Linux/hosting
performance readiness remains a release verification item, separate from G2's
local compatibility/security containment recommendation.

Key additional commands (existing harnesses; generated diagnostics are local):

```text
node scripts/test-router-g1-browser.mjs
npm run test:ssg-browser -- --extra
npm run test:contact-history
npm run test:contact-history -- --csr
npm run test:course-layout -- --output dist-ssr/phase5c3-g2/course-layout
node scripts/test-ssg-font-loading.mjs --baseline dist-ssr/phase5c3-g2/baseline/site --candidate dist-ssr/candidate/repo/site --output dist-ssr/phase5c3-g2/font-comparison --runs 3
```

The locale runner is an ignored diagnostic copy of the unchanged G1.1 runner,
with only evidence/import paths redirected to preserve prior evidence. Native
Linux binaries and actual Linux/Pages behavior are not certified by Windows
success.

## Changed files, evidence and recommendation

G2 changes only `package.json`, `package-lock.json`,
`docs/DEVELOPMENT-HANDOVER.md` and new `docs/PHASE-5C3-G2.md`.
All pre-existing G1/G1.1 source, test, documentation and configuration work is
preserved. Diagnostic scripts/inventories and generated sites remain under
ignored `dist-ssr/phase5c3-g2/`; none is a published deployment artifact.
Final SHA-256 verification of the 461 baseline project files finds only the
manifest, lockfile and handover changed; the G2 report is the only new project
file. The image generator's incidental manifest line endings were restored.
The combined uncommitted tree has four modified and seven untracked project
files, including the preserved G1/G1.1 work; nothing was staged. Outer main's
HEAD, tracked status and untracked inventory are unchanged.

**Recommendation: accept the scoped local G2 change for review.** Exact targets,
compatible reviewed leaves, strict installation, all functional/static gates,
CSS/assets and representative visual/font comparisons pass. No significant
regression or new advisory ID is confirmed. This is not production release,
residual-risk acceptance or an absolute LCP-budget signoff.
Production remains **BLOCKED** by outstanding G3/G4/security decisions,
Node 22/Linux verification, literal index.html aliases, provider/hosting readiness
and target-environment performance verification and separate release approval.
No main changes, commits, pushes, merges or
deployment are authorized or performed.
