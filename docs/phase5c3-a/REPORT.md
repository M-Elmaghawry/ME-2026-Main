> Archived Phase 5C.3-A audit, before the development checkpoint. Git counts and statements about uncommitted work describe audit time. Current setup/status: [DEVELOPMENT-HANDOVER.md](../DEVELOPMENT-HANDOVER.md). Original large evidence folders are intentionally excluded from Git.

# Phase 5C.3-A — release-readiness and hosting audit

24 November 2026, Asia/Riyadh. Repository: `M-Elmaghawry/ME-2026-Main`.

**Classification: BLOCKED — do not release.**

The extended stateful-history audit found a functional release blocker: **Back
after a language switch carrying a Contact retry draft retains the wrong router
document, producing an empty page or an incorrect 404 on a valid Contact URL**.
After a successful mocked submission, Back then refresh also recovers an older
locale's draft. This is separate from the ordinary routing and active-entry
cleanup cases that passed earlier. A focused fix and explicit cleanup semantics
are required before approval.

The candidate passes initial static HTML, SEO, ordinary routing, hydration, build
and the earlier mocked business-flow checks. An additional confirmed performance
issue is unnecessary Arabic-font
preloading on English pages: English Training transfers **570,059 bytes versus
375,536 bytes** for the existing production build command under matching cold-load
conditions, a **51.8% increase**. A focused font-delivery fix and revalidation are
required. Node 22 execution, CI cutover and dependency-risk disposition also remain
release gates. No source, active workflow, dependency, branch or production-site
change was made during this audit.

## Scope, preservation and Git inventory

Branch: `fix/seo-language-consistency`; HEAD:
`616197ee00442cf90a38436a52f6f994b9b84e0a`. The branch has one committed change
after current `main`: the existing Phase 5B/5C.1 baseline commit `616197e`.
The working tree has **26 modified tracked files and 60 untracked files**.
The complete proposed release differs from production in **119 source paths**,
including committed branch work and the 86 working-tree paths.

All **350 tracked and 60 untracked files** were hashed before testing. The
full tracked diff and production-relative diff were retained. All 86 source
hashes associated with the completed Phase 5C.2-F evidence match this audit's
starting source. Translation resources were verified to have been extracted
verbatim. Business data/configuration and the active deployment workflow were
not changed. Final preservation results accompany the machine-readable summary.

The complete per-file inventory is in [GIT-INVENTORY.md](GIT-INVENTORY.md), with
hashes and statuses in `git-inventory.json`. `source-baseline.json`, `tracked.diff`
and `release.diff` retain the inspection inputs. No reset, discard, commit,
push, merge, checkout, deployment or dependency upgrade was performed.

Relevant ignored files: `.env` (not copied or printed), `node_modules/`,
`public/optimized/`, `dist/` and `dist-ssr/`. Optimized images are generated
from tracked originals by the build; they must be present in the deployment
artifact but should not be staged as source. The pinned font files and licenses
are currently untracked source and must be included in an approved release commit.
SSR server bundles, diagnostic fixtures, reports, traces, old backups and local
environment files must never be uploaded as the Pages artifact.

Testing used a fresh temporary copy inside this ignored audit directory. The
original source and Phase 5C.2-F artifacts were preserved. This report, workflow
proposal and all new evidence are temporary audit outputs outside tracked source.

## Node, npm and CI compatibility

Locally available: **Node 24.19.0, npm 11.17.0**. No Node 22 installation or
supported local version manager was found; Node 22 was not downloaded, installed
or executed. **Candidate compatibility with Node 22/Linux is not certified.**

The current workflow selects Node 22. Locked package engine requirements include:

| Package | Locked version | Required Node |
| --- | --- | --- |
| jsdom | 31.0.1 | `^22.22.2 || ^24.15.0 || >=26.0.0` |
| Vite | 7.3.2 | `^20.19.0 || >=22.12.0` |
| sharp | 0.35.5 | `>=20.9.0` |
| playwright-core | 1.65.1 | `>=20` |

Thus an arbitrary older Node 22 installation is insufficient. The locked tree
requires at least **22.22.2 within Node 22**. Verify the exact runtime on Ubuntu
before release. The previous production commit's successful CI run does not prove
the candidate's newer test dependencies work there.

