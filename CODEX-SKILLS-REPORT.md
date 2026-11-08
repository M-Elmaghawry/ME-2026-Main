# Codex frontend skills installation and verification

Audit date: 2026-11-07 (Asia/Riyadh). Results describe actual checks in this session.

## Result

- All 13 originally requested design/animation/extraction skills were already installed globally and tracked with the requested GitHub sources. Preserved them instead of reinstalling or overwriting them.
- Added `playwright-cli` to the global Codex discovery directory. There are now 14 frontend/browser skills in `C:\Users\pc\.agents\skills`.
- Playwright CLI 0.1.23 was already installed and matched npm's current latest version. No redundant npm global reinstall was necessary.
- Verified a real headless Chrome launch, DOM setup, button click, and resulting text assertion; closed the isolated session afterward.
- One additional upstream Transitions skill is incomplete: `transitions-ui-generation` is rejected by the skills CLI because its SKILL.md has invalid YAML. It was not installed or patched locally.
- Source code, package.json, package-lock.json, framework, global settings, and existing hooks were preserved. No commit, push, file deletion, Node upgrade, or hook activation was performed.

## Environment

| Item | Observed value |
| --- | --- |
| OS | Windows NT 10.0.26200.0, 64-bit, from .NET OSVersion |
| Shell | Windows PowerShell Desktop 5.1.26100.9711 |
| Workspace / Git root | `G:\ME-Website\ME-2026-Main` |
| Node.js | 24.14.0, `C:\Program Files\nodejs\node.exe` |
| npm / npx | Both 11.9.0, under `C:\Program Files\nodejs` |
| Git | 2.52.0.windows.1, `C:\Program Files\Git\cmd\git.exe` |
| Codex | codex-cli 0.164.0-alpha.11.1 |
| Codex executable | `C:\Users\pc\.vscode\extensions\openai.chatgpt-26.1021.22027-win32-x64\bin\windows-x86_64\codex.exe` |
| skills CLI | 1.7.6, executed through npx; not installed as another global package |
| npm global prefix | `C:\Users\pc\AppData\Roaming\npm` |
| Playwright CLI | 0.1.23, `C:\Users\pc\AppData\Roaming\npm\playwright-cli.cmd` |
| Playwright package | `C:\Users\pc\AppData\Roaming\npm\node_modules\@playwright\cli` |
| Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Edge | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |

The npm registry reports that skills 1.7.6 requires Node >=22.20.0 and Playwright CLI requires Node >=18. Taste documentation requires Node 22+. Node 24.14.0 satisfies all three; no upgrade is needed.

PowerShell blocks npm.ps1/npx.ps1 with the existing execution policy. Use `npm.cmd`, `npx.cmd`, and `playwright-cli.cmd` in this shell. This avoids changing the execution policy.

The detailed Windows CIM query was denied. The OS value above is the successfully observed .NET value; Windows edition was not verified. Codex's version command succeeded but emitted a sandbox warning about being unable to find the home directory for PATH aliases. No aliases or PATH changes were made.

## Official sources reviewed

