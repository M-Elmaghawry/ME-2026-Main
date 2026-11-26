# Phase 5C.3-G4.1 — Safe npm override correction

26 November 2026, Asia/Riyadh. **Production remains BLOCKED.**
**Scoped G4.1 correction and Typography-path remediation pass local validation;
recommended for review. Global parser findings remain unresolved.**

## Repository and preservation

Authorized Git root: `G:\ME-Website\ME-2026-Main\ME-2026-Main`.
Branch: `fix/seo-language-consistency`. Starting/ending HEAD remains
`eafb491eb754dee9ba5bb4ea0d42a0e174248455`; all work is uncommitted.
Node **22.23.5 / npm 10.9.9** were used. The outer independent clone remains on
main at `77ba313d8617a082d349f383e876ac34013eb551`.

The failed G4 report, manifest, lockfile, entire working tree and remediation
plan were reviewed. Ignored `dist-ssr/phase5c3-g4-1/baseline/` preserves the
starting manifest/lock/configs, accepted G3 CSR/SSG output and **464 project-file
hashes**. No prior G1–G3 source, test, dependency versions or reports were discarded.
There were no unrelated override entries to preserve.

## EOVERRIDE cause and safe configuration correction

G4 used `@tailwindcss/typography@0.5.19` as the parent override key, while the
direct dependency declares `^0.5.16`. npm treated that version-qualified key as
an implicit parent-spec override; the direct dependency specs differed, even
though the installed version was 0.5.19.

The invalid entry alone was removed. `npm ls postcss-selector-parser --all`
returned 0, and the resulting dependency manifest compared equal to the preserved
valid G3 manifest. No whole-file reset or loss of prior manifest edits occurred.
A consistent manifest snapshot was saved for cleanup if the retry failed.

