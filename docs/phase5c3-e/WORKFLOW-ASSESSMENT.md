# GitHub Actions / hosting assessment - Phase 5C.3-E

> Preserved for the 25 November 2026 development checkpoint. This is a historical phase report; pre-checkpoint HEAD/working-tree statements describe that audit. Current status and setup are in [DEVELOPMENT-HANDOVER.md](../DEVELOPMENT-HANDOVER.md). Production remains BLOCKED. References labeled local audit artifacts are intentionally excluded from Git; essential findings, advisory IDs, versions, commands and risks are retained here.

25 November 2026, Asia/Riyadh. **Proposal only. Live workflow unchanged. Release BLOCKED.**

Reviewed `.github/workflows/deploy.yml` from the preserved working tree. The existing workflow runs on pushes to `main` and `workflow_dispatch`, uses `ubuntu-latest`, `actions/setup-node@v4` with Node `22` and npm caching, installs with `npm ci`, runs lint/app TypeScript/routing/p1/images checks, configures Pages, builds `npm run build:gh-pages` and uploads `./dist`. The deploy job then publishes that artifact. This currently builds the existing CSR site, not the bilingual SSG candidate. Manual dispatch is not guarded to main in the YAML and would enter the deployment path; it was not used as an audit runner.

| Area | Current workflow | Required candidate cutover after separate approval |
| --- | --- | --- |
| Runtime | Floating Node 22 on ubuntu-latest | Verify the unchanged tree in clean Linux using a recorded patch/npm pair first. Node 22.23.5/npm 10.9.9 passed on Windows only. Pin the verified patch or enforce a compatible floor; the current jsdom 31.0.1 requires `^22.22.2`, beyond Vite's `>=22.12.0` floor. |
| Install | `npm ci` | Retain the lockfile and clean install; add `--engine-strict` and print Node/npm versions. Do not substitute `npm install` or repair the lock implicitly. |
| Checks | lint; app/config TS; routing/p1/images | Run all three TS scripts and `npm test` (also covers SEO/navigation), then all required candidate variants and `npm run test:ssg`. Browser checks belong in a validation job with explicitly provisioned browser dependencies; existing scripts have Windows executable defaults and require `CHROME_PATH` or a separately approved Linux harness. |
| Production build | `npm run build:gh-pages` -> `dist` | Keep the old build as a compatibility check; change the eventual uploaded build to the explicit SSG generator invocation below. |
| Deployment base | `${{ steps.pages.outputs.base_path }}/` | Pass this value explicitly as `--base`. Arabic stays under that base; English is `<base>en/`; assets use the base without locale. Do not hard-code `/` or duplicate `/en/` in asset paths. |
| Canonical origin | `${{ steps.pages.outputs.origin }}${{ steps.pages.outputs.base_path }}/` | Pass explicitly as `--site-url`; it must match the asset/router base. Root/custom validation domains are fixtures and must never be uploaded as production. |
| Build configuration | Six VITE variables below | Keep the public integration identifiers and current values configured in Actions, without printing them. The SSG CLI does not infer `--base` and `--site-url` solely from VITE env variables. |
| Artifact | `./dist` | Upload **only** `./dist-ssr/candidate/repo/site`. Never upload candidate parent/server output, contact fixtures, diagnostics or other variants. |
| Generated HTML | CSR route shells | 52 complete bilingual indexable pages plus four noindex auxiliaries, checked during generation. Arabic homepage at index.html; English at en/index.html. |
| Sitemap | CSR sitemap | Upload candidate `site/sitemap.xml`: exactly 52 canonical locations, reciprocal ar/en/x-default links, no thank-you/404 entries. Candidate robots points at this canonical sitemap; a repository-subpath robots file does not establish a domain-root robots policy. |
| 404 | CSR query-based recovery template | Upload the generated SSG `site/404.html`; also retain `site/en/404.html`. Pages uses the project-root 404 document for unknown URLs; do not assume it selects en/404.html automatically. Local server tests emulate Pages status behavior; live host headers/404 behavior remain unverified. Legacy migration is browser navigation, not a server 301. |
| Cache | `cache: npm` | Keep npm download caching keyed by the lockfile; make `cache-dependency-path: package-lock.json` explicit for clarity. Do not cache/reuse node_modules or previous dist outputs as clean-build evidence. |
| Permission boundary | pages/id-token permissions at workflow scope; checkout default credentials | Before security-sensitive CI remediation, separately approve job-scoped least privilege: build contents:read, deployment pages:write/id-token:write, checkout persist-credentials:false, trusted main ref and environment approval guards. Do not give untrusted validation code deployment permissions. |

After Linux verification and release approval, the **specific replacement build step** should retain the current env block and invoke:

```yaml
- name: Build bilingual static site
  env:
    VITE_BASE_PATH: ${{ steps.pages.outputs.base_path }}/
    VITE_SITE_URL: ${{ steps.pages.outputs.origin }}${{ steps.pages.outputs.base_path }}/
    VITE_EMAILJS_SERVICE_ID: ${{ secrets.VITE_EMAILJS_SERVICE_ID }}
    VITE_EMAILJS_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_TEMPLATE_ID }}
    VITE_EMAILJS_PUBLIC_KEY: ${{ secrets.VITE_EMAILJS_PUBLIC_KEY }}
    VITE_RECAPTCHA_SITE_KEY: ${{ vars.VITE_RECAPTCHA_SITE_KEY }}
  run: >-
    npm run build:ssg-candidate --
    --variant repo
    --base "$VITE_BASE_PATH"
    --site-url "$VITE_SITE_URL"
```

Change the existing upload step's `path` to `./dist-ssr/candidate/repo/site`. Keep upload/deploy action changes separate from this audit; the YAML above does not itself authorize deployment. React and its dependencies are not upgraded by this proposal. Browser-facing VITE integration IDs/site keys are not substitutes for private provider credentials; do not introduce server secret keys into Vite builds.

Add these check commands in the future validation job/steps:

```sh
node --version
npm --version
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
```

`test:ssg` requires the three variants above. Production Pages outputs must be used for the final repo artifact build; a custom domain could change the required base/origin, so the eventual build must use configure-pages output. Browser-contact validation additionally needs the isolated `contact-fixture` build using the existing diagnostics config; it must never become the deployment artifact. The historical comparison/layout scripts also depend on preserved ignored baseline artifacts and are not portable clean-run entry points as written.

For the **missing Linux proof**, use a separate non-deploy disposable runner or container based on official Node 22.23.5 Debian/bookworm, recording its exact image digest, distro, architecture, Node and npm versions. Copy the current reviewed working tree (including approved uncommitted work), not just remote HEAD. Run the commands above without copying existing node_modules/builds or .env files. Do not install WSL/Docker on this host or dispatch the existing deployment workflow for that purpose. Browser provisioning and any CI additions require a separate approved change; this audit did neither.

No Pages configuration, environment, workflow, remote branch, or deployment was changed or dispatched by this audit. This is local compatibility assessment; it does not certify actual GitHub Pages responses, Linux builds, live EmailJS/CAPTCHA, or new production content.

Primary references: npm documents `npm ci` as a frozen clean installation that does not write manifests/lockfiles ([npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci/)); setup-node documents package-manager caching rather than node_modules reuse ([setup-node](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md)); the Pages artifact action supports selecting the static artifact path ([upload-pages-artifact](https://github.com/actions/upload-pages-artifact)).
