# Phase 5C.3-E - Compatibility and security audit

> Preserved for the 25 November 2026 development checkpoint. This is a historical phase report; pre-checkpoint HEAD/working-tree statements describe that audit. Current status and setup are in [DEVELOPMENT-HANDOVER.md](DEVELOPMENT-HANDOVER.md). Production remains BLOCKED. References labeled local audit artifacts are intentionally excluded from Git; essential findings, advisory IDs, versions, commands and risks are retained here.

25 November 2026, Asia/Riyadh. **PRODUCTION RELEASE REMAINS BLOCKED.**

The clean Node 22 verification **passed on Windows only**. Linux is **UNVERIFIED**: Docker and Podman are unavailable on PATH and their standard installation directories are absent; WSL reports that Windows Subsystem for Linux is not installed. No Linux runner was provisioned, no deployment workflow was dispatched, and this audit does not certify ubuntu-latest compatibility.

The fresh security audit remains at **24 affected package names: 8 high, 15 moderate, 1 low, no critical**. These rows contain 40 unique GHSA advisories, including inherited findings. Five affected package names have code in both browser builds; the other 19 are build/development tooling in the emitted-module inspection. No exploit against the current deployed static website was demonstrated, and no finding was repaired or marked resolved. Missing Linux evidence and the pending security remediation/risk disposition remain release gates.

## Preserved project state

- Repository: https://github.com/M-Elmaghawry/ME-2026-Main
- Branch: `fix/seo-language-consistency`.
- HEAD before/after: `de485daffaf72be29a1a2118dcc01e1aa7823755`.
- Local main before/after: `77ba313d8617a082d349f383e876ac34013eb551`.
- Initial working tree: 33 existing modified/untracked files from the approved B/C/D development. All remain present and unchanged by this audit.
- All 442 tracked/relevant untracked project files were hashed, copied into the disposable worktree and checked again at completion: **zero original-file hash changes**. The 33 dirty files were also preserved separately under `preserved/`.
- Existing Phase 5C.3-D findings and handover documentation were reviewed. Their historical CLS/LCP and visual results were not rewritten or presented as new Linux evidence.
- Original source, documentation, package manifests, lockfile and GitHub Actions were not modified. No staging, commit, push, merge, branch change, reset, dependency upgrade or deployment occurred.
- No `.env` credentials, browser profile, real contact submissions or private form drafts were copied into the disposable tree. Tests used synthetic local fixtures and blocked real submissions.
- All new audit files, logs, downloaded tools, isolated dependencies and generated sites remain under ignored `dist-ssr/phase5c3-e-1795608028380/`. The small `dist-ssr/phase5c3-e-current.json` pointer is also ignored. These reports are local artifacts, not a pushed checkpoint.

| Original file | SHA-256 before/after |
| --- | --- |
| package.json | `1eec9806aceed3c2da051ab61b02f62ea253f06be2cf4cbfc633549cdeb0f499` |
| package-lock.json | `376c7ce165c878d9b7031b47964c31d89435a7ae5a95af7db6b70f31671ca087` |
| .github/workflows/deploy.yml | `0dee2b96c4a40882742b1636cc98e129c1160a888af1627e273346f16a6d3397` |

Evidence: initial snapshot (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/snapshot.json`), completion safety verification (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/safety-verification.json`).

## Environment and clean install

| Item | Tested / observed |
| --- | --- |
| Disposable test OS | Windows, win32 x64; OS release 10.0.26300 |
| Test Node | **v22.23.5**, official portable win-x64 distribution, LTS Jod |
| Test npm | **10.9.9**, bundled with that Node distribution |
| Host installation | Node **v24.19.0**, npm **11.17.0**, unchanged |
| Linux distribution / container | None available; Linux tests not executed |
| Browser | Installed Chrome **158.0.8127.88**, headless with Chromium sandbox enabled; no new browser installed |
| Native build dependencies | Existing lockfile installed SWC 1.15.21 and sharp 0.35.5 for Windows; native Linux packages unverified |
| Install | `npm ci --engine-strict --no-audit --no-fund --registry=https://registry.npmjs.org`, exit **0**, fresh isolated node_modules/cache |

