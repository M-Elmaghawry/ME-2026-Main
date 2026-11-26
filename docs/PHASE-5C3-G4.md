# Phase 5C.3-G4 — Scoped Typography parser remediation

25 November 2026, Asia/Riyadh. **G4 STOPPED: npm override conflict. Do not accept
G4. Production release remains BLOCKED.**

## Repository, preservation and runtime

Authorized Git root: `G:\ME-Website\ME-2026-Main\ME-2026-Main`.
Branch: `fix/seo-language-consistency`. HEAD remains
`eafb491eb754dee9ba5bb4ea0d42a0e174248455`, with all prior G1/G1.1/G2/G3 work
uncommitted and preserved. Outer main remains at
`77ba313d8617a082d349f383e876ac34013eb551`.

Node **22.23.5** / npm **10.9.9** were used. Before the attempt, ignored
`dist-ssr/phase5c3-g4/baseline/` captured the G3 CSR/SSG site outputs, manifest,
lockfile, build configs, accepted validation logs and **463 project-file hashes**.
DEVELOPMENT-HANDOVER, PHASE-5C3-F, REMEDIATION-PLAN and PHASE-5C3-G3 were reviewed.
The pre-attempt installed tree exits 0. There were no existing root overrides.

## Actual dependency paths and target investigation

| Installed path | Dependency requirement | Before and current installed version |
| --- | --- | --- |
| root -> @tailwindcss/typography 0.5.19 -> parser | Exact 6.0.10 | **6.0.10** at `node_modules/postcss-selector-parser` |
| root -> tailwindcss 3.4.19 -> parser | ^6.1.2 | **6.1.2** at `node_modules/tailwindcss/node_modules/postcss-selector-parser` |
| root -> tailwindcss -> postcss-nested 6.2.0 -> parser | ^6.1.1 | **6.1.2** at `node_modules/postcss-nested/node_modules/postcss-selector-parser` |

Here parser means `postcss-selector-parser`. Additional peer paths reach Tailwind
through tailwindcss-animate and Typography. All three installed copies are
affected; only Typography's exact pin requires an override. The other two paths
permit 6.1.5 normally and were planned for a targeted compatible parser refresh,
without overrides on those parents or changes to unrelated parser packages.

Fresh npm metadata confirms parser **6.1.5**, Node **>=4**, and unchanged helper
requirements `cssesc ^3.0.0` / `util-deprecate ^1.0.2`. Typography 0.5.19 and the
current latest **0.5.20** both still pin parser **6.0.10**. Updating Typography's
available parent patch would therefore not fix this dependency. No parent
package, Tailwind or styling architecture was changed.

The relevant current advisory ranges are:

- **GHSA-rj75-hqrm-r3gf**: parser `<6.1.5`, including 6.0.10 and both 6.1.2
  copies; 6.1.5 is outside the affected range.
- **GHSA-w9m9-85wc-3x92**: `>=6.1.0 <6.1.3`, affecting both 6.1.2 copies;
  6.1.5 is also outside that range. The 6.0.10 copy is not affected by this
  particular range but remains affected by the first advisory.

These are build-time selector-parsing findings, not emitted browser parser
modules. Their conditional input exposure does not resolve the affected ranges
or accept the risk. Typography uses public v6 parser/AST APIs including astSync;
same-major metadata compatibility was preliminary evidence, not final proof.

## CSS baseline and actual plugin use

The application registers Tailwind and Autoprefixer through PostCSS. Tailwind's
current plugins array contains **tailwindcss-animate only**: installed Typography
is not registered, and there are no current prose-class consumers. Consequently,
unchanged application CSS alone would not exercise Typography compatibility.

An isolated, ignored diagnostic fixture explicitly activates the installed
Typography plugin against representative prose, headings, links, nested lists,
tables, code, not-prose exclusions, inverted styles and responsive sizes, with
Arabic/English content. Before the override it generated **57,371 bytes** of CSS,
SHA-256 **9116c2403581b1185627ab7f850be6496a84f93214002d2c09e7c35d6fabfd60**.
The fixture changes no application configuration. Its after-comparison was not
run because the npm stop condition occurred first.

## Candidate override and exact failure

The previously proposed version-qualified child override was added to
package.json for resolution:

```json
{
  "overrides": {
    "@tailwindcss/typography@0.5.19": {
      "postcss-selector-parser": "6.1.5"
    }
  }
}
```

The command was:

```text
npm install --package-lock-only --ignore-scripts --engine-strict --registry=https://registry.npmjs.org
```

It exits **1** before resolving/installing the candidate, with:

```text
npm error code EOVERRIDE
npm error Override for @tailwindcss/typography@^0.5.16 conflicts with direct dependency
```

The root manifest declares Typography as **`^0.5.16`**, although the installed
lock resolves **0.5.19**. npm 10.9.9 treats the version-qualified parent key as a
parent spec override as well as a child selector. Its actual Arborist
`OverrideSet` sets the implicit parent value from that key spec; `assertRootOverrides`
rejects changing a direct dependency's raw spec. Installed-version equality
does not make `0.5.19` and `^0.5.16` the same declared spec.

