# Phase 5C.3-C — Locale-aware font loading

25 November 2026, Asia/Riyadh. **Font download optimization implemented locally;
full acceptance and production release remain BLOCKED.**

Repository: https://github.com/M-Elmaghawry/ME-2026-Main

Branch: `fix/seo-language-consistency`. HEAD remains
`de485daffaf72be29a1a2118dcc01e1aa7823755`. All Phase 5C.3-B work remains
uncommitted and preserved. Before editing, all 20 dirty files were copied with
SHA-256 hashes, and the existing repository-base candidate was copied to
`dist-ssr/phase5c3-c-before-1795591262411/`. No environment files were copied.

## Root cause and implementation

The candidate selected every font marked `preload` in the shared source catalog,
independent of document language. Every HTML document therefore preloaded:

- Inter Latin: 48,256 payload bytes.
- Noto Sans Arabic Arabic: 165,960 payload bytes.
- Noto Sans Arabic Latin: 31,416 payload bytes.

The same list also drove an unconditional `new FontFace(...).load()` warmup.
Removing preload tags alone would leave those explicit downloads. The warmup
consumed the preloads even when rendered text did not use those faces, so the
baseline produced no unused-preload warnings despite unnecessary transfers.

`scripts/ssg-fonts.mjs` now owns the shared document hint policy. English selects
Inter Latin only. Arabic selects Noto Arabic and Noto Latin first, then Inter
Latin for its actual mixed-script content. Preload and decode hints consume the
same selected list. Asset resolution requires exactly one manifest match, with
no duplicate URLs. All URLs use the deployment base, without a locale prefix.

The policy changes early loading hints only. The pinned font files, CSS face
definitions, Unicode ranges, weights 300–800, `font-display: swap`, family
stacks, and approved typography remain unchanged. CSS can still request any
original subset when actual text requires it. Same-locale client navigation
continues to use those faces; cross-locale candidate navigation fetches the
counterpart document with its own correct initial hints. The CSR build retains
its existing CSS-driven font loading.

### Mixed-script findings

Arabic pages actually render Inter as well as Noto Sans Arabic, including Latin
text in body/footer content. Removing all Inter hints from Arabic would ignore
that usage. English desktop pages visibly render the Arabic language-switch
label in Noto Sans Arabic. English mobile hides that label at this viewport.
Consequently, an English desktop page can legitimately download the Arabic face
on demand even though it should not preload it globally.

English Home still requests the Noto Symbols subset through CSS. That file is
absent from both the old and new explicit hint lists. It remains available on
demand; this phase does not claim that English must make zero Noto requests.
CDP rendered-font queries and mixed-script probes distinguish actual usage from
downloaded or merely declared faces. Font CSS is bundled in the existing global
stylesheet; no separate Google Fonts CSS requests occur.

## Repeated before/after measurements

Chrome **158.0.8127.88**, Windows, Node **24.19.0**, npm **11.17.0**.
Each row uses three cold loads per build, alternating before/after. The viewport
is 390×844, with 100 ms latency, 4 Mbps download, 1 Mbps upload and 4× CPU
slowdown. Each cold load uses a fresh context and cleared HTTP cache, with normal
cache behavior within the load. Both static servers use identical gzip for text,
original WOFF2 bytes and `Cache-Control: max-age=600`.

External HTTPS integrations are blocked through CDP rather than request
interception. The measurement window is load + fonts.ready + four seconds.
Animations run normally; clock normalization is confined to separate screenshot
comparisons. One partial run overlapping builds was excluded and retained as an
ignored diagnostic; the paired results below were collected after builds.

Bytes below are CDP encoded transfer bytes, including response overhead. They
are not raw file sizes. LCP is a local lab observation, not field CWV or INP.

