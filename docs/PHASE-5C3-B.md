# Phase 5C.3-B — Contact navigation and draft lifecycle

25 November 2026, Asia/Riyadh. **Local implementation complete; production release remains BLOCKED.**

Repository: https://github.com/M-Elmaghawry/ME-2026-Main

Branch: `fix/seo-language-consistency`. Starting HEAD remains
`de485daffaf72be29a1a2118dcc01e1aa7823755`; these changes are uncommitted.
The initial tree was clean and matched the saved checkpoint. The Phase 5B,
5C.1, 5C.2 and 5C.2-F sources and the Phase 5C.3-A audit were preserved.
Ignored outputs were inspected; environment values were not copied into reports.
A local baseline ZIP, contact fixture and CSR build were preserved under
`dist-ssr/phase5c3-b-before-1795587167142/` before editing.

## Root causes and changes

### Stateful locale history

The stateful language switch creates a history entry with `pushState`, then
reloads to fetch the counterpart SSR document. Subsequent history traversal can
reuse that document at the previous locale's URL. Its bootstrap language and
BrowserRouter basename still belong to the other locale. React Router therefore
renders nothing or treats a valid English route as missing. This is a document
identity problem, rather than missing prerendered Contact files.

The candidate now installs a shared capture-phase history listener before
BrowserRouter starts. When the URL's locale differs from the current document,
it reloads the existing entry before the router processes it. State, index,
query and hash remain on that entry. Same-locale navigation proceeds normally.
`pageshow` is also checked for restored documents. The existing shared bilingual
404 bootstrap retains its separate behavior. The CSR query-language router does
not install this path-mode guard.

### Completed drafts in older history entries

Successful submission reset React Hook Form and replaced the active recovery
entry. Older Arabic/English history entries still contained independent copies
of the retry draft. Refresh legitimately read those copies and restored them.

Failed results and retry links now carry a `retryRevision` alongside the existing
history-only draft. A successful send rotates one non-sensitive revision in
sessionStorage. Both ContactForm and ContactResult validate the revision before
adopting browser state, after the SSR-matching render. Returning to an old error
result leads to empty Contact rather than another retry of the completed draft.
Visited stale entries have their state cleared with `replace`, preserving their
URL/query/hash. Cleanup checks the history key so it cannot replace an already
started success navigation during a React Router transition.

React Hook Form's existing delayed-hydration recovery and preservation of later
user edits remain intact. A newly failed submission after success receives the
current revision and can again be retried/refreshed.

### Necessary build/test adjustment

Sharing the retry hook between Contact and ContactResult causes Vite/Rollup to
emit Contact as a named dynamic chunk without a source facade. The candidate
manifest lookup now accepts that representation, asserts exactly one match, and
still traverses its imports/CSS. The routing test identifies real dynamic page
chunks by their included page modules and still requires all 13 lazy routes,
no page implementation in bootstrap, and the existing byte budgets. No renderer,
dependency, production build command or deployment configuration changed.

## Before/after browser evidence

Both failures were reproduced **before edits** using actual mocked failed and
successful submissions, in Chromium 158.0.8127.88. Reports contain synthetic data
only. [Before](phase5c3-b/before-history.json) and
[after](phase5c3-b/after-history.json) observations are preserved.

| Sequence, below `/ME-2026-Main/` | Before | After |
| --- | --- | --- |
| `/contact/` retry → `/en/contact/` → Back | English/LTR bootstrap at Arabic URL; zero main elements | Arabic/RTL Contact; one main; retry fields recovered |
| `/en/contact/` retry → `/contact/` → Back | Arabic/RTL bootstrap at English URL; H1 `404` | English/LTR Contact; one main; retry fields recovered |
| Successful retry in other locale → Back → refresh | Older draft recovered, both directions | All seven fields reset; stale state removed |
| Return to an older failed ContactResult after success | Historical result could offer obsolete retry | Redirects to empty Contact; no completed draft |

