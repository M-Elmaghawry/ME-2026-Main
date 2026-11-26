# Phase 5C.3-G1.1 — Deterministic locale formatting and SSR hydration

25 November 2026, Asia/Riyadh. **Production release remains BLOCKED.**

## Repository and preserved G1 scope

Authorized Git root: `G:\ME-Website\ME-2026-Main\ME-2026-Main`.
Branch: `fix/seo-language-consistency`. Starting/ending HEAD remains
`eafb491eb754dee9ba5bb4ea0d42a0e174248455`; work is uncommitted.
The pre-existing G1 manifest, lockfile, browser runner and reports were inspected
and preserved. Node **22.23.5** / npm **10.9.9** were used throughout, with the
temporary Node 22 runtime prepended to each command's PATH. The outer independent
clone remains on main at `77ba313d8617a082d349f383e876ac34013eb551`.

G1 dependencies stay at Router DOM/core **6.30.6** and remix router **1.23.4**.
Both manifest and lockfile are byte-identical to their G1.1 starting snapshots.
No installation/update, G2/G3/G4, business-data, translation-resource, typography,
CSS, SSR-architecture or workflow changes were made in G1.1.

## Root cause and established presentation

The pre-fix generated site was reproduced before rebuilding. Arabic and English
BIM Fundamentals each recorded 12 recoverable hydration errors and replaced
initial DOM/IDs; both representative service pages had zero errors. Original
server text used **`٣٠٠`** while the initial en-US browser render used **`300`**.
This was a canonical route, independent of literal `index.html` aliases.

Six rendering sites in **CourseDetail** used unqualified `Number.toLocaleString()`:
student statistics, rating count, student-count line, instructor total, and the
Arabic/English final enrollment call to action. Node's build account defaulted to
ar-SA, while Playwright's default browser context used en-US. Even the escalated
Node account has a different default locale from the sandbox builder. The
component therefore serialized and hydrated different strings from identical
numeric data. These calls existed before G1; no Router version caused the number
formatting policy itself.

The approved convention is **Western digits with comma grouping for these course
counts in both languages**. Evidence includes the checked-in Arabic instructor
biography (`+13`, `1,200`, `15`), English equivalents, existing Western ratings/
hours/count copy, and the pre-fix settled en-US browser presentation. Arabic
**currency and dates have their own explicit locale convention** and were not
changed. This is not a global digit conversion.

The new `src/lib/formatting.ts` exports `formatCount`, using cached
`Intl.NumberFormat('en-US', { numberingSystem: 'latn', maximumFractionDigits: 0,
useGrouping: true })`. CourseDetail uses it at those six sites. No hydration
warning is suppressed, no content is hidden/delayed, and SSR remains enabled.

### Application formatting inventory

| Location/content | Classification and treatment |
| --- | --- |
| CourseDetail's six count sites | Active SSR defect; corrected through the shared explicit formatter |
| Course ratings, percentages, hours and service statistics rendered as existing strings/JS interpolation | No ambient Intl lookup; preserve current values and presentation |
| `src/lib/pricing.ts` / `formatPrice` | Explicit ar-EG/en-US currency formatting; separate established currency convention, unchanged |
| Course offer date | Explicit ar-EG/en-GB plus Asia/Riyadh timezone; unchanged |
| `src/contexts/renderState.ts` date/year/time hooks | Candidate uses its serialized render snapshot; fallback uses explicit date locale for CSR, not the candidate's initial SSR/client path; unchanged |
| SSG generator's dates/year | Explicit locale/timezone and serialized boot snapshot; unchanged |
| `src/components/ui/chart.tsx` tooltip | One unqualified formatting call, but no current application consumer/import and no active SSR output; not changed speculatively |
| i18next/page bootstrap | Page instance awaits initialization with explicit boot ar/en; routing language does not depend on OS/browser default locale; unchanged |

Prices, dates, percentages, static service metrics and i18next were inspected;
they were not assumed defective merely because they contain numbers or Intl.

## Tests and before/after evidence

- `tests/ssg-formatting.test.mjs`: three tests vary the simulated Intl default
  (ar-SA/en-US/fr-FR), verify the requested explicit locale/options and confirm
  `300`, `1,200`, `0`. Included by the existing `test:ssg` glob, with no package
  script or dependency change.
- `scripts/test-locale-formatting-browser.mjs`: Arabic/English BIM Fundamentals
  and BIM Training service under real en-US/ar-SA/fr-FR browser contexts. All
  **12 post-fix cases pass**, with server count `300`, settled client count `300`,
  original DOM/IDs preserved and zero recoverable errors. The SSR document is
  parsed independently; it is not inferred solely from client output.
- The same runner's `--before` mode captured four local pre-rebuild reference
  pages. These are baseline captures, not passing pre-fix hydration tests.
- Four 1440x1000 reduced-motion screenshot pairs (course/service, ar/en) have
  **zero exact RGBA pixel differences and zero geometry differences**. Raw image
  buffers were compared in addition to the existing image-difference helper.
  This is representative local design verification, not a rerun of the historical
  full visual/performance benchmark or every breakpoint.
