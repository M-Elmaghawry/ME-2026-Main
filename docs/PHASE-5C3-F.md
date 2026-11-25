# Phase 5C.3-F - Dependency security triage

> Preserved for the 25 November 2026 development checkpoint. This is a historical phase report; pre-checkpoint HEAD/working-tree statements describe that audit. Current status and setup are in [DEVELOPMENT-HANDOVER.md](DEVELOPMENT-HANDOVER.md). Production remains BLOCKED. References labeled local audit artifacts are intentionally excluded from Git; essential findings, advisory IDs, versions, commands and risks are retained here.

25 November 2026, Asia/Riyadh. **READ-ONLY AUDIT COMPLETED. PRODUCTION RELEASE REMAINS BLOCKED.**

The unchanged lockfile still reports **24 affected package names, 40 unique advisories: eight high, fifteen moderate and one low**. Five affected package names contribute browser-delivered code. No vulnerability has been patched or marked resolved, and no residual risk has been accepted by this audit. No confirmed exploitable visitor or GitHub Actions attack was demonstrated. Conditional developer/build exposure and pending browser-input decisions require action before release; the count alone is not the release decision.

Recommended next phase, subject to approval: **Phase 5C.3-G - Compatible Dependency Remediation**. The first change should use compatible router/build patches, a supported TypeScript ESLint 8.x update and one narrowly justified parser override. Keep the i18next, Zod/resolver and full-router major decisions separate. Linux compatibility and literal index.html aliases remain separate unresolved release items and were not fixed.

The full deliverables are split into:

- [FULL-CLASSIFICATION.md](phase5c3-f/FULL-CLASSIFICATION.md): all 24 packages, installed locations, direct/transitive and production/development graphs, advisory IDs/severities/ranges/patch floors, dependency paths, browser emission, execution contexts, reachability and the release disposition of all 40 advisories.
- [REMEDIATION-PLAN.md](phase5c3-f/REMEDIATION-PLAN.md): prioritized exact targets, expected package changes, the justified override proposal, breaking/SSR risks, regression gates and residual-acceptance conditions.
- This report: the five browser-package assessments, production/CI threat boundaries, evidence limits and repository-safety result.

## Repository and evidence baseline

Repository: https://github.com/M-Elmaghawry/ME-2026-Main. Active branch: `fix/seo-language-consistency`. HEAD: `de485daffaf72be29a1a2118dcc01e1aa7823755`. Local main: `77ba313d8617a082d349f383e876ac34013eb551`.

At the start, all **442** tracked/relevant untracked project files matched the Phase 5C.3-E hashes; all **33 existing modified/untracked files** were preserved in `preserved/`. The manifest, lockfile and deployment workflow were inspected. Phase E's report/classification/workflow assessment and primary advisory evidence were reviewed, with critical browser advisories cross-checked against current primary pages. Initial snapshot (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/snapshot.json`), final safety verification (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/safety-verification.json`).

No project source, dependency manifest/lockfile, installed project dependency versions, tracked documentation or GitHub Actions was changed. No install/upgrade/repair, reset, discard, stage, commit, push, merge, deployment or branch change was performed. New reports and preservation copies are in the ignored `dist-ssr/phase5c3-f-1795610472974/` audit directory with an ignored `dist-ssr/phase5c3-f-current.json` pointer; reused Phase E disposable tooling can also create ignored caches. The report is a local artifact, not a tracked or pushed handover update.

### Read-only checks performed in F

| Evidence | Result |
| --- | --- |
| Node 22.23.5 / npm 10.9.9 `npm audit --json --package-lock-only --registry=https://registry.npmjs.org` | Exit 1 for findings; 24 names / 8 high / 15 moderate / 1 low |
| Same audit with `--omit=dev` | Exit 1 for findings; 9 names / 4 high / 5 moderate |
| All 40 advisory IDs compared with preserved primary records | Same ID set; no new affected package names in repeated audit |
| `npm explain --json` for all affected names | 28 installed node records, full root-to-leaf ancestry preserved |
| Normal CSR + SSG emitted-module inspection, Vite write:false | Five affected names; all four flagged minified output chunks match the actual Phase E artifacts byte-for-byte |
| Additional formatted SSG output inspection | Navigation/resource merge/array-parser code present; data-router deserializeErrors and hydration-state code absent |
| Bounded contact-schema probe under Node 22 | Three synthetic 128-element array injections rejected with one type issue each; schema types are object/string/enum/effects, no ZodArray |
| Read-only registry metadata | Exact patch/minor/major target availability, dependency ranges, peers, engines and exports checked; no candidate installed |

