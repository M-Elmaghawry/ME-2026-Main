# Full dependency classification - Phase 5C.3-F

> Preserved for the 25 November 2026 development checkpoint. This is a historical phase report; pre-checkpoint HEAD/working-tree statements describe that audit. Current status and setup are in [DEVELOPMENT-HANDOVER.md](../DEVELOPMENT-HANDOVER.md). Production remains BLOCKED. References labeled local audit artifacts are intentionally excluded from Git; essential findings, advisory IDs, versions, commands and risks are retained here.

25 November 2026, Asia/Riyadh. **READ ONLY. Production BLOCKED. No vulnerability resolved and no residual risk accepted by this audit.**

The repeated lockfile-only npm audits used Node 22.23.5/npm 10.9.9: **24 package names (8 high, 15 moderate, 1 low), 40 unique GHSA IDs**; omit=dev reports **9 names (4 high, 5 moderate)**. Both exit 1 for findings. [Results](audit-results.json), [full audit](audit-full.json), [production graph](audit-production.json). Package rows inherit advisories; individual IDs are listed below.

Classification terms describe the reviewed architecture and inputs. **Confirmed production blocker: none demonstrated. Confirmed build/CI blocker: none demonstrated.** Requires remediation before release is a recommendation based on a material conditional exposure or a compatible available security patch, not a claim of a reproduced exploit. Documented residual risk is a **proposal requiring explicit acceptance** if remediation is deferred. Not applicable means the stated vulnerable function/condition is absent from the reviewed call path; the installed version remains affected according to the registry. Reachability assumptions must be rechecked when APIs, resources or inputs change.

| Package / installed version | Severity | Declaration / graph | Browser | Release classification | Recommended exact target / strategy |
| --- | --- | --- | --- | --- | --- |
| `@humanfs/node` 0.16.7 | moderate | transitive; transitive; dev graph | No | Not applicable, supported by evidence | Compatible lockfile refresh to 0.16.8; do not upgrade ESLint solely for this leaf. |
| `@remix-run/router` 1.23.2 | moderate | transitive; transitive; prod graph | Yes | Not applicable, supported by evidence | Via react-router-dom 6.30.6, resolve @remix-run/router exactly 1.23.4. |
| `@tailwindcss/typography` 0.5.19 | moderate | direct; devDependencies; dev graph | No | Documented residual risk with justification (proposed) | Keep 0.5.19; scoped child override to postcss-selector-parser 6.1.5, subject to CSS tests. |
| `@typescript-eslint/eslint-plugin` 8.57.2 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12. |
| `@typescript-eslint/parser` 8.57.2 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12. |
| `@typescript-eslint/type-utils` 8.57.2 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12. |
| `@typescript-eslint/typescript-estree` 8.57.2 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12. |
| `@typescript-eslint/utils` 8.57.2 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12. |
| `baseline-browser-mapping` 2.10.12 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Compatible lockfile refresh to 2.11.0. |
| `brace-expansion` 5.0.5, 1.1.13 | high | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Resolve both 1.1.21 and 5.0.12; retain ESLint minimatch 3.x while upgrading the estree family. |
| `browserslist` 4.28.1 | high | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Compatible lockfile refresh to 4.28.7, with baseline-browser-mapping >=2.11.0. |
| `esbuild` 0.27.7 | low | transitive; transitive; dev graph | No | Not applicable, supported by evidence | After Vite 7.3.8, resolve 0.28.2 within its newly allowed range; native optional packages follow. |
| `i18next` 25.10.10 | moderate | direct; dependencies; prod graph | Yes | Documented residual risk with justification (proposed) | If remediation rather than accepted residual risk is approved: i18next 26.3.4; keep react-i18next 16.6.6. |
| `js-yaml` 4.1.1 | high | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Compatible lockfile refresh to 4.3.2. |
| `minimatch` 10.2.4 | moderate | transitive; transitive; dev graph | No | Documented residual risk with justification (proposed) | Use typescript-eslint 8.73.0 to obtain supported minimatch 11.0.1; do not force 11 into old estree 8.57.2. |
| `nanoid` 3.3.11 | high | transitive; transitive; prod graph | No | Not applicable, supported by evidence | PostCSS 8.5.33 requires ^3.3.20; target locked nanoid 3.3.20. |
| `postcss` 8.5.8 | high | direct; devDependencies; prod graph | No | Requires remediation before release | Direct same-line patch target 8.5.33, with nanoid 3.3.20 and source-map-js 1.2.2. |
| `postcss-selector-parser` 6.1.2, 6.0.10 | moderate | transitive; transitive; prod graph + dev graph | No | Documented residual risk with justification (proposed) | Resolve 6.1.5 for all three installed 6.x copies; use the scoped typography override only for its exact pin. |
| `react-router` 6.30.3 | moderate | transitive; transitive; prod graph | Yes | Requires additional investigation | Compatible containment: parent react-router-dom 6.30.6 -> react-router 6.30.6; complete advisory-range remediation requires separately approved 7.18.0. |
| `react-router-dom` 6.30.3 | moderate | direct; dependencies; prod graph | Yes | Requires remediation before release | Direct compatible patch target 6.30.6; this is partial containment and leaves react-router navigation findings. |
| `source-map-js` 1.2.1 | high | transitive; transitive; prod graph | No | Documented residual risk with justification (proposed) | PostCSS 8.5.33 requires ^1.2.2; target locked source-map-js 1.2.2. |
| `typescript-eslint` 8.57.2 | moderate | direct; devDependencies; dev graph | No | Documented residual risk with justification (proposed) | Direct compatible minor target 8.73.0; keep existing ESLint 9.39.4 and TypeScript 5.9.3. |
| `vite` 7.3.2 | high | direct; devDependencies; dev graph | No | Requires remediation before release | Direct same-line patch target 7.3.8; separately verify esbuild 0.28.2 and PostCSS 8.5.33 resolution. |
| `zod` 3.25.76 | high | direct; dependencies; prod graph | Yes | Requires additional investigation | No patched 3.x candidate found. If approved: zod 4.6.6 plus @hookform/resolvers 5.2.2; keep react-hook-form 7.72.0. |

Production-graph PostCSS/Nano ID/source-map-js/selector nodes are carried by root production tailwindcss-animate -> Tailwind peer -> PostCSS, despite PostCSS being a root dev declaration. They do not ship as parser modules. No package is dismissed solely because of its dev flag. Paths below are representative root-to-node paths; the complete npm explain tree and all derived paths remain in JSON.

