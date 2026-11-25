# Phase 5C.3-D — CLS/LCP investigation and targeted correction

25 November 2026, Asia/Riyadh. **Local phase validation PASSED. Production release remains BLOCKED.**

Repository: https://github.com/M-Elmaghawry/ME-2026-Main

Branch: `fix/seo-language-consistency`. HEAD remains
`de485daffaf72be29a1a2118dcc01e1aa7823755`; `main` remains
`77ba313d8617a082d349f383e876ac34013eb551`. Nothing was committed, pushed,
merged or deployed. Dependencies and React 18.3.1 were not upgraded.

## Preserved baseline

The initial 26 uncommitted files matched the Phase 5C.3-B/5C.3-C state. They were
copied with SHA-256 hashes, together with the optimized candidate, into ignored
`dist-ssr/phase5c3-d-before-1795596660136/` before editing. Environment files were
not copied. The Phase 5C.3-C report and its failed measurements remain historical
evidence; the results below supersede its current CLS/LCP acceptance findings.

The original pre-font-optimization build is preserved separately at
`dist-ssr/phase5c3-c-before-1795591262411/site`. These two before-builds allow the
font optimization and the new course fix to be evaluated independently.

## CLS root cause and trace evidence

At 390×844, the six English Workshop 03 topic badges initially use the system
Arial fallback while Inter is loading. Four badges fit on the first row and
two on the second. With Inter applied, their different text advances produce
three rows: three badges, two badges, then Templates. This adds **34 px** to the
hero and moves the instructor and following content down.

The matched pre-fix trace records a **0.1313903817** shift at **977.8 ms**.
Hydration completion is marked at **1,318.6 ms**. The marker identifies completion,
not hydration start; no claim is made that all hydration work began later.
Font-state sampling, actual rendered-font queries, unchanged badge text, and the
controlled font handoff identify the metric change rather than a React text or
curriculum-state change.

| Affected element | Before font application | After Inter |
| --- | --- | --- |
| Saudi Building Code | first row, x≈237, y=441, width≈134.75 | second row, x=16, y=475, width≈141.39 |
| Templates | second row, y=475 | third row, y=509 |
| Instructor line | y=517 | y=551 |
| Below-hero content | y=589 | y=623 |

Images have intrinsic dimensions and are not the shifted source elements. The
curriculum is carried down by the taller hero; an accordion interaction or
delayed insertion is not required to reproduce the shift. The static badge
group has no Framer Motion entrance animation. Application script scheduling
does affect whether the fallback gets painted before Inter is ready: the
diagnostic script-blocked control had zero CLS because Inter was ready for its
first styled frame. That control was not used for acceptance scores.

The controlled handoff regression runs the real page with Inter held until its
fallback layout is recorded, then releases the same file. It fails on the old
page with **2 rows → 3 rows**, and passes on the corrected page. It is explicitly
a causal regression test, separate from the native cold-network benchmarks.

### Smallest correction

`CourseDetail.css` defines a local, width-adjusted fallback and applies it only
to the topic tags of **English Workshop 03**. The measured aggregate advances of
the six existing labels are 397 px in Inter and 369.140625 px in Arial at the
existing 12 px/500 style. Their ratio gives approximately **107.55%** `size-adjust`.
The fallback resolves locally to Arial, or Liberation Sans where available;
there is no new font download.