The existing Phase E disposable source/dependency copy was used for emitted-module and schema inspection after confirming the original project hashes still matched. All Vite output was generated in memory with write:false; new evidence was saved only to F. A formatted in-memory build supplies readable library excerpts, while normal minified output provides byte identity with the real artifacts. Module inspection uses the current locked dependencies, not any proposed targets.

The temporary schema probe initially omitted dependency-scan isolation and Vite attempted to scan generated HTML. Its scan errors were a harness configuration issue, not a valid app failure result. The final probe uses the same noDiscovery/include settings as the existing tests, disables HMR/WebSocket startup and passes with empty stderr. It creates no HTTP listener and sends no form or external request. No CPU/OOM, credential capture, command execution, arbitrary-file-read or external-navigation exploit was attempted.

Phase E's 50 automated tests, 138 selected browser cases and 224 byte-valid documents remain the existing-version baseline. **Those complete suites were not repeated in F, and no proposed upgrade has been tested.** F's new checks are the audit/module/schema/metadata evidence above. Linux was not provisioned; no browser or package dependency was installed during F.

## Five browser-delivered package assessments

Actual SSG main chunk: **`assets/index-5CrEfXqr.js`**, SHA-256 `19b680de63d44b1edbbe2b948052642dcc55e38c9785125c2b840b6e6eb7195b`.

Actual SSG Contact chunk: **`assets/Contact-BwnitDkI.js`**, SHA-256 `d3854e947961f4f744bc7d82685d73e16bd2c267405d17835c35a3c06b94d1ed`.