`package-lock.json` is lockfile v3 and its root dependency declarations match
`package.json`. A clean isolated **`npm ci` exited 0**, installing 395 packages
without changing the original package files or dependencies. npm 11 reported
unapproved postinstall-script warnings for SWC/esbuild; their prebuilt optional
binaries nevertheless passed the subsequent builds. This is a local npm 11
observation, not proof of Node 22's bundled npm behavior. npm documents that clean
installs require matching locks and do not rewrite package manifests.
[npm ci documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/)

Fresh isolated Node 24 results (`checks.json` and named `.log` files):

| Check | Result |
| --- | --- |
| ESLint | Pass; 0 errors, 8 existing Fast Refresh warnings |
| Application/Vite TypeScript | Pass |
| SSG TypeScript | Pass |
| Phase 5C.1 experiment TypeScript | Pass |
| Existing automated tests | 27/27 pass |
| SSG renderer/integrity/static-contract/font tests | 12/12 pass |
| Existing `build:gh-pages` command | Pass |
| Repo, root and custom SSG candidate builds | Pass; 56 documents each |
| Isolated mocked-contact fixture build | Pass; not a release artifact |
| Fresh interaction checks | 38/38 pass |
| Fresh mocked contact checks | 10/10 pass; zero real EmailJS requests |

The first audit runner mistakenly set repository-base environment variables for
the routing tests as well as the build, causing the root-base test to fail.
The runner was corrected to match the workflow's build-step-only environment
scope; all tests then passed. The first-attempt log is retained. Product source
and tests were not changed to obtain that pass.

## Static hosting and initial HTML

The fresh repository candidate uses `/ME-2026-Main/` and canonical origin
`https://m-elmaghawry.github.io/ME-2026-Main/`. The local server uses an exact,
case-sensitive file map, directory redirects, proper MIME types and one root
custom 404, rather than rewriting every URL to a successful SPA shell.

Results in `html-hosting-report.json`:

- **52/52 indexable and 4/4 auxiliary documents** inspected directly before JS.
- Correct Arabic/English body content, `lang`, `dir`, localized title/description,
  one H1/main, canonical, reciprocal alternates and Arabic `x-default`.
- One metadata/JSON-LD set; valid JSON-LD, complete content and no incomplete
  Suspense/loading-only shell. Parsing valid JSON-LD does not guarantee a Google
  rich-result appearance.
- **52/52 canonical URLs return the corresponding static HTML with status 200**.
- All 52 sitemap URLs match generated documents; all 52 pages are reachable
  through initial HTML links from the two localized homepages.
- **506 unique referenced assets/internal link targets return 200**, including
  CSS, JavaScript, local fonts, images and responsive derivatives. CSS URLs and
  Arabic filenames were checked case-sensitively. Assets use the application base,
  not an `/en/` asset prefix.
- All 56 fresh repo documents have valid UTF-8, zero NUL bytes and zero replacement
  characters. The root/custom builds and static-contract tests additionally cover
  all **168** generated documents across the three bases.

