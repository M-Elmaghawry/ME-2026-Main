# Development handover — bilingual SSR checkpoint

**PRODUCTION RELEASE STATUS: BLOCKED. Development checkpoint only.**

Date: 24 November 2026, Asia/Riyadh.

- Repository: https://github.com/M-Elmaghawry/ME-2026-Main
- Development branch: `fix/seo-language-consistency`
- Latest checkpoint SHA: **PENDING_CHECKPOINT_SHA** — filled by the subsequent
  documentation-only commit; the implementation snapshot uses the approved
  `checkpoint: preserve bilingual SSR development and release blockers` message.
- Branch backup tip: `git rev-parse HEAD` after cloning this branch. It may be the
  documentation-only commit that records the checkpoint SHA above.
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

Phase 5C.3-A is a completed audit with a **BLOCKED** release conclusion. Passing
earlier checks do not override the additional stateful-history failures below.
The existing `build`/`build:gh-pages` commands and active Pages workflow still
produce the existing CSR site. No SSG deployment switch has been activated.

## Known blockers — unresolved

1. **Contact retry → language switch → browser Back** can show a blank page or
   an incorrect 404. Arabic→English→Back leaves an English/LTR document at the
   Arabic Contact URL with no main content. English→Arabic→Back leaves an
   Arabic/RTL document showing 404 at the valid English Contact URL. Refresh
   loads the correct static document. CSR controls work in both directions.
2. After a successful mocked submission in the other locale, Back and refresh
   recover the older locale's draft. The active entry is cleared; historical
   copies are not invalidated. Cleanup semantics require review.
3. English Training transfers approximately **52% more data** because universal
   preload/decode hints fetch unused Noto Arabic/Latin fonts. Measured candidate
   transfer: 570,059 bytes; production-source reconstruction: 375,324 bytes.
4. **Node 22/Linux compatibility is not verified.** Local checks used Node
   **24.19.0**, npm **11.17.0**. Locked jsdom 31.0.1 requires at least Node
   **22.22.2** within Node 22; an arbitrary older Node 22 is insufficient.
5. The dependency audit reports **24 findings** (8 high, 15 moderate, 1 low).
   Initial exposure classification is preserved; remediation/risk acceptance is
   outstanding. Five flagged packages are present in client chunks, nineteen
   are build/tooling packages. This is not a clean dependency audit.

The stateful history branch uses `history.pushState` followed by reload while
the router basename/language are fixed to the boot document. A later history URL
can therefore be interpreted by the wrong locale's router. Fixing this needs
explicitly reviewed document/history reconciliation and draft-completion rules.
Do not silently add persistent draft storage or change navigation semantics.

## Durable documentation and evidence

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
git log -2 --oneline
npm ci
```

Use Node 24.19.0/npm 11.17.0 to reproduce the tested environment. Validate Node
22.22.2+ separately before asserting CI compatibility. Do not upgrade dependencies
or rewrite the lockfile during setup. Native sharp/SWC/esbuild optional binaries
must be available for the host platform. An installed Chrome/Edge/Chromium is
required for browser checks; `playwright-core` does not download a browser.
The standalone reproduction accepts `CHROME_PATH` or `--browser <executable>`.
Several older browser harnesses still hardcode Windows paths and historical
baseline directories; their portability has not been fixed in this checkpoint.

No local `.env` or private configuration is included. If needed, configure an
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
node scripts/test-ssg-browser.mjs --extra
npm audit --json
```

`test:ssg` expects repo/root/custom outputs to exist first. Builds regenerate
ignored `public/optimized` assets from tracked originals; original images and the
tracked manifest are preserved. Candidate output is under `dist-ssr/candidate/`.
Never publish the parent directory, SSR server bundles, or diagnostic fixtures.

Most recent audit: 39 automated tests passed; lint had no errors and 8 existing
warnings; production/candidate builds and TypeScript passed. All 168 HTML files
passed strict UTF-8/NUL checks. Earlier routing/visual/interaction/mock/gallery
suites had 247 passing cases, but extended stateful Contact history fails in both
directions. Do not turn passing counts into a release signoff.

## Portable known-blocker reproduction

```text
npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
node scripts/reproduce-ssg-stateful-history.mjs
```

Optionally supply `--browser <path>` or set `CHROME_PATH`. This diagnostic uses
actual mocked failed submission→retry→language switch→Back in both languages,
then successful mocked submission→Back→refresh. It blocks every external request
and stores only synthetic test data. It writes reports/screenshots beneath ignored
`dist-ssr/stateful-history-reproduction-*`. Expected exit code while blocked: **1**
(known findings); **2** means a harness/setup error. No implementation is repaired.

Optional CSR control: build a root-base CSR reference into a disposable directory,
then pass its path via `--baseline <directory>`. Baseline assets must be built for
`/`; do not point it at a repository-base bundle mounted as root. The candidate-only
reproduction requires no old screenshots or archived production build.

For manual reproduction, use the local **contact-fixture** site only. Enter
synthetic valid fields, trigger its mocked failure, use Try again, switch language
and press Back. Refresh demonstrates document recovery. Set the fixture's local
`window.__EMAILJS_TEST__.outcome = 'success'` for its mocked success path; no such
test object exists in the normal candidate. Never publish the fixture.

## Performance interpretation

With fresh contexts, 100ms latency, 4Mbps download, 4× CPU and normal within-load
cache behavior (`max-age=600`), maximum candidate CLS was about **0.00135**. The
cache-disabled/no-store stress profile reached **0.135876** in Workshop 03 and
demonstrates cache-policy sensitivity. Keep both findings; do not claim universal
font-swap elimination. English overfetch persists under normal caching.

These are local lab results, not real-user CWV or INP. Preserve Noto Sans Arabic,
Inter, approved content/design and automatic motion when evaluating font hints.

## Next development tasks and safety

1. Obtain approval for a focused fix phase; reproduce and fix stateful locale
   Back/Forward without losing drafts or introducing unauthorized persistence.
2. Define and test completed retry/history cleanup, including old locale copies.
3. Restrict font hints to actual language/glyph needs and remeasure transfers,
   LCP/CLS, hydration and visuals.
4. Execute clean Linux/Node 22 checks and review the proposed CI/artifact cutover.
5. Finish dependency classification/remediation or explicit risk acceptance.
6. Reaudit readiness; only then request separate release approval.

Do not merge/push to `main`, force-push, upgrade React/dependencies, change the
active workflow, create a release PR, deploy, or fix blockers merely as part of
this checkpoint. Current main pushes automatically trigger production deployment.
The verified rollback source is `77ba313d8617a082d349f383e876ac34013eb551`; rollback
instructions in the audit are plans only and require separate approval.