- [Codex skill discovery and invocation](https://learn.chatgpt.com/docs/build-skills)
- [skills CLI](https://github.com/vercel-labs/skills)
- [Taste Skill](https://github.com/Leonxlnx/taste-skill)
- [Official GSAP skills](https://github.com/greensock/gsap-skills)
- [Transitions.dev](https://github.com/Jakubantalik/transitions.dev)
- [Impeccable](https://github.com/pbakaus/impeccable)
- [Designlang / design-extract](https://github.com/Manavarya09/design-extract)
- [Microsoft Playwright CLI](https://github.com/microsoft/playwright-cli)
- [React Bits installation](https://reactbits.dev/get-started/installation)
- [GSAP React integration](https://gsap.com/resources/React/)

Current documentation and CLI help were reviewed before installation. npm package metadata for skills and Playwright was also checked; no install/postinstall lifecycle script was shown in either package's scripts field. Repository skills were inspected through CLI list mode; no repository installation script was executed.

## Global frontend/browser inventory

Every path below exists and contains a SKILL.md. The 13 pre-existing skills are tracked in `C:\Users\pc\.agents\.skill-lock.json`. Playwright was installed by its own CLI, so skills CLI correctly reports it as untracked; this does not prevent Codex discovery.

| Skill | Repository | Status | Actual SKILL.md path |
| --- | --- | --- | --- |
| design-taste-frontend | Leonxlnx/taste-skill | Existing, verified | `C:\Users\pc\.agents\skills\design-taste-frontend\SKILL.md` |
| gsap-core | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-core\SKILL.md` |
| gsap-frameworks | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-frameworks\SKILL.md` |
| gsap-performance | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-performance\SKILL.md` |
| gsap-plugins | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-plugins\SKILL.md` |
| gsap-react | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-react\SKILL.md` |
| gsap-scrolltrigger | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-scrolltrigger\SKILL.md` |
| gsap-timeline | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-timeline\SKILL.md` |
| gsap-utils | greensock/gsap-skills | Existing, verified | `C:\Users\pc\.agents\skills\gsap-utils\SKILL.md` |
| transitions-dev | Jakubantalik/transitions.dev | Existing, verified | `C:\Users\pc\.agents\skills\transitions-dev\SKILL.md` |
| transitions-polish | Jakubantalik/transitions.dev | Existing, verified | `C:\Users\pc\.agents\skills\transitions-polish\SKILL.md` |
| impeccable | pbakaus/impeccable | Existing, verified | `C:\Users\pc\.agents\skills\impeccable\SKILL.md` |
| extract-design | Manavarya09/design-extract | Existing, verified | `C:\Users\pc\.agents\skills\extract-design\SKILL.md` |
| playwright-cli | microsoft/playwright-cli | Added in this session | `C:\Users\pc\.agents\skills\playwright-cli\SKILL.md` |

## Other local skills and duplicate locations

These existing system skills were found under Codex's system directory and were not modified:

- `C:\Users\pc\.codex\skills\.system\imagegen\SKILL.md`
- `C:\Users\pc\.codex\skills\.system\openai-docs\SKILL.md`
- `C:\Users\pc\.codex\skills\.system\review-agent\SKILL.md`
- `C:\Users\pc\.codex\skills\.system\skill-creator\SKILL.md`
- `C:\Users\pc\.codex\skills\.system\skill-installer\SKILL.md`

No additional direct user skills were found in `C:\Users\pc\.codex\skills`; only `.system` was present. This inventory covers the inspected local skill roots; connector/plugin-provided skills listed by the session are managed separately and were not reinstalled.

Existing alternate copies:

- `C:\Users\pc\.claude\skills\playwright-cli\SKILL.md`: existing Claude-scoped copy, preserved. The newly added `.agents` copy makes the browser skill discoverable by Codex without depending on Claude's directory.
- `G:\ME-Website\ME-2026-Main\.github\skills\impeccable\SKILL.md`: existing project copy for the GitHub/Copilot layout, preserved. Its SHA-256 differs from the global Codex copy; both identify version 4.8.0, with provider-specific metadata differences visible in their headers. They were not assumed interchangeable.
- `G:\ME-Website\ME-2026-Main\.github\agents\`: four existing Impeccable agent definitions, preserved.

No workspace `.agents/skills` or `.codex/skills` installation was found. Codex's documented repository skill location is `.agents/skills`; `.github/skills` is not that documented location. If another extension or tool loads the `.github` copy, avoid asking it and Codex to apply different versions to the same task.

## Installation and verification actions

Read-only repository enumeration used the following requested commands with `--list` appended, avoiding overwrites:

```powershell
npx.cmd --yes skills@1.7.6 add Leonxlnx/taste-skill --skill design-taste-frontend -a codex -g --list
npx.cmd --yes skills@1.7.6 add greensock/gsap-skills -a codex -g --list
npx.cmd --yes skills@1.7.6 add Jakubantalik/transitions.dev -a codex -g --list
npx.cmd --yes skills@1.7.6 add pbakaus/impeccable -a codex -g --list
npx.cmd --yes skills@1.7.6 add Manavarya09/design-extract -a codex -g --list
```

The repositories exposed 1 Taste, 8 GSAP, 2 valid Transitions, 1 Impeccable, and 1 extraction skill, all already present. Transitions also contained the invalid additional skill described below.

Executed successfully:

```powershell
playwright-cli.cmd --version
playwright-cli.cmd --help
playwright-cli.cmd install --help
playwright-cli.cmd install --skills=agents -g
npx.cmd --yes skills@1.7.6 list -g -a codex --json
```

The default `playwright-cli install --skills -g` targets `.claude/skills` in this installed version. Its documented help explicitly supports `--skills=agents`; that option installed directly into `.agents/skills` with exit code 0. The final skills CLI JSON listed all 14 skills with agent `Codex`.

Browser smoke test used a separate `codex-skills-audit` session and the system Chrome, with working directory `C:\Users\pc\AppData\Local\Temp`. It opened `about:blank`, created a synthetic button, clicked it, and asserted the updated text. Actual returned result:

```json
{"title":"Codex tools audit","clicked":true,"value":"42"}
```

The session was closed successfully. Test code remains at `C:\Users\pc\AppData\Local\Temp\codex-skills-browser-audit-20261107.js`; CLI snapshots are under that temp directory's `.playwright-cli`. No browser or OS dependency download was required.

Verification boundaries: browser control was exercised; the application's pages were not tested. Taste's full design gate, Impeccable's downloadable engine, and a real Designlang extraction were not run during this setup audit. The `designlang` global command is absent; its skill supports on-demand `npx.cmd designlang <url>`. Its runtime/browser prerequisites will need verification when an extraction is requested.

## Invocation and capabilities

Name a skill explicitly in a Codex prompt, using `$skill-name`, or describe the task for automatic matching. Examples:

| Skill | Capability / example prompt |
| --- | --- |
| design-taste-frontend | `$design-taste-frontend refine the homepage while preserving the existing brand and framework.` |
| impeccable | `$impeccable audit src/pages/Home.tsx for hierarchy, responsiveness, and accessibility.` |
| extract-design | `$extract-design extract the design system from https://example.com into a separate output directory.` |
| gsap-core | `$gsap-core build a scoped entrance tween for this component.` |
| gsap-timeline | `$gsap-timeline coordinate a multi-step hero animation.` |
| gsap-scrolltrigger | `$gsap-scrolltrigger add a scroll-linked section with reduced-motion support.` |
| gsap-react | `$gsap-react integrate this animation with useGSAP and unmount cleanup.` |
| gsap-frameworks | `$gsap-frameworks explain scoped animation cleanup for a Vue or Svelte component.` |
| gsap-plugins | `$gsap-plugins implement an SVG path animation using the appropriate plugin.` |
| gsap-utils | `$gsap-utils map pointer coordinates to a bounded animation range.` |
| gsap-performance | `$gsap-performance review this animation for layout work and frame drops.` |
| transitions-dev | `$transitions-dev animate the existing dropdown with reduced-motion support.` |
| transitions-polish | `$transitions-polish refine the existing modal timing and easing.` |
| playwright-cli | `$playwright-cli check the navigation and mobile menu on the local dev server.` |

Use `.cmd` variants for the associated terminal commands on this machine. Codex detects skill changes automatically according to current official documentation; use the next turn to select the new skill. If it is missing from the selector, start a new Codex session or reload the VS Code window. A full computer restart is unnecessary.

## Conflicts and hooks

- Taste and Impeccable overlap on design direction. For a given task, choose one primary design approach and make the current product identity and user brief explicit. Do not independently apply conflicting redesign rules.
- The GSAP skills recommend GSAP where no library is selected, but this project already uses Framer Motion extensively. Preserve that choice; introduce GSAP only for an explicitly selected requirement.
- Transitions.dev can animate properties also controlled by Framer Motion or GSAP. Give each animated property one owner and honor `prefers-reduced-motion`.
- Extraction output is reference material. Review tokens before integrating them; never replace the project's Tailwind configuration automatically.
- Taste's installed SKILL.md includes a Claude-style Stop hook definition. It searches for `gate.mjs`, runs a finish gate, can write a `.taste-skill/gate-hook-missing.txt` diagnostic, and declares a 600-second timeout. It was not registered or executed in this audit. No assumption is made that another harness has enabled it.
- Existing `G:\ME-Website\ME-2026-Main\.github\hooks\impeccable.json` defines a postToolUse command for edit/create/apply_patch, invoking the project Impeccable launcher through Bash with a five-second timeout. It may run a design scan after edits if a compatible host loads it. Its activation in other extensions was not verified, and the file was left unchanged.
- Current Impeccable documentation recommends a dedicated installer and offers a hook. That installer was deliberately not run because the requested skill is already present and hooks require separate review and approval. No hooks were enabled in this session.

## Failures, incomplete steps, and corrective actions

| Observation | Outcome / correction |
| --- | --- |
| npm.ps1 blocked by PowerShell policy | Used npm.cmd/npx.cmd; no policy change. |
| npm registry access in the sandbox failed with EACCES | Retried with approved elevated execution; registry queries succeeded. |
| CIM OS query denied | Used .NET OSVersion and architecture; no unnecessary escalation for edition details. |
| Codex version command could not create PATH aliases | Version was still returned; no settings or aliases changed. |
| Guessed skills CLI documentation subpath returned HTTP 404 | Used the official repository README and actual CLI help instead. |
| `transitions-ui-generation/SKILL.md` upstream YAML parse error | CLI skipped it at description line 3 (nested mappings in compact mappings). Other two Transitions skills are valid. Wait for an upstream YAML fix, then enumerate and install that skill explicitly if wanted. No local patch or alternate fork was installed. |
| Inline browser code hit Windows command quoting (`< was unexpected`) | Wrote literal code to a temp file and used documented `run-code --filename`; interaction test passed. |
| Designlang executable not globally installed | Skill is installed. Use its documented on-demand npx method when needed; no global runtime package or project dependency added. |

No requested valid frontend skill remains missing. The extra malformed upstream skill and unexercised design/extraction runtimes are explicitly distinguished from verified browser automation.

## Updates, reinstall, and uninstall reference

These are reference commands, not actions performed by this report. Updates overwrite installed skill content; review changes first. Uninstall commands delete managed skill/package files and should only be executed after a separate explicit uninstall request.

```powershell
# Inventory
npx.cmd --yes skills@1.7.6 list -g -a codex

# Update one tracked global skill after reviewing its upstream changes
npx.cmd --yes skills@1.7.6 update design-taste-frontend -g
# Or update all tracked global skills after review
npx.cmd --yes skills@1.7.6 update -g

# Fresh installation patterns: only use when absent, to avoid overwrites
npx.cmd --yes skills@1.7.6 add Leonxlnx/taste-skill --skill design-taste-frontend -a codex -g
npx.cmd --yes skills@1.7.6 add greensock/gsap-skills -a codex -g
npx.cmd --yes skills@1.7.6 add Jakubantalik/transitions.dev -a codex -g
npx.cmd --yes skills@1.7.6 add pbakaus/impeccable -a codex -g
npx.cmd --yes skills@1.7.6 add Manavarya09/design-extract -a codex -g

# Playwright package update and skill refresh (review before overwriting)
npm.cmd install -g @playwright/cli@latest
playwright-cli.cmd install --skills=agents -g

# Remove a specific global skill; substitute the desired installed skill name
npx.cmd --yes skills@1.7.6 remove design-taste-frontend -g -a codex
# Playwright skill is not tracked by skills' update mechanism, but is discoverable for removal
npx.cmd --yes skills@1.7.6 remove playwright-cli -g -a codex
# Remove the Playwright global CLI package separately
npm.cmd uninstall -g @playwright/cli
```

Use the same named removal pattern for each GSAP/Transitions/Impeccable/extraction skill. The Claude-scoped Playwright copy is a separate installation and is not removed by the Codex-targeted command above. Re-check CLI help when upgrading the skills CLI itself: this session used 1.7.6, whose actual help exposes `update -g`; a historical README also mentions `check`, which is not listed in this version's help.

## Recommendations for this project

The project is a React 18.3.1 application built with Vite 7.3.2, TypeScript 5.8.3, Tailwind CSS 3.4.17, shadcn/Radix components, React Router 6.30.1, and Framer Motion 12.23.26 (declared ranges in package.json). It is not a Next.js or Vue application. `next-themes` alone does not make it Next.js.

1. Preserve the current framework and visual design. Use Impeccable for targeted audits and Transitions for small interaction refinements, with Framer Motion remaining the existing animation system.
2. If React Bits is requested later, select its TypeScript + Tailwind variant compatible with Tailwind 3, inspect the component's actual dependencies, and copy/adapt its source or use the documented shadcn registry method. Example from official documentation: `npx.cmd shadcn@latest add @react-bits/SplitText-TS-TW`. This modifies project source and may add dependencies; it was not executed.
3. If a specific effect warrants GSAP, the future project-level install would be `npm.cmd install gsap @gsap/react`. Use scoped useGSAP cleanup, account for React StrictMode and reduced motion, and avoid competing transforms with existing Framer Motion components. Neither package was installed.
4. Extract external design references into a separate output directory. Review generated React/shadcn/CSS tokens against this project's Tailwind 3 configuration before adopting them.
5. Use Playwright CLI against the local Vite URL for desktop/mobile interaction checks and screenshots. The browser tooling is verified; no application test suite or build was run because no application code or dependency changed.

Initial Git status already contained untracked `.github/agents/`, `.github/hooks/`, and `.github/skills/`. Those existing files were preserved. This audit's intended workspace addition is only `CODEX-SKILLS-REPORT.md`.
