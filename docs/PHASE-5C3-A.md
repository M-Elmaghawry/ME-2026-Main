# Phase 5C.3-A — retained checkpoint findings

**BLOCKED FOR PRODUCTION RELEASE.** Audit date: 24 November 2026.

The development checkpoint preserves the [full audit](phase5c3-a/REPORT.md),
[compact validation results](phase5c3-a/validation-summary.json),
[dependency assessment](phase5c3-a/DEPENDENCIES.md),
[performance summary](phase5c3-a/performance-summary.json), and a review-only
[workflow proposal](phase5c3-a/proposed-deploy.yml). No active workflow change or
release action was performed by the audit or checkpoint.

Confirmed unresolved findings:

1. Stateful Contact language switching breaks browser Back in both directions:
   blank content or a false 404 at a valid localized Contact URL.
2. Back/refresh can recover a historical locale draft after a successful retry;
   current cleanup covers only the active history entry.
3. English Training transfers about 52% more data through unnecessary Arabic-font
   hints. Normal-cache CLS is low, but no-store stress remains cache-sensitive.
4. Node 22/Linux was not executed. The tested runtime was Node 24.19.0/npm 11.17.0;
   locked jsdom requires at least Node 22.22.2 within Node 22.
5. The npm audit has 24 unresolved findings; the retained initial classification
   is not remediation or release risk acceptance.

The main SSG pipeline, full initial HTML, language metadata, UTF-8/NUL guards and
ordinary routing/build checks pass. The additional stateful-history failures
supersede blanket acceptance based on previous passing counts.

The [standalone reproduction](../scripts/reproduce-ssg-stateful-history.mjs) uses
synthetic values, blocked external requests and a separately built mock fixture.
It intentionally exits nonzero while the blocker remains. See
[DEVELOPMENT-HANDOVER.md](DEVELOPMENT-HANDOVER.md) for setup, commands and next tasks.

Large local builds, screenshots, traces, temporary checkouts, caches and raw
request logs remain ignored. They are unnecessary for the new standalone
reproduction. Historical visual harnesses still need their archived baseline;
the checkpoint does not claim that baseline is stored in Git.