Additional tests cover Forward, repeated failure/retry, query parameters with
repeated keys, hash preservation, switching while on ContactResult, result
refresh, direct Contact/ContactResult, success → switch → Back, legacy drafts,
and a fresh valid retry after success. The earlier reproduction's last wait now
waits for the form rather than requiring the known stale name to reappear.

## Draft privacy and storage behavior

- Form fields remain in the existing browser history state only. They are absent
  from generated HTML, URLs, localStorage and sessionStorage. CAPTCHA tokens and
  the honeypot are never included in retry state.
- Session key: `elmekawy:contact-retry:<Vite BASE_URL>`. Its only value is a
  fixed-length, 36-character revision: initial zeros, then a random UUID after
  each success. Arabic and English share this application/tab marker.
- Storage is checked for read **and write** access before accepting a draft. The
  fixed-size initial marker reserves the space needed for a completion update.
  Only one marker per application/tab is retained; no list of attempts grows.
- Legacy unversioned history drafts are accepted only in the initial revision.
  Any successful send invalidates all earlier pending attempts in that tab,
  including unversioned copies. This intentionally avoids reviving another old
  locale/attempt after a successful contact send.
- Invalidating history is logical: browsers do not expose arbitrary older
  entries for editing. Older serialized copies may remain in browser history
  until visited; they are refused and the active state is then cleared.
- With session storage denied or read-only/full, a document-local revision keeps
  ordinary SPA retry working. A fresh document cannot establish whether that
  attempt completed elsewhere and therefore discards it. **Valid retry refresh
  and cross-document language recovery require writable sessionStorage.** This
  conservative degradation is tested; no persistent private draft fallback was
  added. No guarantee is made for arbitrary transient storage hardware failures.

## Validation

Environment: Windows, Node **24.19.0**, npm **11.17.0**, React **18.3.1**.
Node 22/Linux and Safari/Firefox are not newly verified by this phase.

| Check | Result |
| --- | --- |
| App and Vite/node TypeScript | Passed |
| Candidate SSG TypeScript | Passed |
| Phase 5C.1 TypeScript and experimental build | Passed |
| Phase 5C.1 browser preservation checks | 20 desktop/mobile cases, three interactions and two diagnostics passed |
| ESLint | Zero errors; eight existing Fast Refresh warnings |
| Existing automated suite (`npm test`) | 27 passed |
| Candidate suite (`npm run test:ssg`) | 19 passed, including seven new history/lifecycle cases |
| Existing production build (`npm run build`) | Passed |
| Repository, root, custom-base candidate builds | Passed; 56 documents each |
| Mocked contact candidate build | Passed; separate diagnostic output |
| Chrome contact history suite | 40 passed; 152 hydration/metadata checkpoints |
| Edge contact history suite | 40 passed; 152 hydration/metadata checkpoints |
| CSR production-configuration mocked control | 40 passed, Arabic/English desktop/mobile |
| Existing contact retry/delayed hydration suite | 10 passed, including CSR baseline controls |
| Existing wider SSG interactions | 38 passed across all three bases |
| Original blocker reproduction | Exit 0; no findings or harness errors |
| Strict UTF-8 / NUL / U+FFFD checks | All 168 normal candidate documents and 56 fixture documents passed |
| Contact design structure | AR/EN prerendered root markup identical to preserved baseline; generated CSS identical |

All contact services were mocked; zero real EmailJS requests were attempted.
New candidate browser cases report zero recoverable hydration errors, bootstrap
errors, duplicate metadata or local asset failures. Each metadata checkpoint
requires one title, description, canonical and JSON-LD block, and three alternate
links. Direct Contact hydration preserves the prerendered main/H1. The existing
delayed-JS tests verify empty private SSR fields followed by complete recovery.

