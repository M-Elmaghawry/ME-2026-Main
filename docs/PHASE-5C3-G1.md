# Phase 5C.3-G1 — React Router security remediation

25 November 2026, Asia/Riyadh. **G1 dependency change implemented; functional acceptance ON HOLD. Production release BLOCKED.**

## Repository and environment

- Authorized checkout and verified Git root: `G:\ME-Website\ME-2026-Main\ME-2026-Main`.
- Branch: `fix/seo-language-consistency`.
- Starting and ending HEAD: `eafb491eb754dee9ba5bb4ea0d42a0e174248455`; changes are uncommitted.
- Starting development working tree was clean. The outer independent clone remained
  on `main` at `77ba313d8617a082d349f383e876ac34013eb551`; its tracked files and
  pre-existing untracked nested clone/artifacts were preserved.
- All npm/build/test commands used Node **22.23.5** and npm **10.9.9** from
  `%TEMP%\me-phase5c3g-runtime\node-v22.23.5-win-x64`, prepended to the command's PATH.
  System-default Node 24 was not used for implementation or validation.
- Reviewed DEVELOPMENT-HANDOVER, PHASE-5C3-F, REMEDIATION-PLAN and FULL-CLASSIFICATION.
  Registry metadata was checked before changing dependencies.

## Exact dependency and lockfile changes

| Package | Before installed | After installed | Dependency path |
| --- | --- | --- | --- |
| react-router-dom | 6.30.3 | **6.30.6** | Root production dependency |
| react-router | 6.30.3 | **6.30.6** | react-router-dom -> react-router |
| @remix-run/router | 1.23.2 | **1.23.4** | Both Router DOM and core; one deduplicated copy |

The manifest requirement changes from `^6.30.1` to exact `6.30.6`. Standard npm
resolution used `npm install --save-exact react-router-dom@6.30.6 --engine-strict
--registry=https://registry.npmjs.org`. Published peers accept React/React DOM
`>=16.8`; engines accept Node `>=14`. React/React DOM remain **18.3.1**. The v6
`react-router-dom/server.js` entry resolves, and existing SSG/POC TypeScript and
SSG builds pass without import or architecture changes.

The lock changes only the root requirement and the three Router package entries:
versions, registry tarball URLs, integrity hashes and exact internal Router pins.
No packages are added or removed. All **478 other lock entries** compare deeply
equal to their before snapshot. npm initially stripped `libc` metadata from 16
unchanged optional sharp packages; that unrelated metadata was restored exactly
before a successful clean `npm ci --engine-strict`. No forced resolution or npm
override was introduced.

Vite **7.3.2**, PostCSS **8.5.8**, TypeScript ESLint **8.57.2**, i18next **25.10.10**,
Zod **3.25.76** and every other non-Router locked dependency remain unchanged.
No G2/G3/G4, Router 7, workflow, application-architecture or deployment changes.

## Security before and after

Fresh commands used `npm audit --json --package-lock-only --registry=https://registry.npmjs.org`
before and after, plus `--omit=dev` after. Audit exit 1 means findings; it is not
an installation failure. No `npm audit fix` was run.

| Scope | Before | After |
| --- | --- | --- |
| Affected package names, full graph | 24: 8 high, 15 moderate, 1 low | 23: 8 high, 14 moderate, 1 low |
| Unique advisory IDs, full graph | 40 | 38 |
| Newly introduced IDs | — | **0** |
| Post-G1 omit=dev graph | Not repeated before in G1 | 8 names: 4 high, 4 moderate |

Removed from the entire audited tree:

- **GHSA-jjmj-jmhj-qwj2**: Router DOM open redirect/XSS condition, affected
  `>=6.30.2 <=6.30.5`; the new direct version is outside that range.
- **GHSA-2j2x-hqr9-3h42**: same-origin/protocol-relative data-router redirects.
  The installed core and remix router now exceed the affected 6.x/1.x ranges.

Remaining Router IDs, inherited by Router DOM:

- **GHSA-wrjc-x8rr-h8h6**: navigation/backslash open redirect, core `>=6 <7.18.0`.
  Navigation code remains in use. Input-boundary investigation or an explicitly
  reviewed residual decision is still required; no residual was accepted here.
- **GHSA-337j-9hxr-rhxg**: SSR error constructor deserialization, core
  `>=6.4 <7.18.0`. The existing declarative/static architecture is distinct from
  the advisory's data-router error-hydration path, as documented in F. The package
  remains affected by range; this is not a patched-version claim.

`npm ls --all --json` exits **0**, as does the focused Router dependency tree.
This is partial security containment, not complete Router security remediation.

## Automated validation

| Command/check | Result |
| --- | --- |
| npm ci --engine-strict | PASS: 397 packages installed, 398 audited |
| npm run typecheck | PASS |
| npm run typecheck:ssg | PASS |
| npm run typecheck:poc | PASS |
| npm run lint | PASS: 0 errors, 8 existing warnings |
| npm test | PASS: 27 tests |
| npm run build | PASS: existing CSR production build |
| Repo/root/custom SSG builds | PASS: 56 documents and 52 sitemap URLs each |
| npm run test:ssg | PASS: 23 tests, including static contracts and renderer guards |
| Mock contact-fixture SSG build | PASS: 56 documents |