## @humanfs/node

Copy operations are not used by the reviewed ESLint lib call sites; conditional file disclosure if that API is introduced.

- Installed locations: `node_modules/@humanfs/node` @ 0.16.7 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Not applicable, supported by evidence**.
- Remediation: Compatible lockfile refresh to 0.16.8; do not upgrade ESLint solely for this leaf.
- Paths: `project -> eslint@9.39.4 -> @humanfs/node@0.16.7`; `project -> typescript-eslint@8.57.2 -> eslint@9.39.4 -> @humanfs/node@0.16.7`; `project -> eslint-plugin-react-hooks@5.2.0 -> eslint@9.39.4 -> @humanfs/node@0.16.7`; `project -> eslint-plugin-react-refresh@0.4.26 -> eslint@9.39.4 -> @humanfs/node@0.16.7`; `eslint@9.39.4 -> @eslint-community/eslint-utils@4.9.1 -> eslint@9.39.4 -> @humanfs/node@0.16.7` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-p498-v437-472g](https://github.com/advisories/GHSA-p498-v437-472g) / `@humanfs/node` | moderate | `<0.16.8` | `0.16.8` for `< 0.16.8` |

Phase E supporting assessment (read alongside the refined F recommendation above): ESLint installs this filesystem helper. The advisory requires copyAll() over an attacker-controlled tree containing symlinked files. No copyAll/copy call was found in the installed ESLint lib source. The browser contains no module from this package. Refresh the compatible ESLint/humanfs dependency after approval; retain symlink boundaries and least-privilege CI. This is not a demonstrated static-site attack.

## @remix-run/router

Data-router redirect is removed from emitted modules; declarative mode is explicitly excluded by the advisory.

- Installed locations: `node_modules/@remix-run/router` @ 1.23.2 (production graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: browser runtime and build-time SSR. Browser code present: yes, CSR and SSG.
- Release category: **Not applicable, supported by evidence**.
- Remediation: Via react-router-dom 6.30.6, resolve @remix-run/router exactly 1.23.4.
- Paths: `project -> react-router-dom@6.30.3 -> @remix-run/router@1.23.2`; `project -> react-router-dom@6.30.3 -> react-router@6.30.3 -> @remix-run/router@1.23.2`.
- Actual SSG modules: `@remix-run/router/dist/router.js` in `assets/index-5CrEfXqr.js`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) / `@remix-run/router` | moderate | `>=1.3.0 <1.23.3` | `1.23.3` for `>= 1.3.0, < 1.23.3` |

Phase E supporting assessment (read alongside the refined F recommendation above): The primary redirect advisory explicitly excludes declarative BrowserRouter. Both client entries use BrowserRouter; the build uses StaticRouter, not a data-router server. No loader/action redirect pipeline is deployed. Some router utilities ship, but this advisory condition is non-applicable to the current architecture. Update the router family together after approval; this disposition is not a patched-version claim.

## @tailwindcss/typography

Latest compatible 0.5.20 still pins 6.0.10. No safe parent-only patch was found.

- Installed locations: `node_modules/@tailwindcss/typography` @ 0.5.19 (development graph).
- Direct/transitive: direct; root declaration devDependencies; maximum package severity moderate.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Keep 0.5.19; scoped child override to postcss-selector-parser 6.1.5, subject to CSS tests.
- Paths: `project -> @tailwindcss/typography@0.5.19`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-w9m9-85wc-3x92](https://github.com/advisories/GHSA-w9m9-85wc-3x92) / `postcss-selector-parser` | low | `>=6.1.0 <6.1.3` | `6.1.3` for `>= 6.1.0, < 6.1.3`; `7.1.3` for `>= 7.1.0, < 7.1.3` |
| [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) / `postcss-selector-parser` | moderate | `<6.1.5` | `7.1.6` for `>= 7.0.0, < 7.1.6`; `6.1.5` for `< 6.1.5` |

Phase E supporting assessment (read alongside the refined F recommendation above): Inherited finding via postcss-selector-parser. Typography generates CSS during the build; it is absent from the browser modules. Malicious selectors/content would be a build-worker CPU/stack risk. npm proposes 0.5.4, a downgrade, as a breaking change; do not apply that automatically or assume it repairs the other nested parser copies. Review a compatible parent/leaf resolution and rebuild.

## @typescript-eslint/eslint-plugin

Inherited tool findings; trusted lint/configuration inputs limit present exposure, but hostile patterns remain a CI resource risk.

- Installed locations: `node_modules/@typescript-eslint/eslint-plugin` @ 8.57.2 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12.
- Paths: `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): Inherited via type-utils/utils/typescript-estree to minimatch/brace-expansion. No independent advisory for this wrapper. Linting untrusted patterns/source trees can consume CI resources; not browser code. Approve and test a coherent typescript-eslint ecosystem refresh. No exact safe parent version was established by this read-only audit.

## @typescript-eslint/parser

Inherited tool findings; trusted lint/configuration inputs limit present exposure, but hostile patterns remain a CI resource risk.

- Installed locations: `node_modules/@typescript-eslint/parser` @ 8.57.2 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12.
- Paths: `project -> typescript-eslint@8.57.2 -> @typescript-eslint/parser@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2 -> @typescript-eslint/parser@8.57.2`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): Inherited via typescript-estree. No independent advisory for this wrapper. Not emitted into either client. Refresh the compatible typescript-eslint family, verify leaf versions and lint behavior; do not force a major leaf override without compatibility testing.

## @typescript-eslint/type-utils

Inherited tool findings; trusted lint/configuration inputs limit present exposure, but hostile patterns remain a CI resource risk.

- Installed locations: `node_modules/@typescript-eslint/type-utils` @ 8.57.2 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12.
- Paths: `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2 -> @typescript-eslint/type-utils@8.57.2`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): Inherited via typescript-estree/utils; not shipped to browsers. Untrusted glob input can stall a lint worker. Parent upgrade choice remains for a separately approved remediation.

## @typescript-eslint/typescript-estree

Inherited tool findings; trusted lint/configuration inputs limit present exposure, but hostile patterns remain a CI resource risk.

- Installed locations: `node_modules/@typescript-eslint/typescript-estree` @ 8.57.2 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12.
- Paths: `project -> typescript-eslint@8.57.2 -> @typescript-eslint/typescript-estree@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/utils@8.57.2 -> @typescript-eslint/typescript-estree@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/parser@8.57.2 -> @typescript-eslint/typescript-estree@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2 -> @typescript-eslint/utils@8.57.2 -> @typescript-eslint/typescript-estree@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2 -> @typescript-eslint/parser@8.57.2 -> @typescript-eslint/typescript-estree@8.57.2` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): Own minimatch 10.2.4 and brace-expansion 5.0.5 copies are vulnerable; no independent estree advisory. Tool patterns and lint input are the boundary, rather than website visitor input. Update the parent ecosystem and inspect the resolved tree; merely patching the root brace-expansion leaves the nested copy affected.

## @typescript-eslint/utils

Inherited tool findings; trusted lint/configuration inputs limit present exposure, but hostile patterns remain a CI resource risk.

- Installed locations: `node_modules/@typescript-eslint/utils` @ 8.57.2 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Via typescript-eslint 8.73.0, align the family at 8.73.0, minimatch 11.0.1 and brace-expansion 5.0.12.
- Paths: `project -> typescript-eslint@8.57.2 -> @typescript-eslint/utils@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2 -> @typescript-eslint/utils@8.57.2`; `project -> typescript-eslint@8.57.2 -> @typescript-eslint/eslint-plugin@8.57.2 -> @typescript-eslint/type-utils@8.57.2 -> @typescript-eslint/utils@8.57.2`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): Inherited via typescript-estree. No independent wrapper advisory or browser module. Same parent-resolution and untrusted-pattern protections as the parser family.

## baseline-browser-mapping

Build target options are not a visitor API; invalid untrusted options would terminate the tool.

- Installed locations: `node_modules/baseline-browser-mapping` @ 2.10.12 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Compatible lockfile refresh to 2.11.0.
- Paths: `project -> autoprefixer@10.4.27 -> browserslist@4.28.1 -> baseline-browser-mapping@2.10.12`; `browserslist@4.28.1 -> update-browserslist-db@1.2.3 -> browserslist@4.28.1 -> baseline-browser-mapping@2.10.12`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) / `baseline-browser-mapping` | moderate | `>=2.0.0 <2.11.0` | `2.11.0` for `>= 2.0.0, < 2.11.0` |

Phase E supporting assessment (read alongside the refined F recommendation above): The affected API calls process.exit() for invalid/conflicting parameters. Reached as browser-target tooling rather than a page API. No visitor-controlled target-query endpoint or browser module was found. Patch in the tooling graph after approval; untrusted build configuration remains a conditional CI denial-of-service input.

## brace-expansion

Untrusted patterns can exhaust lint/build CPU/stack/memory; current patterns are repository/configuration inputs.

- Installed locations: `node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion` @ 5.0.5 (development graph); `node_modules/brace-expansion` @ 1.1.13 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity high.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Resolve both 1.1.21 and 5.0.12; retain ESLint minimatch 3.x while upgrading the estree family.
- Paths: `project -> eslint@9.39.4 -> minimatch@3.1.5 -> brace-expansion@1.1.13`; `project -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> minimatch@3.1.5 -> brace-expansion@1.1.13`; `project -> typescript-eslint@8.57.2 -> eslint@9.39.4 -> minimatch@3.1.5 -> brace-expansion@1.1.13`; `project -> eslint@9.39.4 -> @eslint/config-array@0.21.2 -> minimatch@3.1.5 -> brace-expansion@1.1.13`; `project -> eslint-plugin-react-hooks@5.2.0 -> eslint@9.39.4 -> minimatch@3.1.5 -> brace-expansion@1.1.13` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-jxxr-4gwj-5jf2](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2) / `brace-expansion` | moderate | `>=5.0.0 <5.0.6` | `5.0.6` for `>= 5.0.0, < 5.0.6` |
| [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) / `brace-expansion` | high | `<1.1.16` | `5.0.7` for `>= 3.0.0, < 5.0.7`; `1.1.16` for `< 1.1.16`; `2.1.2` for `>= 2.0.0, < 2.1.2` |
| [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) / `brace-expansion` | high | `>=3.0.0 <5.0.7` | `5.0.7` for `>= 3.0.0, < 5.0.7`; `1.1.16` for `< 1.1.16`; `2.1.2` for `>= 2.0.0, < 2.1.2` |
| [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) / `brace-expansion` | high | `<1.1.17` | `5.0.8` for `>= 4.0.0, < 5.0.8`; `3.0.3` for `>= 3.0.0, < 3.0.3`; `2.1.3` for `>= 2.0.0, < 2.1.3`; `1.1.17` for `< 1.1.17` |
| [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) / `brace-expansion` | high | `>=4.0.0 <5.0.8` | `5.0.8` for `>= 4.0.0, < 5.0.8`; `3.0.3` for `>= 3.0.0, < 3.0.3`; `2.1.3` for `>= 2.0.0, < 2.1.3`; `1.1.17` for `< 1.1.17` |
| [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) / `brace-expansion` | high | `>=4.0.0 <5.0.9` | `1.1.18` for `< 1.1.18`; `2.1.4` for `>= 2.0.0, < 2.1.4`; `3.0.6` for `>= 3.0.0, < 3.0.6`; `5.0.9` for `>= 4.0.0, < 5.0.9` |
| [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) / `brace-expansion` | high | `<1.1.18` | `1.1.18` for `< 1.1.18`; `2.1.4` for `>= 2.0.0, < 2.1.4`; `3.0.6` for `>= 3.0.0, < 3.0.6`; `5.0.9` for `>= 4.0.0, < 5.0.9` |
| [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) / `brace-expansion` | moderate | `<1.1.21` | `5.0.12` for `>= 4.0.0, < 5.0.12`; `3.0.9` for `>= 3.0.0, < 3.0.9`; `2.1.7` for `>= 2.0.0, < 2.1.7`; `1.1.21` for `< 1.1.21` |
| [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) / `brace-expansion` | moderate | `>=4.0.0 <5.0.12` | `5.0.12` for `>= 4.0.0, < 5.0.12`; `3.0.9` for `>= 3.0.0, < 3.0.9`; `2.1.7` for `>= 2.0.0, < 2.1.7`; `1.1.21` for `< 1.1.21` |
| [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) / `brace-expansion` | high | `<1.1.20` | `5.0.11` for `>= 4.0.0, < 5.0.11`; `3.0.8` for `>= 3.0.0, < 3.0.8`; `2.1.6` for `>= 2.0.0, < 2.1.6`; `1.1.20` for `< 1.1.20` |
| [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) / `brace-expansion` | high | `>=4.0.0 <5.0.11` | `5.0.11` for `>= 4.0.0, < 5.0.11`; `3.0.8` for `>= 3.0.0, < 3.0.8`; `2.1.6` for `>= 2.0.0, < 2.1.6`; `1.1.20` for `< 1.1.20` |
| [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) / `brace-expansion` | high | `<1.1.19` | `5.0.10` for `>= 4.0.0, < 5.0.10`; `3.0.7` for `>= 3.0.0, < 3.0.7`; `2.1.5` for `>= 2.0.0, < 2.1.5`; `1.1.19` for `< 1.1.19` |
| [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) / `brace-expansion` | high | `>=4.0.0 <5.0.10` | `5.0.10` for `>= 4.0.0, < 5.0.10`; `3.0.7` for `>= 3.0.0, < 3.0.7`; `2.1.5` for `>= 2.0.0, < 2.1.5`; `1.1.19` for `< 1.1.19` |

Phase E supporting assessment (read alongside the refined F recommendation above): The seven advisories cover numeric expansion limits, exponential empty groups, unbounded output/intermediates, comma recursion, nesting recursion and quadratic rewriting. Both root 1.1.13 and nested 5.0.5 require review. Patterns are build/lint inputs, not an application API. Upgrade both dependency chains; avoid running hostile resource-exhaustion proofs on the host.

## browserslist

Build queries/stats can be a malicious input boundary; no website endpoint or checked-in custom stats were found.

- Installed locations: `node_modules/browserslist` @ 4.28.1 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity high.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Compatible lockfile refresh to 4.28.7, with baseline-browser-mapping >=2.11.0.
- Paths: `project -> autoprefixer@10.4.27 -> browserslist@4.28.1`; `browserslist@4.28.1 -> update-browserslist-db@1.2.3 -> browserslist@4.28.1`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) / `browserslist` | high | `<=4.28.6` | `4.28.7` for `<= 4.28.6` |
| [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) / `browserslist` | high | `<=4.28.6` | `4.28.7` for `<= 4.28.6` |

Phase E supporting assessment (read alongside the refined F recommendation above): Distinct advisories affect unbounded query caches and normalizeStats processing of untrusted discovered/custom stats. The build uses target tooling; no dynamic target-query endpoint exists in the static website. No browser modules are emitted. Do not dismiss this as harmless: third-party stats or attacker-controlled build configuration can affect CI. Patch and rerun builds after approval.

## esbuild

The advisory concerns esbuild serve() on Windows; reviewed builds use build/transform APIs, not that server.

- Installed locations: `node_modules/esbuild` @ 0.27.7 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity low.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Not applicable, supported by evidence**.
- Remediation: After Vite 7.3.8, resolve 0.28.2 within its newly allowed range; native optional packages follow.
- Paths: `project -> vite@7.3.2 -> esbuild@0.27.7`; `project -> @vitejs/plugin-react-swc@3.11.0 -> vite@7.3.2 -> esbuild@0.27.7`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) / `esbuild` | low | `>=0.27.3 <0.28.1` | `0.28.1` for `>= 0.27.3, < 0.28.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): This current advisory concerns the Windows esbuild development server. Vite uses esbuild transform/build APIs here; no esbuild serve() endpoint is deployed or deliberately started by this audit. The package is absent from browser chunks. Update the compatible Vite/esbuild resolution after approval and avoid exposing local development servers.

