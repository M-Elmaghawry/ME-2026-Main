> Archived Phase 5C.3-A audit, before the development checkpoint. Git counts and statements about uncommitted work describe audit time. Current setup/status: [DEVELOPMENT-HANDOVER.md](../DEVELOPMENT-HANDOVER.md). Original large evidence folders are intentionally excluded from Git.

# Dependency package-node inventory

Registry audit: 24 package nodes; 8 high, 15 moderate, 1 low, no critical. Lockfile flags identify 9 production-graph and 15 development nodes. Read-only client-bundle module inspection identifies five shipped flagged packages and 19 build/tooling packages. Presence in the production dependency graph does not imply browser exposure. See REPORT.md for API reachability assessment and release gates. No remediation was executed.

| Package | Installed versions | Severity | npm graph | In client chunks | npm remediation metadata |
| --- | --- | --- | --- | --- | --- |
| `@humanfs/node` | 0.16.7 | moderate | development | No | Fix offered; review full advisory overlap |
| `@remix-run/router` | 1.23.2 | moderate | production | Yes | Fix offered; review full advisory overlap |
| `@tailwindcss/typography` | 0.5.19 | moderate | development | No | {"name":"@tailwindcss/typography","version":"0.5.4","isSemVerMajor":true} |
| `@typescript-eslint/eslint-plugin` | 8.57.2 | moderate | development | No | Fix offered; review full advisory overlap |
| `@typescript-eslint/parser` | 8.57.2 | moderate | development | No | Fix offered; review full advisory overlap |
| `@typescript-eslint/type-utils` | 8.57.2 | moderate | development | No | Fix offered; review full advisory overlap |
| `@typescript-eslint/typescript-estree` | 8.57.2 | moderate | development | No | Fix offered; review full advisory overlap |
| `@typescript-eslint/utils` | 8.57.2 | moderate | development | No | Fix offered; review full advisory overlap |
| `baseline-browser-mapping` | 2.10.12 | moderate | development | No | Fix offered; review full advisory overlap |
| `brace-expansion` | 5.0.5, 1.1.13 | high | development | No | Fix offered; review full advisory overlap |
| `browserslist` | 4.28.1 | high | development | No | Fix offered; review full advisory overlap |
| `esbuild` | 0.27.7 | low | development | No | Fix offered; review full advisory overlap |
| `i18next` | 25.10.10 | moderate | production | Yes | {"name":"i18next","version":"27.2.7","isSemVerMajor":true} |
| `js-yaml` | 4.1.1 | high | development | No | Fix offered; review full advisory overlap |
| `minimatch` | 10.2.4 | moderate | development | No | Fix offered; review full advisory overlap |
| `nanoid` | 3.3.11 | high | production | No | Fix offered; review full advisory overlap |
| `postcss` | 8.5.8 | high | production | No | Fix offered; review full advisory overlap |
| `postcss-selector-parser` | 6.1.2, 6.0.10 | moderate | production | No | {"name":"@tailwindcss/typography","version":"0.5.4","isSemVerMajor":true} |
| `react-router` | 6.30.3 | moderate | production | Yes | Fix offered; review full advisory overlap |
| `react-router-dom` | 6.30.3 | moderate | production | Yes | Fix offered; review full advisory overlap |
| `source-map-js` | 1.2.1 | high | production | No | Fix offered; review full advisory overlap |
| `typescript-eslint` | 8.57.2 | moderate | development | No | Fix offered; review full advisory overlap |
| `vite` | 7.3.2 | high | development | No | Fix offered; review full advisory overlap |
| `zod` | 3.25.76 | high | production | Yes | {"name":"zod","version":"4.6.7","isSemVerMajor":true} |

Full advisory names, ranges, links, node paths and chunks are retained in `dependency-classification.json`. npm recommendations are evidence, not authorization to upgrade or downgrade.
