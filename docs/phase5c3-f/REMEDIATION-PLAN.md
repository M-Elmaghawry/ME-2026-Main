# Proposed staged remediation - Phase 5C.3-F

> Preserved for the 25 November 2026 development checkpoint. This is a historical phase report; pre-checkpoint HEAD/working-tree statements describe that audit. Current status and setup are in [DEVELOPMENT-HANDOVER.md](../DEVELOPMENT-HANDOVER.md). Production remains BLOCKED. References labeled local audit artifacts are intentionally excluded from Git; essential findings, advisory IDs, versions, commands and risks are retained here.

25 November 2026, Asia/Riyadh. **PLAN ONLY. No dependency/source changes made. Production remains BLOCKED.**

The first implementation should be **Phase 5C.3-G - Compatible Dependency Remediation**, subject to explicit approval. Limit it to the same-line build patches, supported TypeScript ESLint 8.x update, a single justified CSS-parser child override, and the compatible React Router 6 patch below. Do not bundle React upgrades, Vite 8, Tailwind 4, TypeScript 6/7, broad package updates, Zod 4, i18next majors, a router major, Linux setup, alias fixes, workflow changes or deployment into that first change.

Exact versions below are proposed lock targets, not versions installed or tested in F. Minimum patched versions describe the current advisory set; newer same-line patches were preferred where they strengthen leaf requirements. Peer/engine metadata is compatible with React 18.3.1, TypeScript 5.9.3, ESLint 9.39.4 and the tested Node 22.23.5. **Metadata compatibility is not regression validation.** The eventual lock diff must be reviewed; its complete package count cannot be known without the separately approved resolver run.

## Prioritized matrix