The retry was checked against the current official
[npm 10 overrides documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json/#overrides):
nested keys can constrain a dependency under a named parent; changing a direct
dependency's own spec has a separate exact-spec restriction. The child-only form
does not supply a new parent version. Final syntax:

```json
{
  "overrides": {
    "@tailwindcss/typography": {
      "postcss-selector-parser": "6.1.5"
    }
  }
}
```

The root Typography requirement remains **`^0.5.16`**, installed Typography
remains **0.5.19**, and Tailwind remains **3.4.19**. No `.` parent replacement,
global parser override, `--force`, `--legacy-peer-deps`, audit repair or styling
migration was used. npm resolution and strict clean installation both succeed;
the failed key is absent and the manifest no longer has the G4 EOVERRIDE blocker.

## Verified paths and parser versions

| Path / physical parser | Before | After | Treatment |
| --- | --- | --- | --- |
| Typography 0.5.19 -> `node_modules/postcss-selector-parser` | 6.0.10 | **6.1.5** | Scoped child override |
| Tailwind 3.4.19 -> `node_modules/tailwindcss/node_modules/postcss-selector-parser` | 6.1.2 | **6.1.2** | Preserved |
| Tailwind -> postcss-nested 6.2.0 -> `node_modules/postcss-nested/node_modules/postcss-selector-parser` | 6.1.2 | **6.1.2** | Preserved |

Fresh registry metadata confirms 6.1.5 is published, with Node **>=4** and the
same helper requirements (`cssesc ^3.0.0`, `util-deprecate ^1.0.2`). The installed
parent's exact 6.0.10 pin necessitates the exception. G4's verified current parent
patch 0.5.20 also retains that pin; no parent upgrade was made.

The intended 6.0.10 copy is affected by **GHSA-rj75-hqrm-r3gf** (`<6.1.5`);
6.1.5 is outside that range. **GHSA-w9m9-85wc-3x92** affects `>=6.1.0 <6.1.3`,
so it affects the two 6.1.2 copies but not the old 6.0.10 copy. Both advisories
remain elsewhere in the graph after this intentionally narrow retry.

Unlike the broader historical plan, this retry does **not** refresh the other
parser instances: preserving them was possible, and the latest authorization
requires that restraint. Their compatible-range cleanup needs separate scope;
they do not require another override. Revisit/remove this exception when the
Typography parent publishes supported patched requirements or its version changes.

## Lock consistency and reproducibility

Only normal npm commands generated the lock:

```text
npm install --package-lock-only --ignore-scripts --engine-strict --registry=https://registry.npmjs.org
npm ci --engine-strict
npm ls postcss-selector-parser --all
npm ls --all --json
```

The parser root entry changes **6.0.10 -> 6.1.5**, with npm-generated tarball URL
and integrity. No other dependency version, package name, parent requirement,
engine, peer or lifecycle script changes. The existing scoped and nested parser
instances remain distinct and satisfy their expected paths. The installed
parser tree and full dependency tree both exit **0**. Clean install succeeds
with **398 packages added / 399 audited**.

**Automatic npm 10 metadata normalization:** the CLI also drops `libc` fields
from 16 existing optional Linux sharp/libvips lock records. Their versions,
integrities, OS/CPU declarations and other fields are unchanged. These are
reported explicitly, not concealed as parser-only lock bytes. There are 17
changed lock records, with **466 records fully unchanged** and no added/removed
package names. **No manual package-lock edits or forced resolution were used.**
The original lock remains preserved in the baseline. Windows strict installation
does not certify the Linux optional-package selection implications; that must
be checked with the existing open Linux gate, not accepted automatically.

## Security audit comparison

Fresh full audits before and after use
`npm audit --json --package-lock-only --registry=https://registry.npmjs.org`.
The after omit=dev audit is also captured. The before IDs match G3 exactly.

| Measure | Before | After |
| --- | --- | --- |
| Unique advisory IDs | 20 | **20** |
| Affected package names | 11 | **10** |
| Maximum package-severity totals | 4 high / 7 moderate | **4 high / 6 moderate** |
| Newly introduced IDs | — | **0** |
| Globally removed IDs | — | **0** |
| After omit=dev | — | **5 names: 1 high / 4 moderate** |

**Path-specific remediation succeeds:** the Typography parser is now 6.1.5,
the root parser node is absent from the audit's vulnerable locations, and the
Typography affected-package row disappears. **This is not global parser
remediation:** Tailwind and postcss-nested still use affected 6.1.2 copies, so
GHSA-rj75-hqrm-r3gf and GHSA-w9m9-85wc-3x92 remain global findings. No claim of
two globally resolved IDs, zero parser risk, or accepted residual risk is made.

Remaining unique IDs (same set as G3, so all previously resolved G1/G2/G3 IDs
remain absent):

```text
GHSA-2883-xcg3-v3hh  GHSA-337j-9hxr-rhxg  GHSA-3jxr-9vmj-r5cp
GHSA-52cp-r559-cp3m  GHSA-5p4m-2wfm-xmqj  GHSA-6j4f-fj2g-mc7p
GHSA-6jcc-5g8w-32mx  GHSA-73wf-gq98-2v4g  GHSA-c83g-rgw3-j3cx
GHSA-h67p-54hq-rp68  GHSA-mh99-v99m-4gvg  GHSA-mrhx-c7xc-m3w5
GHSA-p498-v437-472g  GHSA-q2hr-2g5m-vwhr  GHSA-qhr7-859c-m2p7
GHSA-rgw5-rvv9-x895  GHSA-rj75-hqrm-r3gf  GHSA-w5vr-8v7q-w6rv
GHSA-w9m9-85wc-3x92  GHSA-wrjc-x8rr-h8h6
```

Browser-affected names remain **i18next, react-router, react-router-dom, zod**.
Remaining build/CI/tooling names are **@humanfs/node, baseline-browser-mapping,
brace-expansion, browserslist, js-yaml, postcss-selector-parser**. The selector
parser is build-time code, not a browser module. Trusted current inputs and the
unused application Typography plugin do not automatically accept remaining risks.

## CSS, builds and HTML integrity

Application Tailwind registers tailwindcss-animate, **not Typography**, and has
no current prose-class consumers. Therefore a normal application build alone
would not exercise the overridden plugin. An isolated ignored fixture explicitly
activates Typography, including prose headings/links/lists/tables/code, not-prose,
inverted styling, responsive sizes and Arabic/English content. Before and after:

- **57,371 CSS bytes**, 265 top-level AST nodes.
- SHA-256 **9116c2403581b1185627ab7f850be6496a84f93214002d2c09e7c35d6fabfd60**.
- **Exactly byte-identical** output, with no application config edits.

All required technical checks pass:

| Check | Result |
| --- | --- |
| Three existing TypeScript scripts | Pass |
| npm run lint | Pass: 0 errors / 8 existing warnings |
| npm test | 27 pass |
| npm run test:ssg | 26 pass |
| npm run build | Existing CSR production build passes |
| Repo/root/custom SSG builds | 56 documents / 52 sitemap URLs each |
| Mock Contact SSG fixture | 56 documents |

**53 Node tests pass; 224 normal/fixture HTML documents pass existing strict
UTF-8/NUL/replacement-character, asset-path, sitemap, canonical and hreflang
guards.** There are 168 normal documents across the three documented bases.
**Every CSR/SSG JS, CSS and WOFF2 asset is byte-identical to the accepted G3
baseline**, so no asset-size increase or unexpected application CSS difference
was found. This includes Tailwind utilities, RTL/LTR, responsive/reduced-motion
CSS and the approved Noto Sans Arabic/Inter assets. Render timestamps naturally
change; whole timestamp-containing HTML is not required to match byte-for-byte.

## Browser and visual results

All tests use Windows Chrome **158.0.8127.88**:

| Fresh G4.1 suite | Result |
| --- | --- |
| Canonical routes, all-page hydration, refresh and bounded query sweep | 222 pass |
| Existing SSG interaction suite | 38 pass |
| Mocked SSG Contact history | 40 pass; 152 hydration/metadata checks |
| Workshop font handoff/breakpoints/course scope/curriculum layout | 20 pass |
| Paired G3/current screenshots | 32 pairs pass |

There are **320 functional/layout browser cases**, with **zero recoverable
hydration errors**, plus 32 visual pairs. Functional checks preserve both
languages and all three deployment bases, legacy navigation, direct visits,
Back/Forward, mobile menus, ContactResult behavior, retry drafts, success
invalidation and reduced-motion content. Contact submissions are mocked with
synthetic data and external sending is blocked. Literal index.html aliases
remain separate and unfixed.

The visual matrix covers Arabic/English home, BIM Training, Workshop 03 and
Contact at **390x844 and 1440x1000**, with both normal and reduced-motion
preferences. It compares the preserved actual G3 site with the new candidate
under the same test clock; screenshot-time animation normalization is confined
to the test harness, not application behavior. All 32 pairs have **zero geometry
difference**, and matching computed heading/main/header/footer family, font size,
line height, direction, color and height. Noto Sans Arabic and Inter are preserved.

Twenty-nine pairs have zero pixels above the existing per-channel delta-20
comparison threshold. Three home pairs differ: mobile reduced Arabic
**0.296512%**, desktop reduced Arabic **0.083750%**, and desktop normal Arabic
**0.001111%**. All are below the existing **0.5% / 1px** visual gate. Before,
after and diff images were inspected: the two larger differences are confined
to the rotating small title line, while the small difference is the decorative
scroll indicator. The unchanged `TypewriterEffect` cycles every 3 seconds with
AnimatePresence transitions, so capture timing can show that line at different
visibility phases even with the same clock policy. Application JS/CSS bytes,
static layout and font properties are identical. No design/CSS regression was
identified, no pixels were masked to conceal differences, and no application
timing or reduced-motion source was changed. These are **passing comparisons,
not a claim of exact pixel identity**.

Key commands include existing package scripts plus ignored local diagnostics:

```text
node scripts/test-router-g1-browser.mjs
npm run test:ssg-browser -- --extra
npm run test:contact-history
npm run test:course-layout -- --output dist-ssr/phase5c3-g4-1/course-layout
node dist-ssr/phase5c3-g4-1/typography-fixture.mjs after
node dist-ssr/phase5c3-g4-1/visual-compare.mjs
```

The prose fixture and screenshot runner are local evidence scripts; they are
not automatically available in a new clone. No fresh LCP benchmark or live
hosting/Linux verification is claimed.

## Files, evidence and recommendation

Only these project files change in G4.1:

1. `package.json` — invalid G4 entry removed, child-only candidate validated.
2. `package-lock.json` — npm-generated scoped parser resolution and metadata normalization.
3. `docs/PHASE-5C3-G4-1.md` — this report.
4. `docs/DEVELOPMENT-HANDOVER.md` — current state and remaining blockers.

The original G4 report remains unchanged as historical evidence. Diagnostics,
registry data, before/after audits, exact lock-field differences, prose CSS,
build/test logs and runtime asset inventories are under ignored
`dist-ssr/phase5c3-g4-1/`. These local artifacts are not deployment output and
are not automatically included in a future clone.
Final SHA-256 verification of the 464 starting project files finds only the
manifest, lockfile and handover changed; this report is the sole new project
file. Prior source, tests, configuration and phase reports retain their bytes.
The combined tree has four modified and ten untracked project files including
prior work; nothing is staged. Outer main's HEAD, tracked status and original
59/154-file artifact inventories are unchanged.

**Recommendation: accept the narrow G4.1 configuration correction and Typography
parser-path remediation for review.** Resolution, reproducible installation,
the actual targeted instance, all 53 Node tests, all CSR/SSG builds/integrity,
320 functional/layout cases, isolated prose CSS and 32 visual pairs pass.
The manifest is consistent; the failed version-qualified key is gone. This does
**not** accept the two remaining parser copies, global security risks, Linux
metadata implications or production release readiness.
The independent English Training LCP concern remains open and is not re-measured
or optimized by this task. Linux/native metadata, both remaining parser paths,
other tooling/browser security decisions, literal index.html aliases, provider/
hosting readiness and separate release approval remain outstanding. No commits,
pushes, merges, deployment or changes to outer main are performed.
**Production remains BLOCKED.**