The contact suites allow Chromium's BFCache instead of disabling it. `pageshow`
reconciliation is also unit-tested. A browser can decline to cache pages;
enabled BFCache is not proof that every traversal used a persisted document.
The instrumented navigation snapshots recorded no persisted BFCache restores;
that event path is covered by the unit test rather than claimed as a measured
real-browser cache restoration.

Permanent generation integrity checks remain in force: fatal UTF-8 decoding,
zero NUL and replacement characters, resolved SSR content, metadata validation,
and local asset existence. The renderer remains `renderToReadableStream` with
`allReady`; no renderer errors are suppressed and no bytes are stripped.

Build notices remain for stale Browserslist data and the existing mixed static/
dynamic SEO import. No database/dependency upgrade was performed to silence them.
See [compact validation evidence](phase5c3-b/validation-summary.json). Large
outputs/logs/screenshots remain ignored under `dist-ssr/`.

## Reproduce

From the project root, after `npm ci` in the documented supported environment:

```text
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
npm run test:contact-history
npm run test:contact-history -- --edge
npm run test:contact-history -- --csr
node scripts/reproduce-ssg-stateful-history.mjs
node scripts/test-ssg-browser.mjs --extra
```

An installed Chrome/Edge is required; `CHROME_PATH` can select another Chromium
executable. No browser package or dependency is downloaded by these tests.
`--csr` creates an isolated CSR fixture with local mocks using the unchanged
production Vite configuration. It excludes direct/refresh ContactResult host
fallback assertions, which belong to the SSG candidate tests; CSR history,
Contact refresh and submission cleanup remain covered. Never deploy either mock
fixture. The old `test:contact-retry` additionally requires the archived CSR
baseline described in the handover; the new history suite is portable.

## Exact changed files

Runtime and candidate build:

- `src/lib/localeHistory.ts` — shared document-locale reconciliation.
- `ssg/entry-client.tsx` — installs the candidate-only guard before BrowserRouter.
- `src/lib/contactRetry.ts` — marker-only retry completion revision.
- `src/hooks/useContactRetryState.ts` — hydration-safe validity and stale cleanup.
- `src/components/ContactForm.tsx` — attaches revisions, invalidates on success,
  clears an invalidated recovered form.
- `src/pages/ContactResult.tsx` — validates results and passes retry revision.
- `src/types/contact.ts` — optional revision for legacy-state compatibility.
- `src/contexts/LanguageContext.tsx` — comment only; existing state transfer retained.
- `scripts/build-ssg.mjs` — named dynamic Contact chunk resolution.

Tests and commands:

- `scripts/test-contact-history.mjs` — portable mocked history/browser suite and CSR control.
- `tests/ssg-contact-history.test.mjs` — six base/locale guards and lifecycle test.
- `tests/routing.test.mjs` — lazy-page module identity assertion.
- `scripts/test-contact-retry.mjs` — verifies marker-only persistence.
- `scripts/reproduce-ssg-stateful-history.mjs` — allows a successful clean form outcome.
- `package.json` — `test:contact-history` command only.

Documentation/evidence:

- `docs/DEVELOPMENT-HANDOVER.md`.
- `docs/PHASE-5C3-B.md`.
- `docs/phase5c3-b/before-history.json`.
- `docs/phase5c3-b/after-history.json`.
- `docs/phase5c3-b/validation-summary.json`.

## Remaining release work

The two Contact regressions are resolved in local validation. The release remains
**BLOCKED** for the English Training font overfetch (~52%), unverified Node 22/
Linux compatibility and unresolved dependency audit findings (24 in the existing
audit). Hosting/deployment cutover approval and final readiness review are still
separate gates. Phase 5C.3-A remains the historical blocked audit.

Proceed to a separately reviewed font-hint optimization and Node 22/Linux
validation phase, preserving Noto Sans Arabic, Inter, content, animation and
design. Re-audit the remaining gates before any release approval. No commit,
push, merge, deployment, dependency upgrade or production workflow change was
performed in this phase; `main` remains at
`77ba313d8617a082d349f383e876ac34013eb551`.