| Stage / priority | Exact proposed change and expected nodes | Findings addressed | Breakage / SSR risk | Required validation |
| --- | --- | --- | --- | --- |
| G1 / browser priority | `react-router-dom` **6.30.3 -> 6.30.6**; it pins `react-router` **6.30.6** and `@remix-run/router` **1.23.4** | Own GHSA-jjmj-jmhj-qwj2 and redirect GHSA-2j2x-hqr9-3h42; **not** all core router advisories | Low-to-moderate patch risk in redirect, URL resolution, basename and history. SSR API imports remain v6; no React/renderer replacement | All three TS scripts, routing/SEO/navigation/SSG tests, 52-page hydration, three bases, query/hash/slash, all contact history and language Back/Forward flows. Add bounded malicious-destination tests before claiming input-boundary coverage |
| G2 / developer/build priority | `vite` **7.3.2 -> 7.3.8**, `postcss` **8.5.8 -> 8.5.33**; resolve `esbuild` **0.28.2**, `nanoid` **3.3.20**, `source-map-js` **1.2.2**, including native esbuild optional packages | Seven Vite advisories; all four PostCSS advisories; esbuild GHSA-g7r4-m6w7-qqqr; all three Nano ID advisories; source-map-js GHSA-68fv-2mgg-jv7q | Moderate build risk: esbuild 0.x minor is potentially breaking; native platform binaries and CSS/map output change. Vite stays 7.x/Rollup; no Vite 8/rolldown switch. SSG server.browser import resolution and chunk graph must be checked | Clean locked install, CSR production build and all SSG variants; 224 HTML/fixture UTF-8 guards, metadata/sitemap/assets; renderer/hydration checks; CSS/screenshots/font/CLS/LCP regression when output changes. Node 22 Windows first; Linux gate separately required |
| G3 / tooling cleanup | `typescript-eslint` **8.57.2 -> 8.73.0**, align its parser/plugin/utils/type-utils/estree/project-service/types/visitor/scope family; supported `minimatch` **11.0.1** and `brace-expansion` **5.0.12**. Compatible refresh of `@humanfs/node` **0.16.8**, root `brace-expansion` **1.1.21**, `js-yaml` **4.3.2**, `browserslist` **4.28.7**, `baseline-browser-mapping` **2.11.0** | Inherited TypeScript ESLint seven rows, minimatch, both brace chains, humanfs, YAML, target-query/stats findings | Low-to-moderate lint/config/glob behavior risk. Node 22 and current TS/ESLint satisfy published peers. No browser UI dependency needs to change. New minimatch helper `@isaacs/nonrecursive-glob-match` is expected. Optional `@typescript/native` peer is not a requirement to install a new compiler | Lint every existing file, all TS scripts/tests; confirm include/exclude/source discovery remains complete. Re-audit both dependency scopes, inspect each duplicate leaf and expected new helpers; confirm browser bundles/layout unaffected by tooling-only changes |
| G4 / focused CSS exception | Retain `@tailwindcss/typography` **0.5.19**, override only its pinned `postcss-selector-parser` to **6.1.5**; update Tailwind/postcss-nested's compatible 6.x parser copies to **6.1.5** | GHSA-rj75-hqrm-r3gf and GHSA-w9m9-85wc-3x92; inherited typography finding | Moderate CSS generation risk despite staying in parser major 6: upstream pins 6.0.10 exactly, so compatibility is proposed, not guaranteed | CSR/SSG builds; compare generated selectors/prose CSS and representative approved screenshots; all course layouts and locale fonts. Reject the override if CSS/design changes unexpectedly |
| Separate translation decision | If residual not accepted: `i18next` **25.10.10 -> 26.3.4**, retain `react-i18next` **16.6.6** and React **18.3.1** | GHSA-6jcc-5g8w-32mx | Major version risk to init/options/types/key handling and translation output. react-i18next peer `>=25.10.9` accepts 26.3.4. SSR must still await initialization before rendering/hydration | Translation text/key snapshot, both locales/RTL-LTR, dates/year/SSR state, Trans markup, all-page hydration, SEO, language switch/history, screenshots and zero encoding corruption |
| Separate form decision | If residual not accepted after v3 scope confirmation: `zod` **3.25.76 -> 4.6.6** **together with** `@hookform/resolvers` **3.10.0 -> 5.2.2**; retain `react-hook-form` **7.72.0** | GHSA-mrhx-c7xc-m3w5 | Two major migrations; issue formats, schema inference and resolver error handling change. Current resolver checks `.errors`; its metadata alone does not advertise Zod version safety. Resolver 5.2.2 explicitly supports Zod 4 and requires RHF `^7.55.0`, satisfied by current 7.72.0. Do not use a Zod 3 compatibility import merely to hide migration risk | Invalid fields produce inline localized errors, no uncaught rejection; all custom messages/phone transformations, schema input/output types, synthetic valid submit, failure/retry/success, all fields invalidated after success, storage denied and language/history/refresh. No real messages |
| Separate full-router decision | If navigation residual cannot be justified/accepted: `react-router-dom` **7.18.0**, corresponding `react-router` **7.18.0**; its new dependency graph replaces `@remix-run/router` in this path | Removes current direct router advisory ranges, including GHSA-wrjc-x8rr-h8h6 and GHSA-337j-9hxr-rhxg | Major API/export/history risk; React 18 is supported. `react-router-dom/server` is absent from v7 exports, while current SSG/experiment/diagnostic entries import it. A version-only bump would break build imports. Do not pick `react-router@latest`: current registry latest 8.x requires React >=19.2.7 | First prepare explicit v7 import/API adaptation for review; all POC/SSG TS and builds, router tests, suspicious destinations, all-page hydration, contact history/BFCache, three bases, reduced motion and design checks. Static architecture can remain, but integration code must be reviewed |

G1-G4 can be implemented as small sequential review units, with a fresh lock diff and relevant checks after each. This does not authorize any commit, push, merge, source change or deployment now. A failed unit should preserve its evidence and working tree for review; do not reset/discard the user's existing B/C/D work.

## Exact resolution policy