| Mobile document | Total bytes before → after | Font bytes before → after | Font requests | Median LCP ms before → after | Maximum CLS before → after |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arabic Home | 490,405 → 490,401 | 260,937 → 260,937 | 4 → 4 | 3,156 → 3,108 | 0 → 0 |
| English Home | 489,674 → 291,854 | 260,937 → 63,200 | 4 → 2 | 2,960 → 2,704 | 0 → 0.007444 |
| Arabic BIM Training | 584,721 → 584,720 | 260,937 → 260,937 | 4 → 4 | 2,340 → 2,128 | 0 → 0 |
| English BIM Training | 569,380 → 371,560 | 246,173 → 48,436 | 3 → 1 | 1,476 → 1,992 | 0 → 0 |
| Arabic Workshop 03 | 481,047 → 481,046 | 260,937 → 260,937 | 4 → 4 | 1,092 → 1,100 | 0.001352 → 0.001352 |
| English Workshop 03 | 465,716 → 267,896 | 246,173 → 48,436 | 3 → 1 | 968 → 924 | **0.131390 → 0.131390** |

English Training saves **197,820 total bytes (34.74%)**; **197,737 bytes** of that
are font transfer savings. The two removed raw WOFF2 payloads total 197,376
bytes; headers account for the difference. Other JS/CSS/font assets and all 56
prerendered root bodies are byte-identical, so no image, content or application
bundle reduction is being counted as a font optimization. Remaining HTML byte
differences come from the hints and generated snapshot/compression details.

English Training's warm reload transferred zero font bytes in both builds;
total transfers were 10,592 → 10,509 bytes. A warm-cache-only test would conceal
the unnecessary cold downloads. No unused-preload warnings were recorded in
either build. Exact asset URLs, individual runs and LCP ranges are retained in
[validation-summary.json](phase5c3-c/validation-summary.json).

The byte improvement is not a universal LCP improvement. English Training's LCP
rose by 516 ms in this profile, with the same paragraph and reported content
size as LCP. English Home improved while adding a small measured CLS of up to
0.007444. Desktop font usage/visuals were verified, but these mobile byte-saving
percentages are not asserted for desktop pages with visible Arabic labels.

## Failed acceptance gate: course font-swap CLS

The preserved baseline independently reproduced **0.1313903817** CLS on English
Workshop 03 before implementation. A focused before/after trace reproduced the
same value and the same source rectangles. At fallback-to-Inter swap, topic
badges rewrap: the instructor block and following content move down **34 px**.
Font loading completes near that shift. The final font family and final layout
are identical before and after. In the three paired after runs, CLS was
0.131390, 0 and 0.131390; all three before runs reached 0.131390.

See [course-cls-diagnostic.json](phase5c3-c/course-cls-diagnostic.json) for source
rectangles/timing. This is a pre-existing font-swap failure exposed by the wider
course coverage, not a passed acceptance criterion. The benchmark deliberately
exits **1** after collecting all measurements, visuals and interactions because
its CLS ≤ 0.1 gate fails. The failed gate has not been relaxed or suppressed.

The download optimization is reviewable, but **Phase 5C.3-C does not receive a
complete performance signoff**. Further font-swap/CLS work and the English
Training LCP result require focused review. This phase leaves the approved
layout, fallback metrics, display policy, font families and animations intact.

## Visual, functional and integrity results

- Twelve before/after screenshot pairs: six pages × mobile/desktop. Main, H1
  and header geometry differences: **0 px**. Ten pairs have zero differing
  pixels; each desktop Home pair differs by eight pixels, **0.000556%**. Threshold
  is a channel delta >20, with identical grayscale text rasterization and
  animation phase. These are settled screenshots, not proof of zero font-swap
  movement; the cold-load CLS failure above remains recorded.
- Rendered families and glyph counts match exactly across all screenshot pairs.
  The English desktop language label uses Noto Sans Arabic. Six mixed-script
  probes render both Inter and Noto Sans Arabic correctly.
- Six locale-switch/Back checks pass, with unique locale-specific hint URLs and
  cache-aware request capture. Exact switch records remain in the local full
  report; normal cache reuse is preserved.