## i18next

deepExtend/addResourceBundle code is present; current resources are checked in and no application mutation API or remote resource backend was found.

- Installed locations: `node_modules/i18next` @ 25.10.10 (production graph).
- Direct/transitive: direct; root declaration dependencies; maximum package severity moderate.
- Used during: browser runtime and build-time SSR. Browser code present: yes, CSR and SSG.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: If remediation rather than accepted residual risk is approved: i18next 26.3.4; keep react-i18next 16.6.6.
- Paths: `project -> i18next@25.10.10`; `project -> react-i18next@16.6.6 -> i18next@25.10.10`.
- Actual SSG modules: `i18next/dist/esm/i18next.js` in `assets/index-5CrEfXqr.js`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-6jcc-5g8w-32mx](https://github.com/advisories/GHSA-6jcc-5g8w-32mx) / `i18next` | moderate | `<26.3.4` | `26.3.4` for `< 26.3.4` |

Phase E supporting assessment (read alongside the refined F recommendation above): deepExtend via addResourceBundle(..., deep, overwrite) can mutate inherited shared built-ins using attacker-controlled resources. Current src/i18n/index.ts and createPageI18n.ts initialize checked-in resources and ar/en; no app addResourceBundle call, remote translation backend or visitor-controlled resource bundle was found. The library ships, but the advisory input is not reachable through reviewed website flows. Treat as a conditional finding, not resolved. Approve an i18next migration with translation/hydration tests or explicitly record a reviewed disposition. npm currently suggests 27.2.9; it is not the first patched version.

## js-yaml

Untrusted YAML is a tool/CI CPU risk; no visitor YAML parser is present. Flat ESLint config is JavaScript.

- Installed locations: `node_modules/js-yaml` @ 4.1.1 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity high.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Compatible lockfile refresh to 4.3.2.
- Paths: `project -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> js-yaml@4.1.1`; `project -> typescript-eslint@8.57.2 -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> js-yaml@4.1.1`; `project -> eslint-plugin-react-hooks@5.2.0 -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> js-yaml@4.1.1`; `project -> eslint-plugin-react-refresh@0.4.26 -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> js-yaml@4.1.1`; `eslint@9.39.4 -> @eslint-community/eslint-utils@4.9.1 -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> js-yaml@4.1.1` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68) / `js-yaml` | moderate | `>=4.0.0 <=4.1.1` | `4.2.0` for `>= 4.0.0, <= 4.1.1`; `3.15.0` for `< 3.15.0` |
| [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) / `js-yaml` | high | `>=4.0.0 <4.3.0` | `3.15.0` for `>= 3.0.0, < 3.15.0`; `4.3.0` for `>= 4.0.0, < 4.3.0` |
| [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) / `js-yaml` | high | `>=4.0.0 <4.3.1` | `4.3.1` for `>= 4.0.0, < 4.3.1`; `3.15.1` for `>= 3.0.0, < 3.15.1` |
| [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) / `js-yaml` | high | `>=4.0.0 <4.3.2` | `4.3.2` for `>= 4.0.0, < 4.3.2`; `3.15.2` for `>= 3.0.0, < 3.15.2` |