This triggers the user's explicit **"Stop if the override causes dependency
conflicts"** condition. No second override syntax, parent range pin, compatible
parser refresh, dedupe, broader upgrade or architecture workaround was attempted.

**The failed candidate block remains in package.json for review.** It is not an
installed remediation. npm dependency operations against this manifest can
continue to raise EOVERRIDE until an authorized correction/removal is made.
The original manifest is preserved in the ignored baseline; no automatic
rollback or discard of work was performed.

## Security and validation status after stopping

- package-lock.json is **byte-identical to the starting G3 lock**.
- Direct inspection of all three installed parser package.json files confirms
  they remain **6.0.10 / 6.1.2 / 6.1.2**.
- Before report edits, all 463 baseline project hashes matched except the
  intended package.json candidate. No existing source, config, lockfile, test or
  prior phase report was modified.
- The fresh pre-attempt audit matches G3 exactly: **20 advisory IDs across 11
  affected package names**, with package severity totals **4 high / 7 moderate**.
- **No G4 advisory is resolved.** The installed dependency graph is unchanged.
  No fresh post-install audit exists because there was no successful installation.
  No G4-introduced package or advisory change is claimed from a failed install.
- The outstanding parser findings, four affected browser library names
  (i18next, react-router, react-router-dom, Zod), legacy brace chain and other
  build/CI findings retain G3's dispositions; no residual was accepted.
- Required clean install, TypeScript, lint, Node tests, CSR/SSG builds, HTML/
  hydration checks and before/after browser/CSS visual comparisons were **not
  rerun as G4 acceptance checks** after the stop. The accepted G3 results are
  historical baseline evidence, not G4 passing results.
- No G4 performance measurement or LCP fix was attempted. The independent
  English Training LCP concern remains open; the 2,500ms target is not certified.

The unchanged full-audit IDs are:

```text
GHSA-2883-xcg3-v3hh  GHSA-337j-9hxr-rhxg  GHSA-3jxr-9vmj-r5cp
GHSA-52cp-r559-cp3m  GHSA-5p4m-2wfm-xmqj  GHSA-6j4f-fj2g-mc7p
GHSA-6jcc-5g8w-32mx  GHSA-73wf-gq98-2v4g  GHSA-c83g-rgw3-j3cx
GHSA-h67p-54hq-rp68  GHSA-mh99-v99m-4gvg  GHSA-mrhx-c7xc-m3w5
GHSA-p498-v437-472g  GHSA-q2hr-2g5m-vwhr  GHSA-qhr7-859c-m2p7
GHSA-rgw5-rvv9-x895  GHSA-rj75-hqrm-r3gf  GHSA-w5vr-8v7q-w6rv
GHSA-w9m9-85wc-3x92  GHSA-wrjc-x8rr-h8h6
```

Remaining tooling package names are `@humanfs/node`, `@tailwindcss/typography`,
`baseline-browser-mapping`, `brace-expansion`, `browserslist`, `js-yaml` and
`postcss-selector-parser`; the browser package names are `i18next`,
`react-router`, `react-router-dom` and `zod`. No previously resolved G1/G2/G3
advisory ID returned in the fresh baseline audit.

Evidence under ignored `dist-ssr/phase5c3-g4/` includes full before audit/tree,
registry metadata, fixture CSS/log, failed `override-resolution.log`, and
`blocked-verification.json`. There are no successfully installed G4 versions,
post-change CSS bytes, visual comparison or new SSR build result to report.

## Proposed correction for a separately authorized retry

Retain the root Typography requirement and locked parent version, but use a
**parent-name-scoped child override** rather than the conflicting version-qualified
key:

```json
{
  "overrides": {
    "@tailwindcss/typography": {
      "postcss-selector-parser": "6.1.5"
    }
  }
}
```

The installed npm implementation leaves the parent raw spec alone when its key
has the wildcard/default value. This is still scoped to Typography's child,
not a global parser override. It is a **proposal only**, not applied or resolution/
regression-tested in this stopped run. A retry should verify the parent stays
0.5.19, refresh only the other affected parser copies through their normal
compatible ranges, reject unrelated lock churn, then run the full requested
CSS/prose, build, browser and security gates. Another option is an explicitly
approved root requirement pin to 0.5.19; that manifest change was not inferred
as authorized here.

## Changed files and recommendation

G4 changes only:

1. `package.json` — failed/uninstalled candidate override retained.
2. `docs/PHASE-5C3-G4.md` — this blocked report.
3. `docs/DEVELOPMENT-HANDOVER.md` — blocked attempt and remaining work.

The lockfile and all existing G1–G3 source/test/configuration work are preserved.
No changes to outer main or its artifacts; no staging, commits, pushes, merges
or deployment. HEAD does not move.

**G4 acceptance recommendation: DO NOT ACCEPT; blocked by EOVERRIDE.** Resolve
the explicit npm-spec conflict in a reviewed retry before claiming remediation
or compatibility. Remaining release blockers include the unremediated parser
paths, residual tooling/security decisions, Linux/Node 22, literal index.html
aliases, independent LCP, provider/hosting readiness and separate release
approval. **Production remains BLOCKED.**
