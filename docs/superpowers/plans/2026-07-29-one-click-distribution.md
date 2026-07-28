# FIONN191 One-Click Distribution Implementation Plan

**Goal:** Give every runnable `FIONN191` repository a verified one-click use, download, or store-install entry, while establishing reusable automation and a persistent rule for future projects.

**Architecture:** A public `FIONN191/.github` repository owns the shared policy and reusable workflows. Each project keeps a thin project-specific workflow, stable artifact names, and README buttons that are added only after their targets exist. Changes are isolated in `feat/one-click-distribution` branches and merged after checks pass.

**Safety:** Preserve all existing releases and user work. Never commit credentials, publish empty artifacts, add dead links, or bypass Chrome and operating-system security controls.

---

## Task 1: Prepare an Isolated Multi-Repository Workspace

- [ ] Confirm the SN580 volume is mounted.
- [ ] Create a persistent workspace under `~/Documents/Codex/FIONN191`.
- [ ] Clone all 12 repositories without touching the dirty Runner worktree.
- [ ] Record each default branch, latest release, Pages status, build command, and dirty state.
- [ ] Create or reset only the dedicated `feat/one-click-distribution` branch in each clean clone.

## Task 2: Create `FIONN191/.github`

**Files:**

- `README.md`
- `ONE_CLICK_DISTRIBUTION.md`
- `RELEASE_CHECKLIST.md`
- `.github/workflows/reusable-pages.yml`
- `.github/workflows/reusable-extension-release.yml`
- `.github/workflows/reusable-release-checks.yml`
- `.github/workflow-templates/deploy-static-pages.yml`
- `.github/workflow-templates/package-chrome-extension.yml`
- `.github/workflow-templates/release-desktop-app.yml`

- [ ] Create the public repository if it does not exist.
- [ ] Add least-privilege reusable workflows and templates.
- [ ] Validate YAML and shell snippets.
- [ ] Commit and push the default branch.

## Task 3: Add the Persistent Future-Project Rule

**File:** `$CODEX_HOME/AGENTS.md`

- [ ] Add a concise "one-click distribution first" section.
- [ ] Require a real end-user entry, CI-produced artifacts, stable links, and no fake buttons.
- [ ] Preserve the existing SN580 storage instructions.
- [ ] Verify `~/.codex/AGENTS.md` resolves to the same persisted file.

## Task 4: Existing Desktop Releases

**Repositories:** `rosiecut`, `paircut`, `TubeLabeler`

- [ ] Inspect current workflows and release asset names.
- [ ] Preserve working builders; add only missing validation and stable asset names.
- [ ] Add bilingual or repository-language README action buttons.
- [ ] Verify each `/releases/latest/download/...` target.
- [ ] Push the feature branch, run Actions, merge after success.

## Task 5: Static Online Projects

**Repositories:** `pixel-magic-edit-shop`, `oscillator-synth`

- [ ] Add Pages deployment workflows.
- [ ] Preserve direct `file://` use while making GitHub Pages the primary user entry.
- [ ] Add "Play Online" or "Use Online" README buttons.
- [ ] Validate deployed HTML, CSS, JavaScript, and key assets.
- [ ] Merge only after the Pages URL returns successfully.

## Task 6: Hybrid Game Distribution

**Repository:** `marathon-strike`

- [ ] Configure Vite base path and Pages deployment.
- [ ] Build and smoke-test the browser game.
- [ ] Add an online-play button after deployment succeeds.
- [ ] Audit Electron Builder configuration.
- [ ] Add stable macOS / Windows release assets only if both package jobs succeed.
- [ ] Preserve the fan-project attribution and existing bilingual documentation.

## Task 7: Chrome Extension Distribution

**Repositories:** `runner-shortcut-hub`, `I2P`

- [ ] Package the exact extension root with `manifest.json` at ZIP root.
- [ ] Validate Manifest V3, version, entry files, icons, and forbidden local paths.
- [ ] Produce stable Release ZIP and Web Store submission ZIP names.
- [ ] Add a manual/tag release workflow.
- [ ] Add a Web Store publish job guarded by required GitHub Secrets.
- [ ] Do not show a store-install button until a real listing URL exists.
- [ ] Work on a clean Runner clone so current uncommitted README/screenshots remain untouched.

## Task 8: Projects Requiring Runtime Decisions

**Repositories:** `cosfix`, `fionnxanderleoportfolio`

- [ ] Run the documented tests and builds.
- [ ] For `cosfix`, publish desktop or web artifacts only if the current implementation is genuinely usable.
- [ ] For the portfolio, retain the existing AI Studio online link while documenting the server/API-key requirement.
- [ ] Do not deploy server-dependent code as a broken static Pages site.
- [ ] Add only verified buttons.

## Task 9: Placeholder Repositories

**Repositories:** `https-www.fionnxanderleo.xyz-`, `TEMP1`

- [ ] Add a short status and link to the central distribution standard.
- [ ] Do not add installation buttons or build workflows without runnable content.

## Task 10: Cross-Repository Verification and Delivery

- [ ] Run `actionlint` or an equivalent YAML/workflow audit.
- [ ] Run project-native tests and builds.
- [ ] Scan for credentials, local absolute paths, empty assets, and broken README links.
- [ ] Inspect every pushed Actions run and Pages deployment.
- [ ] Merge successful feature branches and leave failed repositories unmerged with a precise report.
- [ ] Re-query all repositories and produce a final matrix of live buttons, release assets, Pages URLs, and remaining credential-dependent steps.