The three normal variants plus mock fixture generated **224 HTML documents**.
Build guards passed UTF-8/NUL/replacement-character validation, referenced local
assets, canonical/hreflang metadata and sitemap checks. These byte/static checks
do not imply successful browser hydration. Existing Browserslist-data and mixed
static/dynamic-import warnings were retained, without unrelated updates.

SSG commands were exactly:

```text
npm run build:ssg-candidate -- --variant repo --base /ME-2026-Main/ --site-url https://m-elmaghawry.github.io/ME-2026-Main/
npm run build:ssg-candidate -- --variant root --base / --site-url https://example.com/
npm run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/
npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
```

## Browser gate failure and diagnosis

New reusable verification command: `node scripts/test-router-g1-browser.mjs`.
It uses the existing local static-server/metrics helpers and installed Chrome
**158.0.8127.88**, blocks external requests, and is designed to sweep all 168
normal documents, representative refreshes and bounded hostile query inputs.
It creates no real submission. It stops at the first failure.

**Actual default-context result: 10 pages passed, then one failure.** Passing
pages were Arabic home, About, Services, all six service details, and Courses
index under the repository base. Arabic `/courses/bim-fundamentals/` failed
DOM-preservation checks. A focused reproduction confirmed React recoverable
errors **425, 418 and 422**, replacement of main/H1, and changed IDs. This is a
canonical trailing-slash URL, separate from the known literal `index.html` alias
issue. The implementation/test sequence stopped; later browser suites did not run.

The first actual text difference is SSR **`٣٠٠`** versus browser **`300`** for
the rating count. CourseDetail calls `ratingCount.toLocaleString()` and other
number formatting without an explicit locale. These calls are also present at
the original checkpoint; G1 did not edit CourseDetail. The build account's Node
default locale is **ar-SA**. The default browser context uses **en-US**. Running
outside the sandbox also gives Node an en-US default: the process/account locale
must not be assumed equal to the locale that generated the saved SSR HTML.

A bounded diagnostic control with the **same post-G1 HTML and JS**, changing only
the browser context to **ar-SA**, passes DOM/ID preservation with **zero
recoverable errors**, immediately after hydration and after settling. An initial
control incorrectly matched the runner's en-US locale rather than the saved
SSR's ar-SA formatting; its failing evidence is retained too. This establishes
the ambient-number-locale mismatch as the observed immediate cause. The control
does **not** make the failed default-context test pass and does not establish
cross-locale support.

No original-Router runtime A/B build was performed. No individual Router patch
is established as causing this failure; attributing it to the dependency update
would exceed the evidence. There is no application formatting fix in G1.

**Unverified after G1:** remaining Arabic pages, English pages, root/custom-base
browser routes, project/contact browser routes, refreshes, all-page hydration,
language switching, Back/Forward, legacy query URLs, supported canonical 404s,
reduced motion, retry -> language switch, success -> Back/refresh, draft
invalidation and history restoration. The existing interaction and SSG/CSR
contact-history suites were queued after the sweep and were not reached. Their
historical passing results are not reused as G1 results. The new bounded hostile
query cases were also not reached; no new navigation-safety claim is made.

## Evidence, changed files and disposition

Ignored local evidence is under `dist-ssr/phase5c3-g1/`: before/after audits,
registry metadata, before manifests, full npm tree, install/clean-install logs,
all automated/build logs, `audit-comparison.json`,
`hydration-sweep-first-failure.json` and its log,
`course-hydration-diagnostic.json`, and
`course-hydration-matched-locale-control.json`. The last two include text and
hydration metrics. Diagnostic scripts and generated builds are local artifacts;
the new reusable browser runner is retained as an untracked project file for review. Local ignored evidence
does not become part of a future clone automatically.

Exact changed/untracked project files for this implementation:

1. `package.json` — exact approved direct requirement.
2. `package-lock.json` — only the root declaration and three Router nodes.
3. `scripts/test-router-g1-browser.mjs` — new local browser regression runner.
4. `docs/PHASE-5C3-G1.md` — this report.
5. `docs/DEVELOPMENT-HANDOVER.md` — current state and outstanding gates.

The image generator's incidental manifest line-ending normalization was restored
to the checkpoint; no application source changes remain. No stage, commit, push,
merge, rollback or deployment occurred. The outer main checkout was preserved.

**Acceptance recommendation: HOLD G1 functional acceptance.** The exact dependency
scope, install reproducibility, targeted advisory removal and automated/static
checks pass. The required default-locale hydration and broader browser gates do
not. Preserve the candidate and failed evidence for review; do not proceed to G2.

Targeted next work, separately authorized: make course numeric SSR/client output
deterministic with an explicit shared locale/numbering policy, check the original
Router baseline where attribution is needed, and rerun all required browser
suites. Do not merely set the browser to ar-SA and call the issue resolved.
If rollback is preferred, restore only G1's root requirement and three Router
lock entries to their checkpoint values, then run a strict clean install while
preserving tests/docs and unrelated work. No rollback was performed automatically.

G2/G3/G4, remaining security/residual decisions, Linux/Node 22 verification,
literal `index.html` alias handling and final hosting verification remain
outstanding. **Production release remains BLOCKED.**