Phase E supporting assessment (read alongside the refined F recommendation above): Repeated aliases, merge chains, ordered maps and empty-merge bypasses can consume quadratic CPU on untrusted YAML. Installed through tooling; the project uses eslint.config.js and has no visitor YAML parser. No browser modules. Upgrade the compatible YAML/tooling graph and avoid parsing hostile third-party YAML with privileged CI.

## minimatch

The parent vendor adopted the new major; that is safer than an unsupported leaf override.

- Installed locations: `node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch` @ 10.2.4 (development graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Use typescript-eslint 8.73.0 to obtain supported minimatch 11.0.1; do not force 11 into old estree 8.57.2.
- Paths: `project -> eslint@9.39.4 -> minimatch@3.1.5`; `project -> eslint@9.39.4 -> @eslint/eslintrc@3.3.5 -> minimatch@3.1.5`; `project -> typescript-eslint@8.57.2 -> eslint@9.39.4 -> minimatch@3.1.5`; `project -> eslint@9.39.4 -> @eslint/config-array@0.21.2 -> minimatch@3.1.5`; `project -> eslint-plugin-react-hooks@5.2.0 -> eslint@9.39.4 -> minimatch@3.1.5` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): The affected estree nested copy accepts glob patterns and can amplify work across parts. No browser module or visitor glob API exists. Prefer an ecosystem parent release supporting the patched leaf; a forced leaf major override is not a verified compatible fix.