The exact current working tree, including approved uncommitted changes, was copied into `worktree/`; no existing node_modules or generated build was reused. Child PATH selected portable Node 22 first, with empty user/global npm configuration and an isolated npm cache. Application/integration environment values were not inherited. No npm install/fix/update command was run and no host Node installation was replaced.

The official archive was downloaded from [Node v22.23.5](https://nodejs.org/dist/v22.23.5/) and its SHA-256 compared with the HTTPS official SHASUMS256.txt: `4a191082e9706866830379d577d2cc8a50c776fcd9436a8d061b063ed0d9a0e3`, 35,630,346 bytes. This was checksum verification, not detached-signature verification. Release metadata (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/node22-release.json`), download/checksum evidence (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/node22-download.json`), install result (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/npm-ci-result.json`), install log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/npm-ci.log`), environment paths (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/environment.json`).

Node 22 must be a sufficiently recent patch: locked jsdom 31.0.1 declares `^22.22.2 || ^24.15.0 || >=26.0.0`; locked Vite 7.3.2 declares `^20.19.0 || >=22.12.0`. A generic claim that any Node 22 patch works would be incorrect. The tested patch passed strict engine enforcement.

## Commands and results

All following app/build/browser commands ran in the disposable copy using Node 22.23.5/npm 10.9.9. Command names come from the actual package.json. The audit-only byte/module harnesses are additional temporary diagnostics, not new package scripts.

| Command | Result / evidence |
| --- | --- |
| `npm run typecheck` | PASS; app and node configuration TypeScript checks; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/typecheck.log`) |
| `npm run typecheck:ssg` | PASS; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/typecheck-ssg.log`) |
| `npm run typecheck:poc` | PASS; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/typecheck-poc.log`) |
| `npm run lint` | PASS, 0 errors, **8 existing Fast Refresh warnings**; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/lint.log`) |
| `npm test` | PASS, **27/27**: p1 8, images 4, routing 2, SEO/navigation 13; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/test.log`) |
| `npm run build` | PASS, existing production CSR Vite build; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/build.log`) |
| `npm run build:ssg-candidate -- --variant repo --base /ME-2026-Main/ --site-url https://m-elmaghawry.github.io/ME-2026-Main/` | PASS, 56 HTML / 52 sitemap entries; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/build-ssg-repo.log`) |
| `npm run build:ssg-candidate -- --variant root --base / --site-url https://example.com/` | PASS, 56 HTML / 52 sitemap entries; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/build-ssg-root.log`) |
| `npm run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/` | PASS, 56 HTML / 52 sitemap entries; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/build-ssg-custom.log`) |
| `npm run test:ssg` | PASS, **23/23**; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/test-ssg.log`) |
| `npm run build:ssr-poc` | PASS, existing Phase 5C.1 experiment generates/validates 10 documents; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/build-ssr-poc.log`) |
| `npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts` | PASS, 56 isolated mock documents; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/build-contact-fixture.log`) |
| `npm run test:ssg-browser -- --extra` | PASS, **38/38** browser cases across repo/root/custom; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-interactions.log`), report (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/interaction-report.json`) |
| `npm run test:course-layout` | PASS, **20/20** cases, including eight font handoff widths, ten course-scope checks and two curriculum checks; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-course-layout.log`), report (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/course-layout-report.json`) |
| `npm run test:contact-history` | PASS, **40/40** SSG cases and **152 hydration/metadata checks**, zero real email requests / asset failures; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-contact-ssg.log`), report (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/contact-ssg-report.json`) |
| `npm run test:contact-history -- --csr` | PASS, **40/40** CSR cases, zero real email requests / asset failures; log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-contact-csr.log`), report (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/contact-csr-report.json`) |
| Temporary Node 22 raw-byte scan | PASS, **224/224** candidate/fixture HTML documents; result (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/integrity.json`), log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/integrity-node22.log`) |
| Temporary all-document browser sweep | PASS, **56/56** repo documents, 52 indexable plus four auxiliaries; report (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-all-documents.json`), harness (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/check-browser.mjs`), log (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-all.log`) |

Total existing Node automated tests: **50/50**. Existing selected browser suites: **138/138** cases (38 interactions + 20 layout + 40 SSG contact + 40 CSR contact), plus the separate 56-document sweep. No test was skipped within the commands above. The historical full screenshot comparisons, multi-run CLS/LCP performance benchmark, old pre-regression retry harness, renderer A/B diagnostic and POC screenshot browser matrix were not rerun. Those are separate diagnostics, some depend on ignored historical builds, and this audit makes no new visual/performance/renderer comparison claim. Their previous Phase D results remain historical evidence. No dependency refresh was performed in response to the stale caniuse-lite warning; the mixed static/dynamic SEO import warning in SSG builds is also preserved in logs.

## SSR, byte integrity and hydration

The current candidate uses React/React DOM **18.3.1**, `react-dom/server.browser`, `renderToReadableStream`, completion through `allReady`, strict UTF-8 decoding and existing permanent NUL/replacement-character guards. The audit did not replace renderers or alter the approved Noto Sans Arabic/Inter typography, content, design, animation, course, service, navigation or deployment behavior.

| Variant | Indexable | Auxiliary | Total HTML | Sitemap URLs | NUL bytes | Invalid UTF-8 | U+FFFD |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Repo `/ME-2026-Main/` | 52 | 4 | 56 | 52 | 0 | 0 | 0 |
| Root `/` | 52 | 4 | 56 | 52 | 0 | 0 | 0 |
| Custom `/company/site/` | 52 | 4 | 56 | 52 | 0 | 0 | 0 |
| Mock contact fixture | 52 | 4 | 56 | 52 | 0 | 0 | 0 |
| **Total** | **208** | **16** | **224** | **208** | **0** | **0** | **0** |

There are **52 unique indexable bilingual page URLs per deployment variant**, not 208 distinct production pages. The first three variants account for 168 HTML documents; the extra 56 are never intended for deployment. The ten POC documents are separate from the 224 candidate/fixture count.

Build-time validation checked each document's exact metadata, canonical, ar/en/x-default alternate links, Open Graph locale, JSON-LD, H1/main, locale direction, resolved Suspense content, route CSS, deploy-base asset references/existence and serialized hydration state. All four sitemaps have valid UTF-8 and 52 unique expected locations with matching language alternates; no NUL bytes were found in their raw bytes. Per-file byte offsets/results (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/integrity.json`), repo SSR report (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/ssr-repo-report.json`), root (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/ssr-root-report.json`), custom (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/ssr-custom-report.json`), mock fixture (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/ssr-contact-fixture-report.json`).

