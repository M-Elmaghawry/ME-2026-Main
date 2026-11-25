# Development handover — bilingual SSR checkpoint

**PRODUCTION RELEASE STATUS: BLOCKED. Development checkpoint only.**

Updated: 25 November 2026, Asia/Riyadh. Cross-device development checkpoint.

- Repository: https://github.com/M-Elmaghawry/ME-2026-Main
- Development branch: `fix/seo-language-consistency`
- Current checkpoint: the development commit containing this handover, with message
  `checkpoint: preserve bilingual SSG and security audit before device transfer`.
  After cloning, record its full SHA with `git rev-parse HEAD` and verify it matches
  `origin/fix/seo-language-consistency`. The final checkpoint report supplies the SHA.
- Previous checkpoint SHA: **`c2599aedf203a51f29382ae17370e5f23cc902c3`**. That implementation snapshot uses
  `checkpoint: preserve bilingual SSR development and release blockers`.
  A following documentation-only commit records this SHA without changing runtime code.
- Pre-transfer branch tip: `de485daffaf72be29a1a2118dcc01e1aa7823755`.
  The current checkpoint includes the subsequent approved B/C/D source changes
  and E/F audit reports; it is a development backup, not a production release.
- Previous development baseline: `616197ee00442cf90a38436a52f6f994b9b84e0a`.
- Verified production/main baseline during audit:
  `77ba313d8617a082d349f383e876ac34013eb551`, successful Pages workflow
  [45142045741](https://github.com/M-Elmaghawry/ME-2026-Main/actions/runs/45142045741).

## Current implementation and completed work

Phase 5B bilingual SEO/navigation work and the Phase 5C.1 isolated experiment are
preserved. Phase 5C.2 implements a separate production SSG **candidate** using
React/React DOM 18.3.1, TypeScript and Vite. Arabic retains existing paths; English
uses `/en/`. It generates 52 indexable documents plus four noindex auxiliaries.
Repository, root and arbitrary subpath builds total 168 HTML documents.

The React 18 NUL-byte renderer issue is resolved in the candidate with
`react-dom/server.browser`, `renderToReadableStream`, `allReady`, strict streaming
UTF-8 decoding and permanent integrity guards. No React internals were patched.
Phase 5C.2-F fixes initial retry-draft hydration recovery, reduced-motion visibility
and font delivery. Typography remains **Noto Sans Arabic and Inter**.

Phase 5C.3-A is a completed audit with a **BLOCKED** release conclusion.
Phase 5C.3-B locally fixes its two Contact history/draft regressions; see
[implementation and validation](PHASE-5C3-B.md). Its approved source and tests are
included in this development checkpoint. Release remains BLOCKED by the gates below.
Phase 5C.3-C adds locale-aware preload/decode hints and removes unnecessary Noto
downloads measured on English mobile pages. Its initial failed CLS/LCP findings
are preserved in the [historical font report](PHASE-5C3-C.md).
Phase 5C.3-D clears the targeted local performance gate with a scoped Workshop
badge fallback correction. Nine cold runs give maximum CLS 0.001565; English
Training LCP is 1,924 ms median and 2,064 ms maximum. The earlier consistent
516 ms slowdown is not reproduced in the larger balanced comparison. See the
[current performance report](PHASE-5C3-D.md). All approved Phase 5C.3-B/5C.3-C/5C.3-D
source, tests and compact evidence are included in this development checkpoint.
Phase 5C.3-E completed a clean Windows Node 22.23.5/npm 10.9.9 verification and
dependency/hosting audit; [its report](PHASE-5C3-E.md) is now preserved under docs.
Phase 5C.3-F completed read-only security triage and a staged remediation plan;
see [the assessment](PHASE-5C3-F.md), [all 24 package classifications](phase5c3-f/FULL-CLASSIFICATION.md)
and [exact proposed strategy](phase5c3-f/REMEDIATION-PLAN.md). No dependency was
upgraded and no advisory was marked resolved. Phase 5C.3-G has not been implemented
or approved by this checkpoint request.
The existing `build`/`build:gh-pages` commands and active Pages workflow still
produce the existing CSR site. No SSG deployment switch has been activated.

## Known blockers — unresolved

1. **Node 22/Linux compatibility is not verified.** Windows Node **22.23.5** /
   npm **10.9.9** passed Phase E; older local phases used Node 24.19.0/npm 11.17.0.
   Docker/Podman and installed WSL were unavailable. Locked jsdom requires at
   least Node **22.22.2** within Node 22. Windows success is not Linux validation.
2. **Literal `index.html` aliases have routing/hydration mismatches.** Canonical
   generated trailing-slash routes passed. No alias normalization has been implemented;
   a portable reproduction is provided below.
3. **Dependency security findings remain unresolved:** 24 affected package names,
   **40 unique advisories** (8 high, 15 moderate, 1 low). Five affected names ship
   browser code; nineteen are tooling. No exploit was demonstrated in E/F, but
   material conditional exposures and unaccepted residual risks remain. No finding
   is resolved merely by its classification.
4. **Phase 5C.3-G dependency remediation is not implemented or approved.** Proposed
   versions and the scoped override are a plan only, not installed/tested changes.
5. **Final GitHub Pages hosting verification and SSG cutover are outstanding.**
   The production workflow still builds CSR. Actual SSG hosting, provider setup,
   Linux browser behavior and separate release approval remain unverified.

The earlier English font overfetch is addressed by the local Phase 5C.3-C
changes: paired English Training mobile transfers fell from 569,380 to 371,560
bytes (34.74%), with font bytes 246,173 to 48,436. English pages preload Inter
only; actual mixed-script text can still request Noto through unchanged CSS.
Arabic font transfers are unchanged. With Phase 5C.3-D the final Training
transfer is 371,591 bytes with the same 48,436 font bytes. Local targeted
performance gates now pass, but this remains separate from production signoff.
Original strategy / optimized strategy / fixed candidate median Training LCPs
are 2,064 / 2,016 / 1,924 ms in nine balanced cold runs each. The small sample
does not prove statistical equivalence or field CWV; complete distributions and
uncertainty are in the current report.

The stateful language switch still transfers history state before reload. Phase
5C.3-B reconciles the document locale before the candidate router handles history
traversal. A session-scoped revision invalidates older draft copies after success;
form fields remain in history only, with no PII/CAPTCHA in storage or static HTML.
When sessionStorage is blocked/read-only, same-document retry works but fresh
documents conservatively clear drafts. Review this documented degradation rather
than introducing persistent private draft storage.

## Durable documentation and evidence

- [Phase 5C.3-F security triage](PHASE-5C3-F.md),
  [full classification](phase5c3-f/FULL-CLASSIFICATION.md),
  [remediation plan](phase5c3-f/REMEDIATION-PLAN.md),
  [40-advisory disposition](phase5c3-f/advisory-disposition.json) and
  [fresh Node 22 audit](phase5c3-f/audit-full.json)
- [Phase 5C.3-E Windows Node 22 and dependency audit](PHASE-5C3-E.md),
  [validation summary](phase5c3-e/validation-summary.json) and
  [workflow compatibility assessment](phase5c3-e/WORKFLOW-ASSESSMENT.md)
- [Phase 5C.3-D targeted correction and current validation](PHASE-5C3-D.md)
- [Current benchmark and regression results](phase5c3-d/validation-summary.json)
- [Matched Chrome trace evidence](phase5c3-d/trace-summary.json)
- [Phase 5C.3-C font optimization and failed acceptance gate](PHASE-5C3-C.md)
- [Font measurements](phase5c3-c/validation-summary.json) and
  [course CLS diagnosis](phase5c3-c/course-cls-diagnostic.json)
- [Phase 5C.3-B local fixes and current validation](PHASE-5C3-B.md)
- [Contact before/after and compact evidence](phase5c3-b/validation-summary.json)
- [Phase 5C.3-A checkpoint summary](PHASE-5C3-A.md)
- [Full archived release audit](phase5c3-a/REPORT.md)
- [Historical audit Git inventory](phase5c3-a/GIT-INVENTORY.md)
- [Dependency inventory](phase5c3-a/DEPENDENCIES.md) and
  [advisory/classification details](phase5c3-a/dependency-classification.json)
- [Stateful-history observations](phase5c3-a/stateful-history-report.json)
- [Compact performance results](phase5c3-a/performance-summary.json)
- [Audit validation summary](phase5c3-a/validation-summary.json)
- [Proposed workflow](phase5c3-a/proposed-deploy.yml): **review only**, outside
  `.github`, not activated or verified in Actions.
- [Phase 5C.2 implementation](PHASE-5C2.md),
  [renderer resolution](PHASE-5C2-RENDERER-RESOLUTION.md),
  [Phase 5C.2-F](PHASE-5C2-F.md),
  [Phase 5C.1](../experiments/bilingual-ssr/README.md).

Old absolute paths and `dist-ssr/...` evidence links in historical documents refer
to the original computer. Large builds, screenshots, traces, caches and disposable
audit checkouts are intentionally not committed. The compact findings above and
standalone reproduction below do not require those archives. Historical visual
harnesses still require their archived CSR baseline for identical comparisons;
do not claim those screenshots are recoverable from Git alone.

## Safe setup on another computer

Clone into a new directory to avoid overwriting another checkout:

```text
git clone --branch fix/seo-language-consistency https://github.com/M-Elmaghawry/ME-2026-Main.git
cd ME-2026-Main
git status
git branch --show-current
git rev-parse HEAD
git rev-parse origin/fix/seo-language-consistency
git log -3 --oneline
node --version
npm --version
npm ci --engine-strict
```

Use **Node 22.23.5/npm 10.9.9** for the Phase E/F baseline. The Node 24.19.0/npm
11.17.0 environment describes earlier phases only. Validate a clean Linux run
separately before asserting CI compatibility. Do not upgrade dependencies or
rewrite the lockfile during setup. Native sharp/SWC/esbuild optional binaries
must be available for the host platform. An installed Chrome/Edge/Chromium is
required for browser checks; `playwright-core` does not download a browser.
The standalone reproduction accepts `CHROME_PATH` or `--browser <executable>`.
Several older browser harnesses still hardcode Windows paths and historical
baseline directories; their portability has not been fixed in this checkpoint.

No local `.env` or private configuration is included in this checkpoint. If needed, configure an
ignored `.env.local` using authorized values obtained separately. Variable names:

```text
VITE_BASE_PATH
VITE_SITE_URL
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
VITE_RECAPTCHA_SITE_KEY
```

For repository hosting, the intended base is `/ME-2026-Main/` and site URL is
`https://m-elmaghawry.github.io/ME-2026-Main/`. Candidate generator arguments must
explicitly pass base/site URL when changing deployment variants; it does not
infer those CLI arguments solely from VITE variables. The build sets internal
`SSG_BASE_PATH` from its arguments. The older experiment optionally uses
`SSR_POC_BASE_PATH`. None of these names authorizes production changes.

EmailJS browser identifiers and a CAPTCHA site key are public client configuration;
do not put provider private keys/passwords in VITE variables. Real provider
authorization and hostname allowlists remain unverified. Never commit environment
files, real submissions or sensitive drafts. Tests below use synthetic data.

## Standard validation commands

Run from the repository root. `npm` may be written `npm.cmd` in PowerShell.

```text
npm run lint
npm run typecheck
npm run typecheck:ssg
npm run typecheck:poc
npm test
npm run build
npm run build:ssg-candidate -- --variant repo --base /ME-2026-Main/ --site-url https://m-elmaghawry.github.io/ME-2026-Main/
npm run build:ssg-candidate -- --variant root --base / --site-url https://example.com/
npm run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/
npm run test:ssg
npm run test:course-layout
node scripts/audit-ssg-performance.mjs --site fixed=dist-ssr/candidate/repo/site --runs 9 --assert-budget --budget-cohort fixed --output dist-ssr/recheck-performance
node scripts/test-ssg-browser.mjs --extra
npm audit --json --package-lock-only
npm audit --json --package-lock-only --omit=dev
```

`test:ssg` expects repo/root/custom outputs to exist first. Builds regenerate
ignored `public/optimized` assets from tracked originals; original images and the
tracked manifest are preserved. Candidate output is under `dist-ssr/candidate/`.
Never publish the parent directory, SSR server bundles, or diagnostic fixtures.

Phase 5C.3-B: 46 automated tests passed (27 existing + 19 candidate); lint had no
errors and 8 existing warnings. Production/candidate builds and TypeScript
passed. All 168 normal candidate HTML files plus 56 mock-fixture files passed
strict UTF-8/NUL checks. Contact history suites passed 40 cases each in Chrome,
Edge and a mocked CSR control; wider SSG interactions passed 38 cases. These are
local functional checks, not a release signoff. Historical audit/visual results
remain in their original reports.

Phase 5C.3-C: 50 automated tests pass (27 existing + 23 candidate). Builds,
TypeScript and the same lint status pass. All 224 normal/fixture HTML documents
pass integrity checks. Forty Contact history and 38 wider SSG interaction cases
pass. Twelve matched screenshot pairs have zero geometry differences and at
most 0.000556% pixel differences. Six language-switch and six mixed-script checks
pass. Its historical performance suite failed CLS ≤ 0.1 on English Workshop 03.
Phase 5C.3-D supersedes that local gate: all 18 corrected-cohort critical cases
pass, with 54 total benchmark runs across three strategies and two pages.
Twenty new course cases pass in Chrome and twenty in Edge, including an old
negative control that correctly detects the 2-to-3-row wrap. Twelve updated
normal screenshot pairs have zero changed pixels and zero geometry differences.
Eight separate reduced-motion checks pass (maximum CLS 0.020825). The 50 Node
tests, TypeScript, builds, 40 Contact and 38 wider SSG cases remain passing; all
224 generated documents pass integrity checks. This is local validation, not a
production release approval.

Phase 5C.3-E repeated the clean install, all TS checks, lint (0 errors/8 warnings),
50 Node tests, CSR build, three normal SSG variants, POC and contact-fixture builds
on Windows Node 22.23.5/npm 10.9.9. All 224 candidate/fixture HTML files had zero
NUL bytes, invalid UTF-8 or replacement characters. The 52 indexable repo URLs
plus four auxiliaries passed hydration checks; 38 interactions, 20 course-layout,
40 SSG contact-history and 40 CSR contact-history cases passed. This is Windows
evidence only. E did not repeat the historical full screenshot/CLS/LCP benchmark.
Phase F repeated the lockfile audits, verified exact emitted chunks, assessed
all 24 packages/40 advisories, and performed three bounded schema probes. It did
not install or test any proposed upgrade or repeat all E test suites.

## Portable unresolved alias reproduction

After building the repo variant, start the existing local static helper:

```text
node --input-type=module -e "import { serve } from './scripts/ssg-browser-utils.mjs'; const site = await serve('dist-ssr/candidate/repo/site', '/ME-2026-Main/', true); console.log(site.origin);"
```

It binds an ephemeral port on 127.0.0.1; stop with Ctrl+C. At the printed origin,
compare `/ME-2026-Main/about/` with `/ME-2026-Main/about/index.html`, and the
equivalent English paths under `/ME-2026-Main/en/`. Inspect browser console and
`window.__SSG_EVIDENCE__.recoverableErrors`. Phase E observed React #418/#422
mismatches on literal file aliases while canonical URLs passed. No alias fix is
included here. This helper emulates Pages locally; it does not verify live hosting.

## Portable Contact regression checks

```text
npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
node scripts/reproduce-ssg-stateful-history.mjs
npm run test:contact-history
npm run test:contact-history -- --edge
npm run test:contact-history -- --csr
```

Optionally supply `--browser <path>` or set `CHROME_PATH`. This diagnostic uses
actual mocked failed submission→retry→language switch→Back in both languages,
then successful mocked submission→Back→refresh. It blocks every external request
and stores only synthetic test data. It writes reports/screenshots beneath ignored
`dist-ssr/stateful-history-reproduction-*`. Expected exit code after Phase 5C.3-B:
**0**. Exit **1** means a regression/finding; **2** means a harness/setup error.
The new history suite additionally tests desktop/mobile, error-result history,
legacy drafts, query/hash preservation, success invalidation and storage denial.
Its `--csr` mode builds a separate mocked CSR fixture; no real email is sent.

Optional CSR control: build a root-base CSR reference into a disposable directory,
then pass its path via `--baseline <directory>`. Baseline assets must be built for
`/`; do not point it at a repository-base bundle mounted as root. The candidate-only
reproduction requires no old screenshots or archived production build.

For manual reproduction, use the local **contact-fixture** site only. Enter
synthetic valid fields, trigger its mocked failure, use Try again, switch language
and press Back. The correct locale and retry draft should remain available.
After success, Back and refresh must show empty fields. Set the fixture's local
`window.__EMAILJS_TEST__.outcome = 'success'` for its mocked success path; no such
test object exists in the normal candidate. Never publish the fixture.

## Performance interpretation

Historical Phase 5C.3-A measurements used fresh contexts, 100ms latency, 4Mbps
download, 4× CPU and normal within-load cache (`max-age=600`), with maximum
candidate CLS about **0.00135** on its sampled cases. The
cache-disabled/no-store stress profile reached **0.135876** in Workshop 03 and
demonstrates cache-policy sensitivity. Keep both findings; do not claim universal
font-swap elimination. Later phases identified and fixed the additional English
Workshop badge-wrap case and unnecessary English font hints. Keep historical
profiles distinct from the newer balanced benchmark rather than treating their
sample sets or cache policies as interchangeable.

These are local lab results, not real-user CWV or INP. Preserve Noto Sans Arabic,
Inter, approved content/design and automatic motion when evaluating font hints.

## Next development tasks and safety

1. Verify the downloaded checkpoint SHA/branch and read E/F. Do not treat this
   checkpoint or its push as security-remediation or release approval.
2. Obtain explicit approval for **Phase 5C.3-G — Compatible Dependency Remediation**:
   proposed Router DOM 6.30.6, Vite 7.3.8, PostCSS 8.5.33, TypeScript ESLint 8.73.0,
   reviewed transitive targets and one Typography parser override to 6.1.5. The
   [exact staged plan](phase5c3-f/REMEDIATION-PLAN.md) states remaining router risks,
   regression gates and separate i18next/Zod/resolver/router-major decisions.
3. Separately validate Linux/Node 22, including platform font behavior and native
   dependencies. Do not dispatch the production workflow as a disposable test runner.
4. Separately resolve/define literal index.html alias support, without folding it
   into a dependency-only update without approval.
5. Complete security remediation or explicit condition-based residual acceptance;
   then final Pages hosting/readiness verification and separate release approval.

Do not merge/push to `main`, force-push, upgrade React/dependencies, change the
active workflow, create a release PR, deploy, or fix further blockers without
approval for that scope. Current main pushes automatically trigger production deployment.
The verified rollback source is `77ba313d8617a082d349f383e876ac34013eb551`; rollback
instructions in the audit are plans only and require separate approval.

## Checkpoint deployment boundary

On 25 November 2026, a read-only GitHub API check found one active workflow,
`.github/workflows/deploy.yml`. Its push trigger selects **main only**. Although
manual dispatch is present, the `github-pages` environment has one selected branch
policy: **main**, with custom branch policies enabled. The development branch is
not permitted to deploy through this environment. No workflow or environment
policy was changed for this checkpoint. Recheck these settings before any future
release; this observation does not certify independent future changes.