## nanoid

PostCSS uses non-secure nanoid with fixed size 6; negative/zero/huge attacker-selected sizes are not used here.

- Installed locations: `node_modules/nanoid` @ 3.3.11 (production graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity high.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Not applicable, supported by evidence**.
- Remediation: PostCSS 8.5.33 requires ^3.3.20; target locked nanoid 3.3.20.
- Paths: `project -> postcss@8.5.8 -> nanoid@3.3.11`; `project -> vite@7.3.2 -> postcss@8.5.8 -> nanoid@3.3.11`; `project -> tailwindcss@3.4.19 -> postcss@8.5.8 -> nanoid@3.3.11`; `project -> autoprefixer@10.4.27 -> postcss@8.5.8 -> nanoid@3.3.11`; `project -> tailwindcss@3.4.19 -> postcss-js@4.1.0 -> postcss@8.5.8 -> nanoid@3.3.11` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) / `nanoid` | high | `<3.3.16` | `3.3.16` for `< 3.3.16`; `5.1.16` for `>= 4.0.0, < 5.1.16` |
| [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) / `nanoid` | high | `<3.3.18` | `5.1.6` for `>= 4.0.0, < 5.1.6`; `3.3.18` for `< 3.3.18` |
| [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) / `nanoid` | high | `<3.3.12` | `3.3.12` for `< 3.3.12`; `5.1.11` for `>= 4.0.0, < 5.1.11` |

Phase E supporting assessment (read alongside the refined F recommendation above): Negative non-secure sizes, zero custom sizes, and huge sizes affecting the RNG pool are the advisory inputs. Installed PostCSS input.js calls nanoid/non-secure with fixed size 6. This reviewed call does not meet those conditions. No Nano ID module ships in either browser build. Refresh the PostCSS dependency closure after approval; do not equate npm production classification with shipped browser code.

## postcss

Local previous-map file reads are a material conditional build boundary; no visitor PostCSS service or user-CSS inline pipeline exists.

- Installed locations: `node_modules/postcss` @ 8.5.8 (production graph).
- Direct/transitive: direct; root declaration devDependencies; maximum package severity high.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Requires remediation before release**.
- Remediation: Direct same-line patch target 8.5.33, with nanoid 3.3.20 and source-map-js 1.2.2.
- Paths: `project -> postcss@8.5.8`; `project -> vite@7.3.2 -> postcss@8.5.8`; `project -> tailwindcss@3.4.19 -> postcss@8.5.8`; `project -> autoprefixer@10.4.27 -> postcss@8.5.8`; `project -> tailwindcss@3.4.19 -> postcss-js@4.1.0 -> postcss@8.5.8` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) / `postcss` | moderate | `<8.5.10` | `8.5.10` for `< 8.5.10` |
| [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) / `postcss` | high | `<=8.5.11` | `8.5.12` for `<= 8.5.11` |
| [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) / `postcss` | moderate | `<=8.5.22` | `8.5.23` for `<= 8.5.22` |
| [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) / `postcss` | high | `<=8.5.17` | `8.5.18` for `<= 8.5.17` |

Phase E supporting assessment (read alongside the refined F recommendation above): Root-declared dev dependency also appears in npm production closure through tailwindcss-animate -> peer Tailwind -> PostCSS. Source-map comments in attacker-controlled CSS may cause local file reads and error disclosures on build machines; no remote PostCSS service is deployed. The XSS advisory requires attacker-controlled CSS to be stringified into an HTML style element. Reviewed production CSS is built from repository files into external CSS assets; no visitor-supplied CSS pipeline was found. No PostCSS module is in browser chunks. Upgrade the compatible PostCSS graph after approval; restrict CI privileges and untrusted CSS inputs meanwhile.

## postcss-selector-parser

CSS selector resource exhaustion is conditional on hostile build input; no browser parser modules are emitted.