Inter remains first in the family stack. Its file, weight, size and final
glyph/layout metrics remain unchanged. The 16 px line height, padding, borders,
flex wrapping and content are retained. The local fallback initially occupies
the intended rows instead of increasing the hero height when Inter arrives.
This uses the [font-fallback metric adjustment method documented by Chrome](https://developer.chrome.com/blog/font-fallbacks),
scoped to the affected element rather than altering global typography.

The matched post-fix trace records **0.0015651673** CLS. All six loaded badge
rectangles match their pre-fix Inter rectangles exactly. No fixed-height mask,
clipping, hidden content, animation suppression or delayed-content workaround
was introduced.

Across controlled handoff tests at 320, 360, 375, 390, 414, 428, 768 and 1440 px,
row counts remain stable: 3, 3, 3, 3, 2, 2, 1 and 1 respectively. All course route
scope checks pass: the fallback applies only to the intended English course.
Arabic/English Workshop curriculum toggles also preserve their original state.

## Native repeated performance acceptance

Chrome **158.0.8127.88**, Windows, Node **24.19.0**, npm **11.17.0**.
There are **nine cold runs per cohort per page**, 54 runs in total:

- `legacy`: original three-font hints, before Phase 5C.3-C.
- `optimized`: locale-aware hints, before the new course correction.
- `fixed`: locale-aware hints plus the scoped badge fallback.

All cohorts use the same browser version, 390×844 viewport, grayscale text
rasterization, 100 ms latency, 4 Mbps down/1 Mbps up and 4× CPU slowdown.
Each load uses a fresh browser context, cleared HTTP cache, normal within-load
cache, identical gzip servers and `max-age=600`. Cohort order rotates through
the three positions; each cohort occupies each position three times per page.
Builds and other browser suites were not run concurrently with these benchmarks.

Animations and slideshows run normally. There is no clock manipulation, font
gate, CSS probe, script blocking or content hiding in acceptance runs. Diagnostic
traces and screenshot normalization are separate from these passive timing runs.

| Page / cohort | Runs | Maximum CLS | Median LCP ms | LCP range ms |
| --- | ---: | ---: | ---: | ---: |
| English Workshop 03 / legacy | 9 | 0.131390 | 948 | 924–1,004 |
| English Workshop 03 / optimized | 9 | 0.131390 | 932 | 904–952 |
| English Workshop 03 / fixed | 9 | **0.001565** | 956 | 928–968 |
| English BIM Training / legacy | 9 | 0 | 2,064 | 1,452–2,128 |
| English BIM Training / optimized | 9 | 0 | 2,016 | 1,860–2,056 |
| English BIM Training / fixed | 9 | 0 | **1,924** | **1,840–2,064** |

The corrected candidate passes the original CLS ≤0.1 budget, comfortably below
the preferred 0.05, and **every** measured English Training LCP is ≤2,500 ms.
No threshold was relaxed. The previously failing font/visual suite now exits 0
against the current candidate as well.

## LCP assessment and timing breakdown

The final LCP element is the existing **`p.bt-intro`**, with the same text and
63,366 px reported content size in all cohorts. The earlier three-run result
of 1,476 → 1,992 ms is **not reproduced as a consistent median regression** in
the larger balanced sample. The original baseline itself includes faster
1,452/1,476 ms observations alongside approximately 2,000–2,128 ms observations.
All nine values and distributions are preserved in the compact evidence.

For transparency, means are 1,936 ms legacy, 1,997 ms optimized and 1,955 ms
fixed. An exploratory paired bootstrap gives a mean optimized-minus-legacy
interval of approximately **−105 to +277 ms**, spanning zero. The corresponding
paired-median interval is wider (**−160 to +568 ms**). These small local samples
do not prove equivalence or exclude every possible regression; they do not
establish a consistent 516 ms slowdown either. The measured current candidate
meets the requested absolute target without sacrificing the font savings.

The trace points to **element render delay** as the dominant portion of LCP.
The paragraph starts from the approved hidden entrance state and resolves after
hydration, viewport observation and its existing 0.5 s reveal with the existing
0.16 s stagger. This code and its visitor/reduced-motion policy were preserved.

| Representative fixed trace | Time / duration |
| --- | ---: |
| Document TTFB | 101 ms |
| Required LCP resource load delay | 0 ms |
| Required LCP resource load duration | 0 ms |
| Element render delay | 1,751 ms |
| Final text LCP | 1,852 ms |
| Inter preload starts / response finishes | 137 / 624 ms |
| Hydration completion | 1,116 ms |
| Intro visibly entering / effectively fully visible | 1,318 / 1,819 ms |

This is a text LCP with an empty resource URL and `font-display: swap`, so the
URL-based breakdown does not invent an image-resource dependency. Font timing
is recorded separately because it can still affect layout and painting. This
distinction follows the [LCP subpart guidance](https://web.dev/articles/optimize-lcp).
The nine-run fixed medians are about 101 ms TTFB and 1,823 ms element render delay.

The hero image already has high fetch priority and valid dimensions. On mobile
it starts around y=788, so only part of it is initially visible and it is not the
final LCP element. The render-blocking stylesheets, script waterfall, main-thread
long tasks and font events were inspected; Inter response completion precedes
the late paragraph paint substantially. Improving a network resource alone
cannot remove this approved entrance timeline. No speculative service, image,
animation, SSR architecture or preload change was made to chase one sample.

The course correction is not claimed to cause the Training median variation.
No Training implementation changed. There is insufficient evidence of a
material font-optimization regression to justify reverting its transfer saving
or changing the approved entrance behavior.

## Browser, visual and automated validation

| Validation | Result |
| --- | --- |
| App/node, SSG and experimental TypeScript | Passed |
| ESLint | 0 errors; 8 existing Fast Refresh warnings |
| Existing automated tests | 27 passed |
| Candidate automated tests | 23 passed |
| Existing CSR production build | Passed |
| Repo, root and custom-base SSG builds | Passed; 168 HTML documents |
| Mocked contact candidate build | Passed; separate 56 documents |
| Strict UTF-8 / NUL / U+FFFD | All 224 documents passed |
| Native critical benchmark | 54 cases; corrected cohort passes all 18 budgets |
| Course font-handoff/scope/curriculum suite | 20 passed in Chrome; 20 passed in Edge |
| Preserved pre-fix negative control | Expected failure: badge rows 2 → 3 |
| Matched normal mobile/desktop visuals | 12 pairs; **0 changed pixels, 0 px geometry differences** |
| Font usage, language switch/Back, mixed script | Matching rendered fonts; six switch and six mixed-script checks passed |
| Contact history regressions | 40 passed, including 152 hydration/metadata checkpoints |
| Wider SSG interactions and legacy URLs | 38 passed across all deployment bases |
| Separate reduced-motion critical checks | 8 passed; AR/EN Workshop and Training, mobile/desktop |

The eight reduced-motion checks have maximum CLS **0.020825**, below 0.05. These
are separate from the normal-motion timing distributions. The existing broader
suite also checks reduced-motion visibility and slideshow behavior. No
recoverable hydration or bootstrap errors, metadata duplicates or broken local
assets were observed. Header/footer, CTA destinations, automatic slideshows,
curriculum content, portfolio and Contact behavior are preserved.

Settled screenshots do not substitute for cold-load CLS; both are tested. The
representative Arabic Home remains about 3.3 s LCP under this throttled profile,
similar to its preserved baseline. No site-wide ≤2.5 s LCP or field-CWV signoff
is claimed from this targeted phase.

## Transfer savings and implementation scope

English Training's final median transfer is **371,591 bytes** versus **569,380**
with the old font policy, retaining approximately **34.7%** savings. Font transfer
is still **48,436** versus **246,173** bytes. The scoped CSS and updated module
references add about 519 bytes to Workshop 03's measured cold transfer and 31
bytes to Training; no additional remote font is fetched.

Only two application files changed: the new course stylesheet and the course
component's stylesheet import/scope attributes. Noto Sans Arabic, Inter, their
font files, font weights, global CSS, locale hint policy and approved motion
remain unchanged. Other changes are testing and documentation.

Exact Phase 5C.3-D files:

- `src/pages/CourseDetail.css` — local fallback descriptor and precise selector.
- `src/pages/CourseDetail.tsx` — stylesheet import, course identity and tag class.
- `scripts/audit-ssg-performance.mjs` — passive balanced benchmarks, diagnostic
  Chrome traces, waterfall/font/layout records and separate reduced profiles.
- `scripts/test-course-layout.mjs` — font handoff, other-course scope and curriculum regressions.
- `scripts/test-ssg-font-loading.mjs` — adds badge font usage to existing comparisons.
- `package.json` — adds `test:course-layout` only.
- `docs/PHASE-5C3-D.md` — this report.
- `docs/phase5c3-d/validation-summary.json` — raw runs, descriptive statistics,
  uncertainty, budgets, regression and integrity results.
- `docs/phase5c3-d/trace-summary.json` — concise trace/layout/font/timing evidence.
- `docs/DEVELOPMENT-HANDOVER.md` — current status and remaining gates.

## Reproduction and durable evidence

Standard build/test commands remain in the handover. After building the
repository-base candidate:

```text
npm run test:course-layout
node scripts/audit-ssg-performance.mjs --site fixed=dist-ssr/candidate/repo/site --runs 9 --assert-budget --budget-cohort fixed --output dist-ssr/recheck-performance
node scripts/audit-ssg-performance.mjs --site fixed=dist-ssr/candidate/repo/site --trace --runs 1 --output dist-ssr/recheck-traces
node scripts/audit-ssg-performance.mjs --site fixed=dist-ssr/candidate/repo/site --language both --reduced --runs 1 --output dist-ssr/recheck-reduced-mobile
node scripts/audit-ssg-performance.mjs --site fixed=dist-ssr/candidate/repo/site --language both --reduced --desktop --runs 1 --output dist-ssr/recheck-reduced-desktop
```

For the three-cohort comparison, add `--site legacy=<pre-C-site>` and
`--site optimized=<pre-D-site>` before `--site fixed=...`. Original before-builds
are local ignored artifacts, not recoverable from the tracked JSON alone.
`CHROME_PATH` selects another installed Chromium executable; no browser is
downloaded. Never deploy mocked diagnostic builds.

[Compact validation evidence](phase5c3-d/validation-summary.json) and
[trace evidence](phase5c3-d/trace-summary.json) are tracked-document candidates.
Full Chrome-importable traces are preserved locally, including:

- [Before course trace](../dist-ssr/phase5c3-d-final-traces/optimized-en-course-1.trace.json)
- [After course trace](../dist-ssr/phase5c3-d-final-traces/fixed-en-course-1.trace.json)
- [Before Training trace](../dist-ssr/phase5c3-d-final-traces/optimized-en-training-1.trace.json)
- [After Training trace](../dist-ssr/phase5c3-d-final-traces/fixed-en-training-1.trace.json)

Large traces, builds and PNGs remain ignored. Diagnostic probes and the
script-blocked control are excluded from performance acceptance. The full
passive benchmark is at `dist-ssr/phase5c3-d-final-benchmark/report.json`.

## Remaining release gates

The targeted local CLS/LCP gate is cleared. Production remains **BLOCKED** by
unverified Node 22/Linux compatibility and the historical **24 dependency
findings** pending remediation or explicit risk acceptance. The dependency audit
was not rerun in this task. Real hosting/CI cutover and release approval remain
separate work; the existing production workflow still builds CSR.

Next, validate a clean locked installation/build/test run on Node 22.22.2+ and
Linux, including browser checks of local Arial/Liberation Sans availability and
fallback metrics. Windows Chrome/Edge measurements are not a promise of all
platforms' font performance. Complete dependency review without unapproved
upgrades, then rerun final release readiness. The current work remains local and
uncommitted for review.