1. Preserve a separate reviewed source snapshot; use a disposable copy for the candidate resolution. Maintain Node **22.23.5** / npm **10.9.9** for comparability, recording versions. Keep React/React DOM **18.3.1**, ESLint **9.39.4**, TypeScript **5.9.3**, Tailwind **3.4.19**, React Hook Form **7.72.0**, react-i18next **16.6.6** and existing business/design assets unchanged in G.
2. Change only the named direct dependency requirements for G: React Router DOM **6.30.6**, Vite **7.3.8**, PostCSS **8.5.33**, TypeScript ESLint **8.73.0**. Prefer explicit exact versions for this remediation checkpoint; a future range policy can be considered separately. Preserve dependencies versus devDependencies placement.
3. Resolve named transitive targets through their existing parents rather than adding them as artificial root dependencies. Inspect the lock to confirm exact reviewed versions and all nested copies. No lockfile deletion, broad `npm update`, dedupe sweep or automatic audit repair. If the resolver chooses a newer leaf than the proposed target, review its metadata/advisories and lock diff before accepting it; do not silently widen scope.
4. Vite 7.3.8 permits `esbuild: ^0.27.0 || ^0.28.0`, so it can still retain vulnerable 0.27.7 if the existing lock entry is reused. Verify **0.28.2** explicitly; do not claim the Vite patch alone repairs it. This is within the updated parent's declared range. The esbuild optional binary entries should match 0.28.2 across lockfile platforms. PostCSS 8.5.33 strengthens its requirements to Nano ID `^3.3.20` and source-map-js `^1.2.2`, removing reliance on older permissive floors in 8.5.23.
5. TypeScript ESLint **8.73.0** is the first stable same-major estree release found in current registry metadata that requires `minimatch: ^11.0.1`; that leaf requires `brace-expansion: ^5.0.12`. Align the family rather than overriding minimatch 11 into 8.57.2, which declares `^10.2.2`. Keep the independent ESLint minimatch 3.x chain; refresh its compatible brace-expansion 1.x leaf to 1.1.21. Do not apply a global minimatch or brace major override.
6. The sole proposed persistent override is the Typography child pin below. Registry metadata for both **0.5.19 and 0.5.20** pins selector parser **6.0.10**, so the available compatible parent patch does not solve this finding. A single scoped same-major parser update is narrower than replacing Typography, downgrading it to npm's proposed 0.5.4, or moving Tailwind to a new major. This still requires compatibility proof. Other parser 6.1.2 copies accept 6.1.5 through their existing `^6.1.2` ranges and should be refreshed normally.

```json
{
  "overrides": {
    "@tailwindcss/typography@0.5.19": {
      "postcss-selector-parser": "6.1.5"
    }
  }
}
```

This JSON is a **proposal artifact**, not a package.json edit. Merge with any pre-existing overrides if introduced later; none is being installed now. Limit it to the specified parent/version and remove it once that parent's supported requirements include a patched parser, after CSS comparison. npm supports child/version-scoped overrides in the root manifest ([official override documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json/#overrides)).

7. If the compatible resolver graph cannot reach a safe target without breaking peers or creating unexpected churn, stop that unit for review. Do not substitute a forced override across a declared incompatible major, an unofficial fork or an unreviewed package replacement.
8. Review the resulting manifest/lock diff for unrelated root changes, duplicate vulnerable leaves, altered registry origins, missing integrity, new lifecycle scripts and native optional packages. Expected named changes are listed above; additional TypeScript ESLint family helpers/native binary nodes are foreseeable, but no exact whole-lock diff is claimed before the approved resolver run. Keep normal integrity-checked `npm ci` reproducibility; run no `npm audit fix`, including dry-run variants, as the strategy.

## Post-remediation acceptance gates

Use actual existing package scripts in the implementation phase:

```sh
npm ci --engine-strict
npm run typecheck
npm run typecheck:ssg
npm run typecheck:poc
npm run lint
npm test
npm run build
npm run build:ssg-candidate -- --variant repo --base /ME-2026-Main/ --site-url https://m-elmaghawry.github.io/ME-2026-Main/
npm run build:ssg-candidate -- --variant root --base / --site-url https://example.com/
npm run build:ssg-candidate -- --variant custom --base /company/site/ --site-url https://custom.example/company/site/
npm run test:ssg
npm run build:ssg-candidate -- --variant contact-fixture --config ssg/diagnostics/vite.contact.config.ts
npm run test:ssg-browser -- --extra
npm run test:contact-history
npm run test:contact-history -- --csr
npm run test:course-layout
```