- Forty mocked Contact history cases pass on Arabic/English desktop/mobile,
  including 152 hydration/metadata checks. No real messages are sent.
- The existing 38-case SSG interaction suite passes across repository, root and
  custom bases, including reduced motion, slideshow policy, routing and results.
- Fifty automated tests pass: 27 existing + 23 candidate. New protection checks
  all 168 normal documents for locale-correct preloads **and actual warmup
  requests**, unique/base-correct URLs and Arabic priority. Pinned font hashes
  and original CSS face definitions are still checked exactly.
- App/node, SSG and experimental TypeScript checks pass. ESLint has zero errors
  and eight existing Fast Refresh warnings. Production build and repository,
  root, custom-base and mocked candidate builds pass.
- All 168 normal candidate documents plus 56 mock-fixture documents pass strict
  UTF-8, zero-NUL and zero-U+FFFD guards. Existing full HTML, asset, canonical,
  hreflang, sitemap and Suspense checks pass. No recoverable hydration errors,
  bootstrap errors, duplicated metadata or broken local assets were observed.

## Reproduction commands

The font unit/HTML checks are included in `npm run test:ssg` and require the
three normal candidate builds first. Standard commands are in the handover.

For the browser comparison, preserve a pre-change candidate before rebuilding:

```text
npm run test:ssg-font-loading -- --baseline <preserved-repository-base-site> --runs 3
```

This requires installed Chrome; `CHROME_PATH` can select another Chromium
executable. No browser or dependency is downloaded. The initial audit can use
`--stage before --runs 1`; `--filter en-course --runs 1 --performance-only`
isolates the known CLS failure. `--output <directory>` separates diagnostics.
`--resume` requires the same browser/policy/paths and completes missing cases
from an interrupted run; unchanged application assets are required. The current
full benchmark is expected to return **1** until the CLS gate is resolved.

Full local evidence is under `dist-ssr/phase5c3-c-fonts/`; large builds and PNGs
remain ignored. The compact tracked JSON above preserves the findings without
requiring those local artifacts to interpret them. A new machine needs its own
preserved before-build artifact to repeat the exact A/B visual comparison.

## Exact files changed in Phase 5C.3-C

- `scripts/ssg-fonts.mjs` — shared locale hint selection and validation.
- `scripts/build-ssg.mjs` — uses the selected hints for each generated document;
  preserves Phase 5C.3-B manifest handling.
- `tests/ssg-fonts.test.mjs` — locale/warmup/asset regression protection.
- `scripts/test-ssg-font-loading.mjs` — repeatable cold/warm network, font usage,
  CLS/LCP, visual, language and mixed-script checks; failing CLS gate retained.
- `package.json` — adds `test:ssg-font-loading`; preserves Contact test command.
- `docs/PHASE-5C3-C.md` — this report.
- `docs/phase5c3-c/validation-summary.json` — compact reproducible measurements.
- `docs/phase5c3-c/course-cls-diagnostic.json` — before/after shift evidence.
- `docs/DEVELOPMENT-HANDOVER.md` — current status and next gates.

The other uncommitted files belong to the preserved Phase 5C.3-B work. No font
file, global CSS, application component, dependency version/lockfile, active
deployment workflow or `main` change is part of this phase. No commit, push,
merge or deployment was performed.

## Remaining gates and recommendation

Production stays **BLOCKED**. Review the implemented hint optimization and the
failed course CLS gate before treating this phase as fully accepted. Investigate
English Training's LCP increase under the same profile as a separate performance
finding; do not present the byte reduction as across-the-board speed improvement.

Node 22/Linux verification and the historical 24 dependency findings remain
outstanding. Proceed with separately scoped clean Linux/Node 22.22.2+ locked
installation/build/test validation and dependency remediation or explicit risk
acceptance. Keep Node 24 as a comparison environment and preserve the lockfile
until a dependency change is separately approved. No fresh dependency audit or
Node installation/upgrade was performed during this font-only task.