- Installed locations: `node_modules/postcss-nested/node_modules/postcss-selector-parser` @ 6.1.2 (production graph); `node_modules/postcss-selector-parser` @ 6.0.10 (development graph); `node_modules/tailwindcss/node_modules/postcss-selector-parser` @ 6.1.2 (production graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Resolve 6.1.5 for all three installed 6.x copies; use the scoped typography override only for its exact pin.
- Paths: `project -> tailwindcss@3.4.19 -> postcss-selector-parser@6.1.2`; `project -> @tailwindcss/typography@0.5.19 -> postcss-selector-parser@6.0.10`; `project -> tailwindcss@3.4.19 -> postcss-nested@6.2.0 -> postcss-selector-parser@6.1.2`; `project -> tailwindcss-animate@1.0.7 -> tailwindcss@3.4.19 -> postcss-selector-parser@6.1.2`; `project -> @tailwindcss/typography@0.5.19 -> tailwindcss@3.4.19 -> postcss-selector-parser@6.1.2` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-w9m9-85wc-3x92](https://github.com/advisories/GHSA-w9m9-85wc-3x92) / `postcss-selector-parser` | low | `>=6.1.0 <6.1.3` | `6.1.3` for `>= 6.1.0, < 6.1.3`; `7.1.3` for `>= 7.1.0, < 7.1.3` |
| [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) / `postcss-selector-parser` | moderate | `<6.1.5` | `7.1.6` for `>= 7.0.0, < 7.1.6`; `6.1.5` for `< 6.1.5` |

Phase E supporting assessment (read alongside the refined F recommendation above): Installed 6.0.10 (dev) and two 6.1.2 production-graph copies via Tailwind/postcss-nested; none is a browser module. Hostile selectors can consume CPU or stack during build processing. Update every affected chain; the typography downgrade suggested by npm is not a verified closure-wide remediation.

## react-router

Navigation APIs remain emitted and require adversarial input review. Data-router redirect/SSR error conditions are excluded, not all router functionality.

- Installed locations: `node_modules/react-router` @ 6.30.3 (production graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity moderate.
- Used during: browser runtime and build-time SSR. Browser code present: yes, CSR and SSG.
- Release category: **Requires additional investigation**.
- Remediation: Compatible containment: parent react-router-dom 6.30.6 -> react-router 6.30.6; complete advisory-range remediation requires separately approved 7.18.0.
- Paths: `project -> react-router-dom@6.30.3 -> react-router@6.30.3`.
- Actual SSG modules: `react-router/dist/index.js` in `assets/index-5CrEfXqr.js`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) / `@remix-run/router` | moderate | `>=1.3.0 <1.23.3` | `1.23.3` for `>= 1.3.0, < 1.23.3` |
| [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) / `react-router` | moderate | `>=6.0.0 <7.18.0` | `7.18.0` for `>= 6.0.0, < 7.18.0` |
| [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) / `react-router` | moderate | `>=6.4.0 <7.18.0` | `7.18.0` for `>= 6.4.0, < 7.18.0` |
| [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) / `react-router` | moderate | `>=6.7.0 <6.30.4` | `7.14.1` for `>= 7.0.0, < 7.14.1`; `6.30.4` for `>= 6.7.0, < 6.30.4` |

Phase E supporting assessment (read alongside the refined F recommendation above): BrowserRouter plus Link/useNavigate ship. The current Link targets are fixed internal routes or checked-in content IDs; language/history flows derive same-origin path/query state. No application untrusted redirect target parameter was found. localizedDestination intentionally passes external schemes through and is not a security sanitizer: do not reuse it for untrusted targets. GHSA-wrjc-x8rr-h8h6 is a conditional navigation finding requiring further adversarial input review or a tested upgrade. GHSA-2j2x-hqr9-3h42 and GHSA-337j-9hxr-rhxg explicitly exclude declarative mode. No createBrowserRouter, RouterProvider, serialized data-router SSR errors or request-time SSR server is used; those client exports are tree-shaken. React hydration alone does not make data-router SSR deserialization applicable. No production exploit was demonstrated; not a blanket false positive.

## react-router-dom

Own redirect/XSS patch is available; remaining navigation preconditions require separate disposition.

- Installed locations: `node_modules/react-router-dom` @ 6.30.3 (production graph).
- Direct/transitive: direct; root declaration dependencies; maximum package severity moderate.
- Used during: browser runtime and build-time SSR. Browser code present: yes, CSR and SSG.
- Release category: **Requires remediation before release**.
- Remediation: Direct compatible patch target 6.30.6; this is partial containment and leaves react-router navigation findings.
- Paths: `project -> react-router-dom@6.30.3`.
- Actual SSG modules: `react-router-dom/dist/index.js` in `assets/index-5CrEfXqr.js`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) / `@remix-run/router` | moderate | `>=1.3.0 <1.23.3` | `1.23.3` for `>= 1.3.0, < 1.23.3` |
| [GHSA-jjmj-jmhj-qwj2](https://github.com/advisories/GHSA-jjmj-jmhj-qwj2) / `react-router-dom` | moderate | `>=6.30.2 <=6.30.5` | `6.30.6` for `>= 6.30.2, <= 6.30.5` |
| [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) / `react-router` | moderate | `>=6.0.0 <7.18.0` | `7.18.0` for `>= 6.0.0, < 7.18.0` |
| [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) / `react-router` | moderate | `>=6.4.0 <7.18.0` | `7.18.0` for `>= 6.4.0, < 7.18.0` |
| [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) / `react-router` | moderate | `>=6.7.0 <6.30.4` | `7.14.1` for `>= 7.0.0, < 7.14.1`; `6.30.4` for `>= 6.7.0, < 6.30.4` |

Phase E supporting assessment (read alongside the refined F recommendation above): Inherited router findings plus GHSA-jjmj-jmhj-qwj2, which requires an application open redirect. No loader/action redirect handling or attacker-controlled redirect target was found in the reviewed app. Static routing and legacy restoration enforce same-origin/base boundaries in src/lib/legacy.ts; tests reject foreign and backslash targets. 6.30.6 exists and moves @remix-run/router to 1.23.4, but leaves react-router 6.30.6 within the <7.18.0 navigation and SSR-error advisory ranges. Do not describe 6.30.6 alone as a complete remediation. A separately approved v7 migration or explicit condition-based disposition is required.

## source-map-js

Malformed indexed maps can stall a build worker; no browser module is emitted.

- Installed locations: `node_modules/source-map-js` @ 1.2.1 (production graph).
- Direct/transitive: transitive; root declaration transitive; maximum package severity high.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: PostCSS 8.5.33 requires ^1.2.2; target locked source-map-js 1.2.2.
- Paths: `project -> postcss@8.5.8 -> source-map-js@1.2.1`; `project -> vite@7.3.2 -> postcss@8.5.8 -> source-map-js@1.2.1`; `project -> tailwindcss@3.4.19 -> postcss@8.5.8 -> source-map-js@1.2.1`; `project -> autoprefixer@10.4.27 -> postcss@8.5.8 -> source-map-js@1.2.1`; `project -> tailwindcss@3.4.19 -> postcss-js@4.1.0 -> postcss@8.5.8 -> source-map-js@1.2.1` (additional paths in structured evidence).

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) / `source-map-js` | high | `>=1.0.0 <1.2.2` | `1.2.2` for `>= 1.0.0, < 1.2.2` |

Phase E supporting assessment (read alongside the refined F recommendation above): Malformed indexed source-map section offsets can block the event loop. Installed PostCSS previous-map/input/map-generator use this library; processing attacker-controlled maps is a conditional build risk. No source-map-js module is in the emitted browser builds. Upgrade through the compatible PostCSS/tooling graph and validate build output after approval.

## typescript-eslint