The CSR equivalents are `assets/index-Es4quplN.js` and `assets/Contact-ibole5n1.js`; all four hashes match the Phase E files. Full modules/exports, chunk hashes and readable function excerpts: bundle-review.json (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/bundle-review.json`). Package presence is not proof of vulnerable-function reachability, and tree-shaking of one feature does not make the entire package safe.

### 1. @remix-run/router 1.23.2

**Actual module:** `@remix-run/router/dist/router.js` in the SSG main chunk. Emitted exports include createBrowserHistory, parse/resolve/match paths and route-error predicates. `redirect`, `redirectDocument`, `createRouter`, `createStaticHandler` and related data-routing exports are removed in both clients.

**Advisory:** [GHSA-2j2x-hqr9-3h42 / CVE-2026-40181](https://github.com/advisories/GHSA-2j2x-hqr9-3h42), moderate, `>=1.3.0 <1.23.3`. It concerns a data-router redirect accepting a path that can become an external location; the primary advisory explicitly excludes declarative BrowserRouter.

**Actual use / visitor impact:** Both client entries use BrowserRouter/Routes; the static build uses StaticRouter. No loader/action redirect service is deployed. The affected redirect API is removed from emitted clients. This specific advisory condition is **not applicable to the reviewed architecture**, supported by the primary mode exclusion and emitted exports. The installed version is still vulnerable by range; that does not resolve the separate React Router navigation advisory.

**Smallest compatible remedy:** update the direct parent React Router DOM to **6.30.6**, which pins this leaf to **1.23.4** (beyond the advisory's 1.23.3 floor), and React Router to 6.30.6. Do not override a router family's tightly pinned leaf alone. Patch-level URL/history regression risk remains; the SSR architecture need not change for this update.

### 2. react-router 6.30.3

**Actual module:** `react-router/dist/index.js` in the SSG main chunk. useNavigate/useNavigateUnstable, Routes, Router, Navigate and path resolution remain. Data-router provider/loader/action APIs are removed. Some generic data contexts/error rendering remain for normal routing; that is not proof that serialized SSR data-router errors are consumed.

**Advisories:** [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), moderate, `>=6 <7.18.0`, concerns attacker-controlled navigation destinations; [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg), moderate, `>=6.4 <7.18.0`, concerns constructor selection while deserializing SSR errors; and the data-router redirect advisory above (`>=6.7 <6.30.4`).

**Actual use / visitor impact:** Navigation is used, so the navigation advisory cannot be dismissed based on declarative mode. Reviewed Link and navigation call sites use fixed app routes or checked-in course/service/project IDs. The locale switch composes a validated base, current same-origin pathname, encoded query and fragment; draft/result state does not supply a destination. No returnTo/next/redirect parameter is used as an application destination. `localizedDestination` intentionally passes external schemes through and is **not** a security sanitizer; a future untrusted caller would change this assessment. Crafted input review remains required; no current visitor exploit was demonstrated. An exploitable destination path could send visitors externally, including to phishing content; XSS is not asserted from this advisory alone.

The SSR constructor advisory explicitly excludes declarative mode and requires very specific attacker-overwritten SSR error data. Neither `deserializeErrors` nor `__staticRouterHydrationData` exists in the measured clients. There is no data-router server/error payload, and the deployed artifact is static. React DOM hydrateRoot by itself does not activate that feature. This specific condition is not applicable. Data-router redirect is likewise excluded.

**Smallest compatible remedy / breaking risk:** parent **6.30.6** is low-risk containment for the redirect issue but remains inside the two `<7.18.0` advisory ranges. The smallest identified version covering all current direct router advisory ranges is **7.18.0**, a separate major migration. React 18 remains supported, but current `react-router-dom/server` imports in the SSG, experiment and diagnostics are absent from v7's exports. A version-only v7 bump would break those imports. Retain v6 for the initial compatible patch only if the remaining navigation risk receives explicit review/disposition before release; no acceptance is granted here.

### 3. react-router-dom 6.30.3

**Actual module:** `react-router-dom/dist/index.js` in the SSG main chunk. BrowserRouter, Link/LinkWithRef and useLinkClickHandler are emitted; createBrowserRouter/RouterProvider and their serialized error hydration machinery are removed. The library's absolute-URL recognition and Link navigation remain relevant code.

**Advisory:** its own [GHSA-jjmj-jmhj-qwj2](https://github.com/advisories/GHSA-jjmj-jmhj-qwj2), moderate, `>=6.30.2 <=6.30.5`, plus inherited core-router findings. The advisory requires an application open redirect and describes external navigation or XSS vectors under that condition.

**Actual use / visitor impact:** No open-redirect application endpoint or attacker-controlled Link destination was found in reviewed source. Legacy SPA recovery uses a separate `window.location.replace` path guarded by same-origin/base checks and rejects backslashes; this is not a React Router redirect service. Existing routing tests cover rejected legacy targets. That evidence limits the currently identified path but is not proof that every malformed navigation form is safe. Potential visitor impact under the advisory condition includes external navigation and XSS; it was not reproduced here.

**Smallest compatible remedy:** **6.30.6** directly patches its own advisory without a React or SSR import change and is recommended for the first implementation. It pins core 6.30.6 and remix router 1.23.4. This **does not** eliminate all inherited advisory rows; particularly the core navigation finding remains. Full-family **7.18.0** is a separate option, not an automatic recommendation to install latest. Current `react-router@latest` metadata points to 8.x requiring React >=19.2.7 and is outside the approved React 18 architecture.

### 4. i18next 25.10.10

**Actual module:** `i18next/dist/esm/i18next.js` in the SSG main chunk. The instance/resource store and `deepExtend` code are retained; `addResourceBundle` is present. The formatter excerpt confirms prototype-chain membership (`prop in target`) in the affected recursive function. This feature was **not** tree-shaken away.

**Advisory:** [GHSA-6jcc-5g8w-32mx](https://github.com/advisories/GHSA-6jcc-5g8w-32mx), moderate, `<26.3.4`, involving deep resource merges into inherited shared built-ins. An attacker-controlled nested bundle can corrupt a shared built-in and disrupt the page/process.

**Actual use / visitor impact:** `src/i18n/index.ts` and createPageI18n initialize checked-in resources for ar/en. No app addResourceBundle call, external translation backend or visitor-supplied resource structure was found. Language switching selects a locale; it does not convert query/form content into translation objects. Function code ships, but the required untrusted data path was not found. If that boundary changed, page-wide denial of service becomes relevant. This is a **proposed documented residual**, not a non-exploitability claim or accepted exception.

**Smallest identified fixed version / breaking risk:** **26.3.4**; registry metadata found no patched 25.x release. This is a major update. Existing react-i18next 16.6.6 accepts i18next >=25.10.9 and current TypeScript satisfies peers, so there is no metadata reason to upgrade React or react-i18next simultaneously. Initialization/options/types, translation/Trans output and hydration need regression proof. Keep it separate from the first build/patch unit; if deferred, require explicit acceptance while resources remain trusted and local.

### 5. zod 3.25.76

**Actual modules:** Zod v3 types.js, ZodError.js, helpers and locale in the SSG Contact chunk. The `ZodArray` class remains emitted even though the `array` factory export is removed. It would be inaccurate to say array parsing is absent from delivered code.

**Advisory:** [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), high, `<4.6.6`. It describes resource exhaustion through large invalid collection validation. Its summary and description use different constraint wording; the description names a v4 array implementation while the shipped module is v3. This warrants precision review, not an automatic false-positive or safe-v3 conclusion. The published range includes the installed version.

**Actual use / visitor impact:** The only application Zod schema is `src/lib/contact.ts`: an object of string, enum and effect/refinement fields, used by ContactForm's resolver. The schema has no array node. Bounded probes supplying a 128-element top-level array or an array in name/message each returned a single invalid_type issue, rather than iterating a ZodArray element schema. Probe (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/bounded-schema-review.json`). No untrusted collection-validation endpoint/server is deployed. Thus no current visitor-to-array-parser path was established; a hypothetical large-array validator could consume that visitor tab's memory, and a build/SSR process if future untrusted build inputs reached it. No OOM proof was run and universal unreachability is not claimed.