- `scripts/test-router-g1-browser.mjs` resumes the G1 sweep. Its empty
  ContactResult expectation was corrected: that route intentionally redirects to
  Contact after hydration, so final DOM identity and canonical target must match
  the destination rather than the abandoned result page. Zero recoverable errors
  remains mandatory; ordinary documents retain strict original DOM/ID checks.
  The initial false failure and its log are preserved. No application redirect
  behavior was altered to satisfy the test.

## Automated and browser validation

| Validation | Result |
| --- | --- |
| npm run typecheck / typecheck:ssg / typecheck:poc | All pass |
| npm run lint | Pass: zero errors, eight existing warnings |
| npm test | 27 pass |
| npm run test:ssg | 26 pass, including three new formatting tests |
| npm run build | Existing production CSR build passes |
| Repo/root/custom candidate builds | 56 documents and 52 sitemap URLs per variant |
| Mock Contact fixture build | 56 documents |
| Full G1 hydration/navigation sweep | 222 pass, zero failures |
| Existing SSG interaction suite (`test:ssg-browser -- --extra`) | 38 pass |
| Existing SSG contact history | 40 pass; 152 hydration/metadata checks |
| Existing CSR contact history | 40 pass; CSR has no SSR hydration counter |
| Cross-locale formatting/visual browser runner | 12 pass |

Overall, **53 Node tests and 352 browser cases pass** (222 sweep, 38 interactions,
40 SSG history, 40 CSR history, 12 cross-locale cases). All **224 normal/fixture HTML documents** pass the existing strict UTF-8/NUL/
replacement-character, asset, canonical/hreflang and sitemap guards. Normal
variants account for 168 documents. Browser coverage includes all indexable
Arabic/English pages, all six services and all course/project routes across
repo/root/custom bases, Contact and empty ContactResult, direct navigation,
refresh, legacy language URLs, same-origin hostile-query probes, 404 behavior,
language switching, Back/Forward, mobile navigation, automatic motion and reduced
motion. Static and selected hydrated metadata checks detect duplicate metadata.

Contact checks use only synthetic, mocked submissions and block external
requests. They cover retry -> locale switch -> Back/Forward/refresh, successful
submission -> Back/refresh, stale-result/legacy-draft invalidation, fresh retries,
and blocked/read-only sessionStorage. No real email or CAPTCHA submission occurs.

Rebuild/test commands use the existing package scripts. Candidate commands:

```text
npm run build:ssg-candidate -- --variant repo --base /ME-2026-Main/ --site-url https://m-elmaghawry.github.io/ME-2026-Main/
npm run build:ssg-candidate -- --variant root --base / --site-url https://example.com/
npm run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/
npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
node scripts/test-locale-formatting-browser.mjs
node scripts/test-router-g1-browser.mjs
npm run test:ssg-browser -- --extra
npm run test:contact-history
npm run test:contact-history -- --csr
```

The visual runner needs its local pre-rebuild `--before` captures; those ignored
reference files are not recoverable from Git alone. All browser results here use
installed Chrome **158.0.8127.88** on Windows, not a Linux/CI or live-hosting test.

## Security preservation

Fresh `npm audit --json --package-lock-only --registry=https://registry.npmjs.org`
has the **same exact 38 advisory IDs as post-G1**. Findings remain 23 affected
package names: eight high, fourteen moderate, one low. No new advisory ID appears.
**GHSA-jjmj-jmhj-qwj2** and **GHSA-2j2x-hqr9-3h42** remain absent.
**GHSA-wrjc-x8rr-h8h6** and **GHSA-337j-9hxr-rhxg** remain in the Router audit.
No complete Router-security or residual-risk-acceptance claim is made.

## Deliverables, evidence and disposition

G1.1 changes exactly:

1. `src/lib/formatting.ts` — new explicit count formatter.
2. `src/pages/CourseDetail.tsx` — six formatting sites.
3. `tests/ssg-formatting.test.mjs` — new Intl-default regression tests.
4. `scripts/test-locale-formatting-browser.mjs` — real browser locale/visual checks.
5. `scripts/test-router-g1-browser.mjs` — correct intentional ContactResult redirect expectation.
6. `docs/PHASE-5C3-G1-1.md` — this report.
7. `docs/DEVELOPMENT-HANDOVER.md` — current status and remaining release gates.

Prior G1 changes in package.json, package-lock.json and PHASE-5C3-G1.md are
preserved. New files remain untracked, with no staging or commits. The generated
image manifest's incidental line-ending normalization is restored to the
checkpoint without changing application data.

Local logs, audits, formatting-before/after JSON, screenshots and sweep/interaction
reports are in ignored `dist-ssr/phase5c3-g1-1/`; contact harness reports remain in
the per-run ignored `dist-ssr/phase5c3-b-*` paths printed in their logs. G1's first
failure evidence remains separately preserved. Generated artifacts are not a
deployment; this report is retained in the project for review.

**G1 functional acceptance recommendation: accept the scoped local G1/G1.1
functional remediation for review.** The interrupted hydration/browser gates now
pass, the established presentation is unchanged, and G1's security containment is
preserved. This is not security-residual acceptance or production release approval.
Remaining production gates are G2/G3/G4 and security decisions,
Linux/Node 22 verification, literal `index.html` aliases, final Pages hosting/
provider verification and separate release approval. No outer-main changes,
commits, pushes, merges or deployment were performed.