The release directory has **536 regular files, 61,421,480 bytes**, root `index.html`,
root `404.html`, localized documents and `.nojekyll`. There are no symlinks,
hardlinks, case collisions, source maps, environment files, source TS/TSX or SSR
server bundles in that directory. This is well below Pages' supported 1GB site
limit. Use the official upload action with the site directory so its required
archive packaging is handled correctly.
[Pages artifact requirements](https://github.com/actions/upload-pages-artifact/blob/main/README.md)

Fresh browser hosting simulation (`browser-hosting-report.json`): **151/151 cases
passed**. Every indexable route was loaded directly and refreshed, covering all
six services, five courses, seven projects, listing pages, About, Contact and
legal pages in both languages. Original main/H1 nodes were preserved with no
recoverable hydration/bootstrap errors or missing local assets.
Those cases do not carry browser-only retry state across a language switch. The
additional stateful-history failure below supersedes any blanket routing signoff.

## Release blocker: stateful language-switch history

The focused CSR/SSG A/B uses synthetic data and blocked external requests. Both
candidate cases obtain the draft through an **actual mocked failed submission
and the retry link**, then switch language and press Back. The CSR controls use
equivalent explicit retry history state. The ordinary CSR build returns to the
correct Contact page in both language directions.
The SSG candidate reuses the other locale's document/router on history traversal:

| Sequence | Expected Back result | Candidate observed result |
| --- | --- | --- |
| Arabic Contact → English → Back | Arabic Contact | Arabic URL, English/LTR boot document, **zero main elements**, empty content |
| English Contact → Arabic → Back | English Contact | English URL, Arabic/RTL boot document, **incorrect 404 UI** |

Back produces no new HTTP response in these observations. Direct HTTP loading of
both URLs is correctly 200. Refresh requests the matching static document and
restores the form. Thus an incorrect 404 UI here must not be reported as a server
404 response. Initial hydration still reports zero recoverable errors because
the failure happens later during history navigation.

Root cause: the path-mode state-preserving branch in
`src/contexts/LanguageContext.tsx` calls `history.pushState` with the counterpart
URL/state and then `location.reload`. The resulting history traversal can retain
the reloaded document. `ssg/entry-client.tsx` fixes BrowserRouter's basename to the
boot language, and `ssg/App.tsx` fixes the routing language to that boot state.
The retained document therefore cannot reconcile the other locale's history URL.
The stateless branch uses real document navigation and passed the 26-pair history
matrix, explaining why the preceding checks missed this branch.

Evidence: `stateful-history-report.json` records both CSR controls and both
candidate directions, document language, bootstrap language, URL, H1/main count,
history state flags and refresh recovery. Screenshots:
`stateful-ssg-ar-back.png` and `stateful-ssg-en-back.png`.

The same test performs a successful **mocked** retry after switching. The active
success entry has no draft, but an older locale entry still contains its draft;
Back then refresh re-populates it. No localStorage/sessionStorage or static-HTML
leak was found. Phase F's cleanup was scoped to the active entry; release review
must explicitly accept historical recovery copies or approve completion-aware
invalidation of only those retry copies.

The final focused report has no harness errors: two CSR controls pass, both
candidate Back sequences fail, and both successful-retry sequences demonstrate
the documented historical-copy retention. The earlier control attempt that
expected redundant `?lang=ar` instead of the normal bare Arabic URL is retained
separately and excluded from the final control results.

Proposed remediation for separate approval: reconcile the document/router locale
on stateful Back/Forward, or use a genuine cross-document state handoff with
approved privacy and history semantics. Preserve retry fields, query/hash and
normal navigation, and add regression tests for both directions, actual mocked
failure→retry→switch→Back/Forward, and switch→successful submission→Back/refresh.
Simply changing pushState to replaceState plus reload must not be assumed safe
for earlier same-document SPA entries. Do not introduce persistent draft storage
or rewrite unrelated browser history without approval. No fix was attempted.

## Legacy migration and Pages limitations

| Case | Local result | HTTP/SEO distinction |
| --- | --- | --- |
| Existing Arabic and new `/en/` documents | Direct load/refresh pass for all 52 | Static 200 |
| Existing `?lang=ar` and `?lang=en` | All 26 routes × both language values pass | JS `location.replace`, not HTTP 301 |
| Query values/hash | `a&b`, `x=y`, tracking and fragment retained | Canonicals intentionally omit them |
| Stateless language toggle/history | All 26 counterpart pairs pass Back/Forward with empty history state | Full localized document navigation |
| Same-language menu links | Navigation and history pass | Existing SPA behavior retained |
| Missing trailing slash | 52 local directory redirects retain query | Local 301; one existing live route also confirmed 301 |
| Old `__spa` fallback URLs | 10 representative AR/EN restorations pass | Client migration, not server permanence |
| Invalid service/course/project/generic paths | 8 cases return 404/noindex with bilingual body | One root 404 is used even for missing `/en/` paths |
| Direct thank-you URLs without send state | Both languages go to Contact | Initial noindex 200; no fake success result |
| Direct `/404.html` and `/en/404.html` | Files available | Direct file access is 200; missing URLs receive 404 |

GitHub Pages serves a custom error document from root `404.html`; it does not
select the locale-specific `en/404.html` for arbitrary English misses. The root
document therefore contains both languages while retaining its Arabic outer
language. Unknown URLs retain the 404 status; client-side navigation cannot
retroactively change an already-returned HTTP status.
[GitHub custom 404 documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)

Query-dependent HTTP 301 rules are unavailable in this static artifact. With JS
disabled, an old Arabic-path `?lang=en` request still receives the Arabic file;
the `/en/` document itself is fully English without JS. Search-engine rendering
of a JS redirect is not guaranteed. Release review must accept that migration
limitation, or separately approve hosting/proxy support if real query redirects
are mandatory. No architecture change is proposed silently here.
[Google on JavaScript redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)

The generated project-level `/ME-2026-Main/robots.txt` is not a host-level robots
policy. Google looks for `https://m-elmaghawry.github.io/robots.txt`, which currently
returns 404. This does not prohibit indexing; rely on correct per-page robots
metadata and submit the project sitemap directly. Changing host-root crawling
policy would require separately authorized control of that root site.
[Google robots.txt scope](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

## Visual and functional regression

Existing Phase 5C.2-F results remain applicable to the identical source: 174
passed matrix cases, including 28 Edge, 28 reduced-motion and 14 tablet cases.
All associated source hashes were verified. Edge was actually tested in Phase F;
this audit does not relabel old Edge checks as newly executed checks.

Fresh representative screenshot comparisons also pass: **28/28 desktop/mobile
and 14/14 tablet**, covering Home, About, BIM Training, BIM Coordination, paid
Course Detail, Portfolio 1 and Contact in both languages. Maximum changed pixels
are **0.02792%** and **0.02416%**, respectively, beneath the unchanged 2.5% limit;
H1/main/header geometry differences are zero. Evidence is under
`checkout/dist-ssr/candidate/repo/{smoke,tablet}-report.json` and its screenshots.
Each row records its capture clock and the appropriate audit baseline.
Typography remains **Noto Sans Arabic and Inter**.
Home counters use real-time capture; a paused-clock Home attempt froze the
candidate before its rolling counters/reveal finished, creating a false 3.37%
pixel flag. Real-time Home comparisons pass. Static decorative phases on other
routes use the existing controlled capture harness. No product animation, text,
font family, layout or pixel threshold was changed.

The archived Contact baseline has an unavailable-form banner, while the fresh
no-`.env` build uses valid public source defaults and enables its form. That
configuration difference changes main height by 44px. Contact is therefore
compared against a fresh CSR build with matching configuration; other pages use
the preserved approved archive. The difference is documented rather than hidden
by changing business logic or loosening the geometry threshold.

Fresh interactions verify automatic Home title/About slideshow, reduced-motion
slideshow stopping, visibility of all four stats without scrolling in both
languages, completed service reveals, menus, accordions, footer, navigation and
retry/result states. Fresh mocked forms verify seven recovered fields, refresh,
language switching, edit preservation and successful-retry cleanup. No real
EmailJS request was sent. No visitor-facing Pause/Play/speed control was added.
Six additional project-gallery checks pass across both languages and all three
viewports: open, next/previous image, Escape close and opener-focus restoration
(`extra-flows-report.json`). The new stateful-history cases remain failing as
documented above; passing earlier form checks are not presented as full acceptance.

## Performance comparison

Measurements use Chrome 158.0.8127.88, three cold contexts per pair, 390×844 mobile
(and 1440×1000 in the strict series), normal motion, real time, 100ms emulated
latency, 4Mbps download, 1Mbps upload, 4× CPU slowdown and identical gzip servers.
External integrations are blocked. LCP and CLS use browser observers; network
bytes use CDP responses. The observation window is load, font readiness and two
additional seconds. These are local lab samples, **not INP or real-user CWV**.

The primary rendering A/B uses the existing `build:gh-pages` command and SSG from
the same audited source and environment. It is not mislabeled as the actual live
deployment artifact. A production-commit reconstruction is recorded separately.

Normal within-load caching uses fresh contexts with `max-age=600`, matching the
observed live HTML/CSS/JS cache headers (`hosting-cache-and-robots.json`):

| Route | CSR median LCP | SSG median LCP | CSR max CLS | SSG max CLS | CSR/SSG median transferred bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arabic Home mobile | 3148ms | 3196ms | 0 | 0 | 480,474 / 490,998 |
| English Training mobile | 2008ms | 2028ms | 0 | 0 | 375,536 / 570,059 |
| Arabic Workshop 03 mobile | 1772ms | 1128ms | 0.128852 | 0.001352 | 483,002 / 481,530 |

The comparison was repeated against reconstructed source from the **verified
deployed commit 77ba313**. All shared locked dependency versions match the
audited toolchain. To keep network conditions controlled, its original Google
Fonts provider CSS and exact original WOFF2 bytes were replayed from the same
local server; only font origin URLs in temporary generated CSS were rewritten.
Private Actions variable values were unavailable, so public source defaults were
used. This is a controlled production-source reconstruction, not a claim to have
measured the actual CDN or reproduced its private configuration byte-for-byte.

| Route | Production-source median LCP | Candidate median LCP | Production max CLS | Candidate max CLS | Production/candidate median bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arabic Home mobile | 3176ms | 3284ms | 0 | 0 | 479,811 / 490,998 |
| English Training mobile | 1992ms | 2048ms | 0 | 0 | 375,324 / 570,059 |
| Arabic Workshop 03 mobile | 1744ms | 1088ms | 0.128863 | 0.001352 | 482,365 / 481,530 |

This independently confirms the English font-overfetch finding: approximately
**51.9% more transferred data** versus the deployed-source reconstruction.
`performance-production-commit.json` contains 18 valid loads with zero missing
resources or renderer errors. An invalid first replay attempt truncated a font
URL at a weight-list semicolon and returned 404; its complete dataset is retained
as `performance-production-invalid-fixture.json` and is excluded from conclusions.
The temporary replay fixture was corrected; no product file was changed.

Candidate CLS remains below 0.1 in all 18 valid normal-cache candidate loads
across the two paired comparisons. Home/Training
LCP changes are small; Workshop improves. Absolute Home lab LCP is over 2.5s in
both builds and is not presented as a passing field LCP score.

The **English transfer regression is material and reproducible**: the baseline
requests Inter Latin, while the candidate universally preloads Inter Latin,
Noto Arabic and Noto Latin. Unused Noto transfers add roughly 198KB before small
HTML/JS differences, producing the net **194,523-byte / 51.8% increase**. Images
transfer the same bytes in both versions. Candidate critical CSS competes with
those early font transfers. Proposed remediation, for separate approval: choose
preload/decode hints by actual route language/glyph needs while preserving the
exact approved font files/families, then repeat cold-load and visual checks.

Across all emitted client chunks, CSR JavaScript is 798,791 raw / 254,472 gzip
bytes; SSG is 800,887 raw / 255,260 gzip bytes. The 788-byte gzip difference is
small. CSS is identical: 135,600 raw / 19,975 gzip bytes. Responsive image source
selection, dimensions and lazy-loading behavior are retained and recorded.

The additional cache-disabled + `no-store` stress series has a different outcome:
Workshop candidate CLS is **0.135876** in all three runs, versus CSR about
0.128846. It includes repeated font requests and the same 34px tag/instructor
reflow diagnosed in Phase F. That is not the normal Pages-cache simulation and
does not invalidate its 0.001352 result; it demonstrates cache-policy sensitivity
in the detached font decode/preload strategy. Home LCP is also slower in that
stress profile. Preserve this evidence and recheck it when improving font hints;
do not claim unconditional font-swap elimination or hide/remove animations.

Evidence: `performance-realistic-cache.json` (18 loads),
`performance-production-commit.json` (18 valid loads), and
`performance-report.json` (24 loads), including per-request timing/bytes, LCP
element, shift sources/rectangles, CSS/font timing and image-loading state.

## Dependency and security review

The fresh npm registry audit reports **24 vulnerable package nodes: 8 high,
15 moderate, 1 low, 0 critical**. These are package nodes, not 24 distinct CVEs.
Raw results: `npm-audit.json`. Lockfile classification: 9 production-graph and
15 development-graph nodes. A read-only Rollup module inventory shows only
**five flagged packages in client chunks**; the other nineteen are build/tooling
dependencies, including four marked production by npm's dependency graph.

| Shipped package/group | Severity | Actual exposure assessment | Available remediation |
| --- | --- | --- | --- |
| Zod 3.25.76 | High | Contact uses a fixed object of bounded strings/enums, not attacker-sized collection schemas. No shared Node validation server is deployed. Affected collection-validation path is not identified as reachable here. | Advisory patched in 4.6.6; major upgrade requires separate approval and regression checks. |
| i18next 25.10.10 | Moderate | Translation resources are static and no untrusted `addResourceBundle(..., true, true)` use was found. | Patched in 26.3.4; separately review major upgrade. |
| react-router-dom/react-router 6.30.3, @remix-run/router 1.23.2 | Moderate | BrowserRouter/StaticRouter with static navigation targets and guarded legacy migration. No data-router error-deserialization hydration path. No exploitable redirect was found in tested inputs; this is an exposure assessment, not proof of immunity. | Review all overlapping redirect/SSR advisories together; some list Router 7.18.0 as patched. Do not assume a single 6.x patch or npm's boolean fix flag resolves every advisory. |

Sources: [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5),
[i18next advisory](https://github.com/advisories/GHSA-6jcc-5g8w-32mx),
[Router redirect advisory](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6),
[Router SSR advisory](https://github.com/advisories/GHSA-337j-9hxr-rhxg),
[other Router redirect advisory](https://github.com/advisories/GHSA-2j2x-hqr9-3h42).

Build-only high findings include Vite/launch-editor, brace-expansion, browserslist,
js-yaml, postcss, nanoid and source-map-js. They are absent from client chunks;
the deployed artifact has no Vite development server or Node package execution.
They still matter on developer/CI machines processing inputs. Moderate findings
cover ESLint/type tooling, selectors, browser mapping and related transitives;
esbuild's finding is low. Full per-package versions, npm scope, client inclusion,
advisory links/ranges and fix metadata are in `dependency-classification.json`;
[DEPENDENCIES.md](DEPENDENCIES.md) provides the complete readable 24-node inventory.
Compatible lock updates are offered for many build findings, but npm suggests
a typography downgrade for one transitive chain: that is not a safe automatic
instruction. No packages were upgraded and no `audit fix` command was run.

Before release, review/accept the documented residual exposure or authorize
targeted remediation separately. A successful static build is not a clean
dependency audit. No secrets or contact drafts were found in initial HTML or
bootstrap state; contact values start empty. EmailJS's service/template/public
identifiers and a CAPTCHA site key are browser-public configuration, despite
being supplied through secret/variable names in Actions. No private provider
credential or local `.env` was copied into the artifact.
That conclusion covers the audited no-`.env` build, empty contact fields,
bootstrap inspection and private-key/token/test-draft pattern checks. Actual
private Actions values were unavailable; repeat artifact inspection on the
approved production CI build without printing those values.

## Live hosting observations and limitations

Public read-only API/HTTP observations establish:

- Current remote `main` and the latest successful Pages deployment are
  **`77ba313d8617a082d349f383e876ac34013eb551`**.
- Verified successful workflow run:
  [45142045741](https://github.com/M-Elmaghawry/ME-2026-Main/actions/runs/45142045741),
  deployment 7994325071, at 23 November 2026 11:53 Asia/Riyadh.
- Live root is `https://m-elmaghawry.github.io/ME-2026-Main/`, HTTP 200.
  An existing `/about?lang=en&ref=proof` returns 301 with query preserved.
- Live HTML, JS and CSS use `max-age=600`. Host-root robots.txt returns 404.
- Live `/en/contact/` currently returns 404 because the candidate is not deployed;
  that is not a candidate simulation failure.
- `elmekawy-bim.com` DNS lookup failed in this environment. The root/custom-domain
  builds are validation variants, not verified live production domains.
- The unauthenticated Pages settings endpoint returned 404. Actual private
  Actions variables, EmailJS account authorization, CAPTCHA hostname allowlists,
  environment protection and domain settings were not accessible or certified.

These limited probes verify the existing deployment and its cache/redirect
behavior. They **do not verify the unpublished candidate on production hosting**.
No live contact submission, CAPTCHA challenge or Maps interaction was attempted.
No Safari/Firefox/physical-device or candidate Linux Node 22 result is claimed.

## Required CI/CD changes — prepared, not applied

Review [proposed-deploy.yml](proposed-deploy.yml), a complete proposed replacement
outside `.github`. It parses as YAML but has not run in GitHub Actions.

1. Keep Node 22; record/assert a version satisfying locked jsdom's 22.22.2 floor.
2. Keep `npm ci`, lint and the existing production TypeScript checks; add SSG/POC
   TypeScript and all existing SEO tests through `npm test`.
3. Replace the deployment build command with `build:ssg-candidate -- --variant repo
   --base "$VITE_BASE_PATH" --site-url "$VITE_SITE_URL"`. The generator needs explicit
   CLI values; merely keeping the VITE environment variables does not replace its
   argument defaults. Preserve all four EmailJS/CAPTCHA environment mappings.
4. Build root/custom fixtures before `test:ssg`: its current contract suite expects
   all three variants. Upload **only `./dist-ssr/candidate/repo/site`** instead of
   `./dist`. Never upload the candidate parent directory or contact fixture.
5. Add a build-only PR path and restrict deploy to non-PR events on `main`.
   Separate PR concurrency from production and grant Pages/OIDC write permissions
   only to deploy. This permits candidate Node 22 verification without deploying
   a feature-branch dispatch. Validate repository environment rules separately.

Retain `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`, the
Pages environment and production concurrency behavior. The v3 uploader's tar
command includes `.nojekyll` and excludes `.git`/`.github`; its published v3
inputs do not include the newer main-branch hidden-files option.
[Exact upload action v3](https://raw.githubusercontent.com/actions/upload-pages-artifact/v3/action.yml)

The 48 mocked-contact/interaction browser checks are local, not included in this
workflow proposal. Some browser harnesses hardcode Windows executables and the
archived visual baseline. Linux browser automation needs separate harness
portability work or an explicitly maintained external validation stage; do not
claim the proposed Node workflow runs those browser checks.

## Release-blocking acceptance criteria

- Fix state-preserving cross-locale Back/Forward so valid Contact URLs never
  render an empty/wrong-locale document or false 404. Reproduce the exact retry
  and successful-submission sequences and define historical draft cleanup scope.
- Resolve the English font-overfetch regression without changing font families,
  content/design, hiding content or changing normal animation behavior. Rerun
  language-specific cold-load transfer, LCP, CLS and visual checks. Retain the
  cache-disabled finding and explicitly define the supported cache policy.
- Execute clean `npm ci`, all TypeScript/lint/39 Node tests and all candidate
  builds on Ubuntu Node 22.22.2+; approve the actual workflow/artifact switch.
- Dispose of the dependency findings through separately approved remediation or
  explicit documented risk acceptance. Do not auto-upgrade React or other packages.
- Verify intended Pages base/origin and required production variables/hostname
  allowlists without exposing values. Do not let root/custom test variants publish.
- Keep 52 correct indexable + 4 noindex auxiliary documents, reciprocal language
  metadata, canonical 200 mappings, valid UTF-8/zero NULs, resolved Suspense,
  preserved hydration and no functional/design regressions.
- Accept the documented query-redirect/root-404/robots limitations; if true
  query-based HTTP 301 is mandatory, approve a hosting change separately.
- Confirm a current rollback SHA/run and freeze further main pushes during cutover.

## Proposed release sequence — none executed

1. Review all 119 production-relative paths. Preserve existing commit `616197e`.
   Proposed first new commit: the cohesive SSR candidate, renderer guards,
   extracted shared APIs, pinned fonts and Phase F regressions/tests. Avoid splitting
   dependent font/generator files into intermediate broken commits.
2. Under separate approval, make a focused stateful-history/completion fix commit
   and a separate English preload/decode improvement commit. Rerun the exact
   failing sequences plus performance/regression gates. Review dependency work
   separately rather than mixing major upgrades into those changes.
3. Prepare the CI cutover and sanitized audit documentation as a separate commit.
   Push only with explicit approval; open a PR to `main`, run build-only Node 22
   checks and review the artifact contents. Preserve merge history with a merge
   commit so the release can be reverted as one reviewed PR.
4. Before merging, approve the release itself. The current main-push trigger
   automatically deploys: merging is therefore a deployment-triggering action,
   not a harmless preparatory step. Reconfirm remote main, environment protection,
   exact artifact directory, provider configuration and rollback instructions.
5. Publish only the reviewed repo/site artifact through the approved workflow.
   Record release merge SHA, source SHA, workflow run, artifact ID/digest and
   canonical base. No production action is authorized by this audit report.

## Post-deployment verification and rollback

Immediately after an approved publish, HTTP-fetch all 52 canonical files and
their CSS/JS/fonts/images from the real host. Confirm 200s, expected MIME/cache
headers and bytes; test missing-route 404/noindex and slash 301 behavior.
Run AR/EN direct navigation, refresh, legacy query/hash migration, menus, history,
reduced motion and retry mocks. Verify configured provider domains; any real test
submission requires the owner's explicit authorization and controlled mailbox.
Measure a fresh hosted mobile performance series, including the font-overfetch
fix, without calling those lab results INP or field CWV.

Inspect raw and rendered titles, H1, canonical, reciprocal hreflang, Arabic
`x-default`, sitemap and auxiliary noindex. Submit the project sitemap to the
owner's Search Console property and inspect representative old/new English URLs;
monitor indexing and 404 reports. Rankings and redirect consolidation are not
guaranteed by local tests. Rebuild when time-dependent pricing or year/date
snapshots change; static initial HTML reflects generation time even though
client pricing updates after hydration.

Rollback target verified during this audit: **77ba313d8617a082d349f383e876ac34013eb551**,
successful run **45142045741**. For an urgent owner-approved rollback within
GitHub's rerun window, re-run **all jobs** of that known successful workflow
(GitHub Actions UI, or `gh run rerun 45142045741 --repo M-Elmaghawry/ME-2026-Main`
on an authorized machine). GitHub reruns use the original SHA/ref. Rebuild all
jobs rather than assuming yesterday's one-day-retention Pages artifact still
exists. Keep the workflow enabled; avoid another main push racing the rollback.
[GitHub rerun behavior](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs)

Verify the restored deployment's SHA/status, Arabic default, old English query
flow, direct routes, assets and contact configuration. Rollback removes the new
`/en/` documents, so confirm any emergency indexing implications. Then prepare a
reviewed revert PR for the release merge to align `main` with the restored state;
retain the development branch for remediation. Do not reset or force-push main.
If the rerun window has expired, create a separately approved rollback branch/tag
at the recorded SHA and rebuild/deploy its original workflow. No rollback was run.

## Evidence and reproduction

All audit outputs are retained under `dist-ssr/phase5c3-a-1795521922910/`.
The ordinary browser/visual/interaction/mock suites contain **247 passing cases**
including six gallery checks. The additional stateful A/B has two passing CSR
controls and **two failing candidate directions**, with associated cleanup
observations. Do not combine the earlier passing counts into a release signoff.

| Evidence | Purpose |
| --- | --- |
| `source-baseline.json`, `git-inventory.json`, `GIT-INVENTORY.md` | Preservation and full production-relative inventory |
| `checks.json`, `npm-ci-result.json`, named logs | Clean-install and fresh Node 24 checks |
| `html-hosting-report.json` | 56 initial documents, 52 canonical mappings, 506 assets/links, artifact constraints |
| `browser-hosting-report.json` | 151 ordinary direct/refresh/legacy/history cases |
| `checkout/dist-ssr/candidate/repo/{smoke,tablet}-report.json` | 42 fresh visual cases and per-case baseline/capture notes |
| `checkout/dist-ssr/candidate/interaction-report.json` | 38 fresh interaction cases |
| `mocked-contact/contact-report.json` | 10 fresh mocked-contact cases, zero real submissions |
| `extra-flows-report.json` | Six project-gallery passes and initial historical-state observations |
| `stateful-history-report.json`, `stateful-ssg-*-back.png` | Confirmed blocking history/content failures and completed-draft recovery |
| `performance-*.json`, `production-baseline.json` | 60 valid paired lab loads across three profiles; invalid replay attempt kept separately |
| `npm-audit.json`, `dependency-classification.json`, `DEPENDENCIES.md` | Current registry risk, dependency scope and shipped-module inventory |
| `hosting-*.json` | Public live-site/cache/deployment observations |
| `proposed-deploy.yml`, `proposed-workflow.diff` | Review-only workflow changes; not activated |
| `validation-summary.json` | Final machine-readable audit outcome and preservation checks |

From the original repository root, the temporary audit entry points can reproduce
the findings:

```powershell
node dist-ssr/phase5c3-a-1795521922910/audit-html.mjs
node dist-ssr/phase5c3-a-1795521922910/audit-browser.mjs
node dist-ssr/phase5c3-a-1795521922910/audit-stateful-history.mjs
node dist-ssr/phase5c3-a-1795521922910/audit-performance.mjs --realistic-cache
node dist-ssr/phase5c3-a-1795521922910/audit-performance.mjs --deployed-source
```

These use installed Windows Chrome and the retained isolated builds; browser
process permission may be required. They do not execute the workflow proposal or
any release action. Further product work requires a separately reviewed fix phase.

Final preservation check: **all 410 original source hashes match**, the 86-path
Git status is unchanged, branch/HEAD remain as recorded, and the active workflow
is unchanged. All 168 fresh candidate documents were independently read back with
valid UTF-8, zero NUL bytes and zero replacement characters. The audit is complete;
the candidate remains **BLOCKED** by the confirmed stateful-history regression.