Advisories are inherited from the estree glob graph; there is no independent umbrella-package flaw.

- Installed locations: `node_modules/typescript-eslint` @ 8.57.2 (development graph).
- Direct/transitive: direct; root declaration devDependencies; maximum package severity moderate.
- Used during: development / CI lint. Browser code present: no in either client.
- Release category: **Documented residual risk with justification** - proposed residual only; explicit acceptance required if deferred.
- Remediation: Direct compatible minor target 8.73.0; keep existing ESLint 9.39.4 and TypeScript 5.9.3.
- Paths: `project -> typescript-eslint@8.57.2`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) / `minimatch` | moderate | `>=7.0.0 <11.0.1` | `11.0.1` for `>= 7.0.0, < 11.0.1` |

Phase E supporting assessment (read alongside the refined F recommendation above): Direct development umbrella package inherits the parser/plugin/utils/estree findings. No independent advisory for the wrapper and no browser code. Refresh the family coherently after approval; exact safe parent version was not established by a lockfile-only audit.

## vite

Windows developer host and explicit :: binding meet some advisory prerequisites. Running server/editor/NTLM/input conditions were not exploited; normal static CI build does not expose dev middleware.

- Installed locations: `node_modules/vite` @ 7.3.2 (development graph).
- Direct/transitive: direct; root declaration devDependencies; maximum package severity high.
- Used during: development / build / CI. Browser code present: no in either client.
- Release category: **Requires remediation before release**.
- Remediation: Direct same-line patch target 7.3.8; separately verify esbuild 0.28.2 and PostCSS 8.5.33 resolution.
- Paths: `project -> vite@7.3.2`; `project -> @vitejs/plugin-react-swc@3.11.0 -> vite@7.3.2`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) / `vite` | moderate | `>=7.0.0 <=7.3.4` | `8.0.16` for `>= 8.0.0, <= 8.0.15`; `7.3.5` for `>= 7.0.0, <= 7.3.4`; `6.4.3` for `<= 6.4.2` |
| [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) / `vite` | moderate | `>=7.0.0 <=7.3.6` | `8.3.3` for `>= 8.3.0, <= 8.3.2`; `8.2.4` for `>= 8.2.0, <= 8.2.3`; `8.1.6` for `>= 8.0.0, <= 8.1.5`; `7.3.7` for `>= 7.0.0, <= 7.3.6`; `6.4.4` for `<= 6.4.3` |
| [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) / `vite` | moderate | `>=7.0.0 <=7.3.6` | `8.3.3` for `>= 8.3.0, <= 8.3.2`; `8.2.4` for `>= 8.2.0, <= 8.2.3`; `8.1.6` for `>= 8.0.0, <= 8.1.5`; `7.3.7` for `>= 7.0.0, <= 7.3.6`; `6.4.4` for `<= 6.4.3` |
| [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) / `vite` | high | `>=7.0.0 <=7.3.6` | `8.3.3` for `>= 8.3.0, <= 8.3.2`; `8.2.4` for `>= 8.2.0, <= 8.2.3`; `8.1.6` for `>= 8.0.0, <= 8.1.5`; `7.3.7` for `>= 7.0.0, <= 7.3.6`; `6.4.4` for `<= 6.4.3` |
| [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) / `vite` | low | `>=7.0.0 <=7.3.6` | `8.3.3` for `>= 8.3.0, <= 8.3.2`; `8.2.4` for `>= 8.2.0, <= 8.2.3`; `8.1.6` for `>= 8.0.0, <= 8.1.5`; `7.3.7` for `>= 7.0.0, <= 7.3.6`; `6.4.4` for `<= 6.4.3` |
| [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) / `vite` | moderate | `>=7.0.0 <=7.3.6` | `8.3.3` for `>= 8.3.0, <= 8.3.2`; `8.2.4` for `>= 8.2.0, <= 8.2.3`; `8.1.6` for `>= 8.0.0, <= 8.1.5`; `7.3.7` for `>= 7.0.0, <= 7.3.6`; `6.4.4` for `<= 6.4.3` |
| [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) / `vite` | moderate | `>=7.0.0 <=7.3.4` | `8.0.16` for `>= 8.0.0, <= 8.0.15`; `7.3.5` for `>= 7.0.0, <= 7.3.4`; `6.4.3` for `<= 6.4.2` |

Phase E supporting assessment (read alongside the refined F recommendation above): Advisories cover Windows UNC/NTLM disclosure, editor percent escaping, editor CLI flags, Windows path-existence bypass, custom-middleware cross-origin script loading, non-Windows fs.allow overlap, and Windows fs.deny alternate paths. Current vite.config.ts explicitly binds host :: on port 8080, meeting the network-exposure prerequisite for some advisories. Exact editor, NTLM, filesystem and imported-path preconditions were not exercised. Some hostile-site/editor conditions may still apply on loopback, so loopback is defense in depth, not a complete fix. Custom transformIndexHtml(request.url) middleware was not found; ordinary SPA mode excludes that advisory condition. npm run build is not a listening Vite dev server; no Vite module ships to visitors. Do not expose the development server or build untrusted changes with credentials. Prioritize a reviewed patch before returning to exposed development. Vite 7.3.7 permits old esbuild/PostCSS semver ranges, so parent patch alone does not prove its whole dependency closure repaired.

## zod

ZodArray code is emitted but not instantiated by the contact schema. Three bounded array injections reject with one type issue; this is not universal unreachability proof.

- Installed locations: `node_modules/zod` @ 3.25.76 (production graph).
- Direct/transitive: direct; root declaration dependencies; maximum package severity high.
- Used during: browser runtime and build-time SSR. Browser code present: yes, CSR and SSG.
- Release category: **Requires additional investigation**.
- Remediation: No patched 3.x candidate found. If approved: zod 4.6.6 plus @hookform/resolvers 5.2.2; keep react-hook-form 7.72.0.
- Paths: `project -> zod@3.25.76`.
- Actual SSG modules: `zod/v3/helpers/util.js` in `assets/Contact-BwnitDkI.js`; `zod/v3/ZodError.js` in `assets/Contact-BwnitDkI.js`; `zod/v3/locales/en.js` in `assets/Contact-BwnitDkI.js`; `zod/v3/errors.js` in `assets/Contact-BwnitDkI.js`; `zod/v3/helpers/parseUtil.js` in `assets/Contact-BwnitDkI.js`; `zod/v3/helpers/errorUtil.js` in `assets/Contact-BwnitDkI.js`; `zod/v3/types.js` in `assets/Contact-BwnitDkI.js`.