**Smallest identified fixed version / breaking risk:** **4.6.6**, with no patched 3.x candidate found. This cannot safely be treated as a one-package bump: installed `@hookform/resolvers` 3.10.0 recognizes `.errors`, while Zod 4 changes error formats. A compatible proposed pair is **Zod 4.6.6 + resolver 5.2.2**; the latter explicitly handles Zod 4 in [tagged upstream source](https://raw.githubusercontent.com/react-hook-form/resolvers/v5.2.2/zod/src/zod.ts) and accepts existing React Hook Form 7.72.0 (`^7.55.0`). Both upgrades are major changes and need invalid-field/inline-message/parse rejection/type/transform and all contact lifecycle tests. Switching to `zod/v3` inside a newer package would not demonstrate that the originally affected function was repaired. Keep this a separate implementation/disposition decision.

## Production, development, build and CI boundaries

The website deploys static HTML/assets and browser React. It does not run PostCSS, YAML/glob parsers, a Node SSR request server, Vite middleware or esbuild serve for visitors. Nineteen affected package names have no emitted modules in either measured client. This does not make their developer/CI functions harmless.

**Vite:** the current project config sets host `::`, port 8080. On the Windows developer machine that meets the network-binding prerequisite for some advisories, although an active malicious request, editor setup, NTLM policy and filesystem preconditions were not tested. The affected set includes UNC credential disclosure, editor command/argument paths, Windows deny bypass and custom-middleware/non-Windows path scenarios. Two latter conditions are specifically absent in the reviewed execution profile; the remaining conditional developer risks justify prioritizing the compatible patch. Loopback reduces exposure but does not fully address hostile-site/editor conditions. The Actions job runs Vite build, not an exposed development server; it is not a confirmed Vite HTTP exploit surface.

**PostCSS / maps / selectors:** actual build-time CSS handling can consume sourceMappingURL annotations and prior maps. Malicious CSS could cross the CI filesystem boundary or cause resource exhaustion. Current CSS is repository-authored, and generated output is external CSS rather than a user-CSS-to-inline-style endpoint. The inline-XSS advisory condition is absent; local-file/map input concerns remain conditional build risks. CSS contributed through a dependency or untrusted change is a build input, not browser runtime parser execution. PostCSS's root dev declaration is not sufficient evidence to dismiss it.

**Lint, glob, YAML and browser targets:** parsing hostile globs, brace patterns, YAML, selector trees, stats or indexed maps can consume CPU/stack/memory or terminate a tool. Current inputs are tracked source/configuration, not public website APIs. Their release dispositions are proposed conditional residuals or specific absent-API conditions, documented per advisory. The recommended compatible updates reduce these exposures with limited browser risk; if any is deferred, its input/privilege assumptions require explicit acceptance.

**Package installation:** the lockfile contains **481 package nodes**, all resolved from registry.npmjs.org with integrity fields present. Three nodes are marked hasInstallScript: **@swc/core 1.15.21**, **esbuild 0.27.7**, and optional **fsevents 2.3.3**. That is installation execution surface, not evidence these packages are malicious or three additional vulnerabilities. `npm ci` is frozen resolution, not a security sandbox; lifecycle scripts and subsequent build/config/plugin code can execute with runner access. Integrity protects consistency with the lockfile, not maintainer trust or absence of malicious code. A blanket ignore-scripts change may break native tooling and was not proposed as an untested drop-in fix. Installation inventory (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/installation-surface.json`), [npm ci behavior](https://docs.npmjs.com/cli/v10/commands/npm-ci/).

**Current Actions:** deploy.yml triggers on main pushes and manual dispatch, checks out with default credential persistence, and grants pages:write/id-token:write at workflow scope before install/build. It has no PR trigger in this file, so the reviewed workflow is not a public pull-request build endpoint. Nevertheless a compromised dependency/build script or an untrusted manually selected ref could run in a broader credential context than necessary. No exploit or environment-approval bypass was demonstrated. Recommended separate hardening is build-only contents:read, deployment-only Pages/OIDC permissions, checkout persist-credentials:false, trusted main ref/environment guards and reviewed action SHA pinning. No live YAML was edited or dispatched. GitHub recommends minimal token permissions and job-level elevation in its [secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use).

Secrets/production values were not read or copied. Current VITE integration identifiers are browser-facing configuration, not a reason to introduce provider server secrets into a client bundle. The audit does not verify a remote runner's actual token policies, environment protection, host firewall, NTLM policy or independent production activity.

## Release decisions and unresolved items

The [40-ID disposition matrix](phase5c3-f/FULL-CLASSIFICATION.md#individual-advisory-release-disposition) uses the requested categories. In this reviewed snapshot:

- **Confirmed production blocker:** none demonstrated by a reproducer against an actual visitor input path.
- **Confirmed build/CI blocker:** none demonstrated by a reproducer in the actual Actions execution profile.
- **Requires remediation before release:** material conditional Vite/PostCSS developer/build boundaries and the compatible available Router DOM patch are prioritized; they do not imply that all high findings are remotely exploitable.
- **Requires additional investigation:** navigation/open-redirect target paths and Zod v3/advisory precision. If an exploitable current path is confirmed, treat it as a blocker and remediate before release.
- **Documented residual risk with justification:** proposed trusted-resource/schema/tool-input conditions. These remain **unaccepted**; owner approval is needed if remediation is deferred.
- **Not applicable, supported by evidence:** individual data-router, esbuild-server, fixed Nano ID size, recursive-copy or inline-CSS/custom-middleware conditions absent from the reviewed call path. This classification neither patches the affected versions nor covers a different use of those APIs.

Before release, resolve the material exposures and navigation investigation or obtain a specific reviewed disposition for each deferred condition. Every acceptance should identify an owner, scope, expiry/re-review trigger and regression evidence. No acceptance or release approval is granted here. The detailed plan shows how to reduce risk without requiring all major migrations at once; it also states which advisories will remain after the initial compatible patch.

**Linux/Node 22 remains unverified.** Windows Node 22.23.5 success from E does not prove Linux native packages, case-sensitive paths or GitHub Actions execution. No Linux fix/setup/test was attempted in F.

**Literal index.html aliases remain outstanding.** Canonical generated route URLs passed E's browser sweep; literal file aliases produced route/hydration mismatches. No alias normalization was attempted, and this item is independent of dependency security.

The SSR candidate remains **BLOCKED for production**. Stop here for approval of the scoped compatible remediation plan. Do not infer permission for dependency changes, source adaptation, major upgrades, workflow cutover or deployment from this audit.

## Evidence index

[Full package/ID classification](phase5c3-f/FULL-CLASSIFICATION.md) · [Staged exact remediation plan](phase5c3-f/REMEDIATION-PLAN.md) · Structured classification (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/classification.json`) · [Individual advisory dispositions](phase5c3-f/advisory-disposition.json) · [Fresh audit results](phase5c3-f/audit-results.json) · [Full npm audit](phase5c3-f/audit-full.json) · [Production-graph audit](phase5c3-f/audit-production.json) · All dependency paths (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/dependency-paths.json`) · Actual bundle modules/hashes (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/bundle-review.json`) · Bounded schema check (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/bounded-schema-review.json`) · Exact proposed manifests (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/target-metadata.json`) · Compatible version search (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/registry-review.json`) · Primary advisory records (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/advisories`) · Final state verification (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/safety-verification.json`).