The Chrome sweep opened all 52 generated indexable URLs plus the four auxiliaries at the repository base. Final results: **zero recoverable hydration errors, bootstrap errors, page errors or missing local assets**, correct Arabic RTL/English LTR, expected metadata, preserved initial main/H1 and IDs for routes that remain on their original page. A direct thank-you visit without send state intentionally redirects to Contact after hydration; both locale cases were checked for that navigation and the resulting Contact canonical rather than requiring the original result-page DOM to remain forever. Contact fixtures separately validate result/draft/history state, including successful submission invalidation, denied storage and browser Back/Forward/refresh.

The existing 38-case interaction suite additionally covers representative direct navigation/refresh under all three bases, legacy query-language/SPA URLs, unknown-route 404 content/status in the local Pages emulator, slash normalization, language/history, mobile menu, slideshows, reduced motion, accordion and synthetic contact flow. Local tests do not verify actual GitHub Pages response headers, production provider configuration or live form delivery. External integrations/submissions were blocked; no private drafts were used.

### Preserved audit diagnostics and limits

The initial temporary sweep requested literal `/.../index.html` filenames instead of the generated trailing-slash route URLs and had 54 failed checks, including indexable-page hydration mismatches. Raw diagnostic (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-explicit-index-diagnostic.json`). Those aliases are outside the current generated URL contract; **literal index.html aliases remain unsupported in this local test and merit a separate URL-normalization/support decision if required**. No alias fix was attempted during this read-only audit.

The canonical-URL sweep then correctly exposed two inappropriate harness assertions on intentional thank-you-to-Contact navigation (diagnostic (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-result-redirect-diagnostic.json`)); a subsequent run observed one Contact canonical before its asynchronous navigation metadata update finished (diagnostic (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-post-navigation-metadata-diagnostic.json`)). The final harness waits for the documented redirect and expected canonical, while retaining all renderer/bootstrap/page/asset error assertions. It passed all 56. No app source was changed to obtain that result, and the initial failures remain available for review.

## Dependency assessment and priorities

The complete **24-package classification**, direct/transitive ancestry, production/development graph, browser emission, specific advisory preconditions, first patched versions and remediation proposals are in DEPENDENCIES.md (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/DEPENDENCIES.md`). The structured version is dependency-classification.json (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/dependency-classification.json`). All 40 primary advisory API responses and their per-major patched ranges are retained under `advisories/`; 19 targeted patched versions were confirmed to exist in the npm registry without installation.

The fresh audits used the unchanged lockfile and host Node 24.19.0/npm 11.17.0:

```sh
npm audit --json --package-lock-only --registry=https://registry.npmjs.org
npm audit --json --package-lock-only --omit=dev --registry=https://registry.npmjs.org
```

They used an ignored isolated audit cache; exit 1 in both cases denotes security findings, not a clean report. [Full audit](phase5c3-e/audit-full.json), [production-graph audit](phase5c3-e/audit-production.json).

- **Confirmed exploitable production risk:** none demonstrated in this audit. This is not proof of universal safety or a penetration test.
- **Shipped affected package names:** `@remix-run/router`, `react-router`, `react-router-dom`, `i18next`, `zod`. Code emission was measured in both current CSR and SSG client builds with Rollup module/export metadata. Library presence and vulnerable-function reachability are different questions. Evidence (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/bundle-exposure.json`).
- **Source-backed non-applicable conditions:** React Router's data-router redirect and serialized SSR-error advisories explicitly exclude declarative mode. This app uses BrowserRouter/Routes and build-time StaticRouter, with no loader/action data-router SSR server. The specific data-router client exports are removed. React DOM hydration does not itself create those vulnerable data-router conditions. [Primary redirect advisory](https://github.com/advisories/GHSA-2j2x-hqr9-3h42), [primary SSR-error advisory](https://github.com/advisories/GHSA-337j-9hxr-rhxg).
- **Conditional browser findings:** Link/useNavigate still ship; the newer navigation advisory needs attacker-controlled destinations. Reviewed targets are fixed internal routes/checked-in IDs or same-origin locale/history state; no open redirect parameter was found. i18next consumes checked-in translations, not attacker resource bundles. The contact Zod schema is a fixed object of strings/enums/refinements, with no array schema described by its current advisory. Those conditions limit exposure but do not patch the packages or grant risk acceptance. [Navigation advisory](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), [i18next](https://github.com/advisories/GHSA-6jcc-5g8w-32mx), [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
- **Material developer/build boundary:** Vite's explicit host `::` binding meets the exposure prerequisite for some dev-server advisories; exact Windows editor/NTLM/path conditions were not exploited. PostCSS can read local source-map paths from hostile CSS; glob/YAML/selector/map packages have conditional CPU/stack/memory risks when processing hostile inputs. Dev-only classification does not remove these risks. None of those 19 tooling package names has emitted browser modules, and the static deployment runs no Node/Vite server. [Vite primary advisory example](https://github.com/advisories/GHSA-v6wh-96g9-6wx3), [PostCSS primary advisory](https://github.com/advisories/GHSA-6g55-p6wh-862q).

Priorities for a separately approved remediation: first narrow developer/CI exposure and validate Vite **7.3.7**, PostCSS **8.5.23**, compatible esbuild **0.28.1** and inherited tooling fixes; then approve browser-package upgrades or a specific reviewed condition-based disposition. Router **6.30.6** fixes its own redirect/XSS advisory but is not a complete fix for all router findings; **7.18.0** covers the current direct advisory set and is a major migration. i18next **26.3.4** and Zod **4.6.6** are also major migrations from locked versions. A parent bump can retain vulnerable leaves within allowed ranges, so every proposed resolution needs a fresh audit and tests. No forced leaf override, typography downgrade, npm audit fix or React upgrade is recommended as an automatic action.

## GitHub Actions and hosting compatibility

The exact comparison, future check commands, environment variables, Pages base/canonical derivation, 404/sitemap caveats, cache behavior, artifact boundary and proposed replacement build step are in [WORKFLOW-ASSESSMENT.md](phase5c3-e/WORKFLOW-ASSESSMENT.md). Nothing was applied to the live YAML.

Current Actions uses Node 22 on ubuntu-latest but builds `npm run build:gh-pages` and uploads `./dist`, so it cannot deploy this candidate as written. After separate Linux verification and release approval, it must run the SSG generator with explicit configure-pages-derived `--base` / `--site-url`, validate the candidate, and upload **only `./dist-ssr/candidate/repo/site`**. App/config, SSG and POC TS checks plus full `npm test` and `test:ssg` should become validation gates. The current workflow misses the SEO/navigation and SSG-specific checks. Record/enforce a compatible Node 22 patch floor, keep locked clean installs and npm tarball caching, and separate untrusted validation from deployment credentials.

Required existing environment variable names, without values: `VITE_BASE_PATH`, `VITE_SITE_URL`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_RECAPTCHA_SITE_KEY`. The disposable build used explicit base/site CLI arguments and no real integration values; live production integration behavior remains unverified.

## Remaining blockers and recommendation

1. **Clean Node 22/Linux verification is still missing.** Run the unchanged reviewed source, lockfile and actual scripts in a disposable non-deploy Linux environment; record Node/npm, image/distro/architecture and native install results. The Windows Node 22 pass is useful supplemental evidence only.
2. **Security remediation/risk disposition remains unapproved and unapplied.** Prioritize actual developer/build input exposure and the shipped navigation/input conditions; do not use the raw total alone as the release decision. No finding is resolved by this report.
3. **Live workflow/hosting cutover remains unapproved and unverified.** Current production continues using the existing CSR workflow. No production Pages run was initiated by this audit; independent external activity was not monitored or certified.
4. **Noncanonical index.html alias support is an additional documented caveat.** Generated route URLs pass. Decide separately whether explicit file aliases require normalization before expanding the supported URL contract.

Recommendation: **continue local development with the candidate blocked for production**. Approve a non-deploy Linux validation path and a scoped dependency remediation/disposition plan before revisiting release readiness. Do not merge or deploy based on Windows results alone. This audit stops after validation and report delivery.

## Reproduction and evidence entry points

The command table and check-results.json (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/check-results.json`) record the actual commands. `run-checks.cjs`, `launch.cjs`, `run-browser-checks.cjs`, `scan-integrity.cjs`, `check-browser.mjs` and `inspect-bundle.mjs` are audit-only harnesses inside this ignored directory. Their environment.json paths refer to this computer's disposable copy. On another computer, start from an explicitly preserved reviewed tree, use a fresh isolated environment and lockfile install, and run the package scripts listed above; do not treat these absolute Windows paths or the remote checkpoint alone as a copy of the uncommitted B/C/D changes.

Key artifacts: safety (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/safety-verification.json`), install (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/npm-ci-result.json`), commands (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/check-results.json`), HTML/sitemap bytes (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/integrity.json`), all-page hydration (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/browser-all-documents.json`), security classification (local audit artifact: `dist-ssr/phase5c3-e-1795608028380/DEPENDENCIES.md`), [workflow proposal](phase5c3-e/WORKFLOW-ASSESSMENT.md). No tracked handover document was updated during this read-only audit.