Then repeat `npm audit --json --package-lock-only` with and without `--omit=dev`; inspect individual advisory IDs and locked leaves, not just severity totals. Do not treat the expected remaining Zod/i18next/router conditional advisories as automatically accepted or hide them using an audit-level filter. Retain the existing strict raw-byte/NUL guards and all 52 indexable + four auxiliary HTML checks per variant. Check browser hydration and assets on every generated repo route, not only the homepage. Review module identities/versions for the five affected package names and confirm no data-router SSR error machinery was accidentally introduced.

Where CSS/chunk/font behavior changes, rerun the existing approved visual comparison and focused font/CLS/LCP diagnostics using their preserved historical baselines. These scripts require those ignored baseline artifacts and suitable browser configuration; do not fabricate a passing comparison from a missing baseline. No design, typography, business content, course/service data or animation changes should be accepted as incidental security remediation. Newly proposed malicious-URL and resolver compatibility tests must be bounded, local and block all real submissions/remote navigation.

The current F phase only repeated read-only audits, emitted-module inspection and three bounded schema checks. **None of the upgraded targets has been installed or regression-tested.** Phase E's 50 Node tests/138 selected browser cases/224 valid HTML remain baseline evidence, not test results for proposed versions.

## Security release gates and explicit residual decisions

- **No confirmed exploitable visitor or CI incident was demonstrated.** That category is not assigned merely because a high-severity package is installed. The primary blockers are unresolved security decisions around real input boundaries, not a target count of zero.
- Before release, remediate the material conditional Vite developer-server and PostCSS build-file boundaries and apply the compatible Router DOM security patch, or obtain a specifically documented owner decision to defer them. The narrow G changes are recommended over broad upgrades.
- The core navigation advisory remains after Router DOM 6.30.6. Require a targeted adversarial review and regression tests of every source of navigation targets; if an attacker-controlled path to an external navigation is found, it becomes a confirmed production blocker and must be fixed before release. If no such path is found, an explicit condition-based residual decision can defer the v7 migration. This report grants no acceptance.
- i18next residual acceptance, if chosen, must state that translation resources remain checked in, there is no untrusted deep resource merge/backend, and changes to those boundaries trigger re-review. Version presence alone is insufficient to call it resolved.
- Zod residual acceptance, if chosen, must state that the current contact object never instantiates an array schema and no untrusted collection-validation API exists. Confirm advisory precision for the shipped v3 module with upstream sources if needed. Array classes still ship. Do not call it false positive merely because its description uses v4 names.
- Any deferred tooling residual must state which inputs remain trusted, which commands/CI jobs may process them, and why developer/CI secrets cannot be exposed. Give a review owner, expiry/review event and tests. These are proposed conditions, not approvals.

**Separate unresolved items:** Node 22/Linux compatibility and literal index.html alias behavior remain outstanding. No Linux setup, alias normalization or live deployment/workflow edits are part of F or implicitly approved by this plan. Security patch validation cannot by itself clear those release gates.

## Sources and compatibility evidence

Exact published manifests/peers/engines: target-metadata.json (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/target-metadata.json`), same-major candidate search (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/registry-review.json`), previous advisory-floor verification (local audit artifact: `dist-ssr/phase5c3-f-1795610472974/phase-e-patched-versions-registry.json`). [Full classification](FULL-CLASSIFICATION.md) maps every affected package/ID/range/path and release category.

Zod 4 changes its error formats and APIs ([official migration guide](https://zod.dev/v4/changelog)); resolver 5.2.2 has distinct Zod 3/4 paths ([tagged upstream source](https://raw.githubusercontent.com/react-hook-form/resolvers/v5.2.2/zod/src/zod.ts)). React Router DOM v7 lacks a `/server` export and supports React >=18 ([tagged package metadata](https://raw.githubusercontent.com/remix-run/react-router/react-router%407.18.0/packages/react-router-dom/package.json)). These are concrete reasons to separate the major migrations from the initial compatible remediation.