Advisory closure (inherited wrappers identify the affected leaf):

| Advisory / affected leaf | Severity | npm vulnerable range | Primary first-patched versions |
| --- | --- | --- | --- |
| [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) / `zod` | high | `<4.6.6` | `4.6.6` for `< 4.6.6` |

Phase E supporting assessment (read alongside the refined F recommendation above): The advisory describes issue accumulation for a large invalid array without a length constraint. App Zod use is src/lib/contact.ts: a fixed object of bounded strings, an enum and refinements, not a z.array schema; UI fields supply strings. No application array-schema call was found. The package ships, but the vulnerable array functionality is not reached by reviewed form flows. The primary advisory describes $ZodArray while the locked version is 3.x; confirm cross-major precision with upstream before claiming a version-based false positive. No hostile OOM test was run. Approve a major migration with contact tests or explicitly record a reviewed condition-based disposition; this audit does not mark it resolved.

## Individual advisory release disposition

Each unique advisory has its own condition-based category. Tooling residuals remain unaccepted; remedies are preferred in the staged plan. The category does not remove the finding from npm audit.

| Advisory | Category | Actual exposure / condition |
| --- | --- | --- |
| [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | Not applicable, supported by evidence | Only reviewed PostCSS call uses non-secure nanoid(6); attacker-controlled negative/zero/overflow sizes are absent from this path. No browser module. |
| [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) | Not applicable, supported by evidence | Declarative BrowserRouter explicitly excluded; no data-router redirect/error hydration call path, and related client exports/code are removed. |
| [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | Not applicable, supported by evidence | Only reviewed PostCSS call uses non-secure nanoid(6); attacker-controlled negative/zero/overflow sizes are absent from this path. No browser module. |
| [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) | Not applicable, supported by evidence | Declarative BrowserRouter explicitly excluded; no data-router redirect/error hydration call path, and related client exports/code are removed. |
| [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | Requires remediation before release | Conditional developer-server exposure; Windows host and :: configuration are real, but active editor/NTLM/malicious-file conditions were not reproduced. npm run build does not serve dev HTTP middleware. |
| [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) | Requires remediation before release | Conditional developer-server exposure; Windows host and :: configuration are real, but active editor/NTLM/malicious-file conditions were not reproduced. npm run build does not serve dev HTTP middleware. |
| [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) | Requires remediation before release | Malicious CSS source-map annotations may read host paths during build. Repository CSS is trusted today; package/dependency input is a conditional CI file boundary. |
| [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-6jcc-5g8w-32mx](https://github.com/advisories/GHSA-6jcc-5g8w-32mx) | Documented residual risk with justification (proposed) | deepExtend is present, but all reviewed resources are checked in and no untrusted addResourceBundle call/backend exists. Accept only while this input boundary is maintained. |
| [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | Not applicable, supported by evidence | Requires custom transformIndexHtml of an unchanged attacker request URL plus inline module and sensitive actions. No such listening custom middleware in current application. |
| [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) | Requires remediation before release | Conditional developer-server exposure; Windows host and :: configuration are real, but active editor/NTLM/malicious-file conditions were not reproduced. npm run build does not serve dev HTTP middleware. |
| [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | Requires remediation before release | Malicious CSS source-map annotations may read host paths during build. Repository CSS is trusted today; package/dependency input is a conditional CI file boundary. |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) | Not applicable, supported by evidence | Requires Windows esbuild serve() API. Vite uses build/transform APIs here; no esbuild dev server or browser module. |
| [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-jjmj-jmhj-qwj2](https://github.com/advisories/GHSA-jjmj-jmhj-qwj2) | Requires additional investigation | Navigation/redirect code and APIs: needs attacker-controlled destination/open redirect. No such app parameter was found; crafted input regression review is still required. |
| [GHSA-jxxr-4gwj-5jf2](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | Requires additional investigation | Array parser code remains emitted; contact schema contains no arrays. Bounded injected arrays reject before element validation. Confirm v3 advisory precision; no universal safety or false-positive claim. |
| [GHSA-p498-v437-472g](https://github.com/advisories/GHSA-p498-v437-472g) | Not applicable, supported by evidence | Requires copyAll() on a hostile symlinked source tree. No copyAll/copy call found in reviewed installed ESLint lib; no app/browser API. |
| [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) | Not applicable, supported by evidence | Requires attacker CSS stringified into an HTML style element. Current build emits external repository CSS and offers no visitor CSS input service. |
| [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | Requires remediation before release | Malicious CSS source-map annotations may read host paths during build. Repository CSS is trusted today; package/dependency input is a conditional CI file boundary. |
| [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) | Requires remediation before release | Conditional developer-server exposure; Windows host and :: configuration are real, but active editor/NTLM/malicious-file conditions were not reproduced. npm run build does not serve dev HTTP middleware. |
| [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) | Not applicable, supported by evidence | Non-Windows exposed dev server plus imported-path overlap required. Current developer host is Windows; Linux CI uses build, not an exposed Vite server. |
| [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) | Requires remediation before release | Conditional developer-server exposure; Windows host and :: configuration are real, but active editor/NTLM/malicious-file conditions were not reproduced. npm run build does not serve dev HTTP middleware. |
| [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-w9m9-85wc-3x92](https://github.com/advisories/GHSA-w9m9-85wc-3x92) | Documented residual risk with justification (proposed) | Tooling input condition; trusted build/lint configuration limits current exposure. No visitor endpoint; conditional resource risk if hostile input is introduced. |
| [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) | Requires additional investigation | Navigation/redirect code and APIs: needs attacker-controlled destination/open redirect. No such app parameter was found; crafted input regression review is still required. |
| [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) | Not applicable, supported by evidence | Only reviewed PostCSS call uses non-secure nanoid(6); attacker-controlled negative/zero/overflow sizes are absent from this path. No browser module. |

Primary GitHub records for all 40 IDs are retained under advisories/ (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/advisories`) from the immediately preceding Phase E audit. Key browser conditions were cross-checked against their current primary pages in F. All F audit IDs match that preserved set. First-patched ranges can differ by major; they are not an assertion that every package in an upgraded dependency closure will be safe. Registry candidates (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/registry-review.json`), exact target metadata (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/target-metadata.json`), previous verified leaf versions (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/phase-e-patched-versions-registry.json`), all dependency paths (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/dependency-paths.json`), structured classification (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/classification.json`), [advisory disposition](advisory-disposition.json).
