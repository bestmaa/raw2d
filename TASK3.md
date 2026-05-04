# Raw2D Task Queue 3

This queue starts after `task2.md` T171 / `v1.6.6`. Work one task at a time, in order.

## Auto Mode Rules

- Pick the first task with `Status: pending`.
- Set only that task to `in_progress`.
- Keep changes scoped to the current task.
- Verify before marking `completed`.
- Bump all package versions to the listed task version.
- Commit with the listed commit message.
- Continue to the next pending task automatically unless verification fails or the user says stop.
- Push only on phase release tasks or when the user explicitly asks.
- Add release notes on phase release tasks.
- Keep every file below 250 lines; split before crossing the limit.
- Use strict TypeScript, avoid `any`, keep modules isolated, and update docs/readmes/examples/tests for user-facing behavior.
- Manually verify docs, examples, demos, Canvas/WebGL rendering, and interaction in a browser.

## Standard Verification

```powershell
npm run typecheck
npm test
npm run build:docs
npm run test:browser
npm run pack:check -- --silent
npm run test:consumer
git diff --check
```

## GPT-5.5 Low-Token Prompt

```text
Raw2D task runner.
Read AGENTS.md, task.md, task2.md, and TASK3.md. Pick first pending task in TASK3.md.
Set it in_progress. Implement only that task.
Rules: strict TS, no any, isolated modules, files <250 lines, docs/examples/tests for user-facing changes.
Verify: browser check + npm run typecheck + npm test + npm run build:docs + npm run test:browser + npm run pack:check -- --silent + npm run test:consumer + git diff --check.
Bump all package versions to task Version.
Set task completed. Commit with task Commit message.
Continue next task automatically unless blocked/failing.
Push only on phase release tasks or explicit user request.
Add release notes on phase release tasks.
```

## Phase 15: Public Beta Hardening

- T172 | Version: v1.7.0 | Status: completed | Goal: Add public beta hardening plan and pass/fail gates. | Verify: plan doc review. | Commit: `Plan public beta hardening`
- T173 | Version: v1.7.1 | Status: completed | Goal: Fresh install audit for `raw2d` umbrella in a new Vite app. | Verify: generated app builds and renders. | Commit: `Audit umbrella beta install`
- T174 | Version: v1.7.2 | Status: completed | Goal: Fresh install audit for `raw2d-core` plus `raw2d-canvas`. | Verify: generated app builds and renders Canvas. | Commit: `Audit Canvas focused install`
- T175 | Version: v1.7.3 | Status: completed | Goal: Fresh install audit for `raw2d-webgl` with focused packages. | Verify: generated app builds and renders WebGL. | Commit: `Audit WebGL focused install`
- T176 | Version: v1.7.4 | Status: completed | Goal: Fresh install audit for `raw2d-react`. | Verify: generated React app builds. | Commit: `Audit React beta install`
- T177 | Version: v1.7.5 | Status: completed | Goal: Add CDN smoke page and jsDelivr pinned-version check. | Verify: browser CDN route check. | Commit: `Add CDN beta smoke`
- T178 | Version: v1.7.6 | Status: completed | Goal: Audit docs snippets copied from product docs into fresh apps. | Verify: snippet compile tests. | Commit: `Audit docs snippet copy paste`
- T179 | Version: v1.7.7 | Status: completed | Goal: Add beta browser bug bash checklist for `/doc` and `/readme`. | Verify: checklist route check. | Commit: `Add docs bug bash checklist`
- T180 | Version: v1.7.8 | Status: pending | Goal: Add mobile viewport checks for docs navigation, search, and code blocks. | Verify: browser mobile check. | Commit: `Test docs mobile view`
- T181 | Version: v1.7.9 | Status: pending | Goal: Add dark UI overflow audit for docs, examples, benchmark, and showcase. | Verify: browser visual check. | Commit: `Audit dark UI overflow`
- T182 | Version: v1.7.10 | Status: pending | Goal: Phase 15 release and publish. | Verify: phase release verification. | Commit: `Release public beta hardening phase`

## Phase 16: Beginner Docs Flow

- T183 | Version: v1.8.0 | Status: pending | Goal: Add Start Here docs path for first-time users. | Verify: browser docs route check. | Commit: `Add Start Here docs`
- T184 | Version: v1.8.1 | Status: pending | Goal: Polish Canvas-first docs with smallest working scene. | Verify: snippet and browser check. | Commit: `Polish Canvas first docs`
- T185 | Version: v1.8.2 | Status: pending | Goal: Polish WebGL-when-needed docs with performance tradeoffs. | Verify: docs route check. | Commit: `Polish WebGL decision docs`
- T186 | Version: v1.8.3 | Status: pending | Goal: Polish React current adapter versus future Fiber docs. | Verify: React docs route check. | Commit: `Polish React beta docs`
- T187 | Version: v1.8.4 | Status: pending | Goal: Polish MCP for AI tools docs with beginner commands. | Verify: MCP docs route check. | Commit: `Polish MCP beginner docs`
- T188 | Version: v1.8.5 | Status: pending | Goal: Manually polish Hinglish docs for core beginner flow. | Verify: Hinglish route review. | Commit: `Polish Hinglish beginner docs`
- T189 | Version: v1.8.6 | Status: pending | Goal: Add next/previous navigation across beginner docs. | Verify: browser navigation check. | Commit: `Add docs next previous flow`
- T190 | Version: v1.8.7 | Status: pending | Goal: Improve docs search for partial words, aliases, and common misspellings. | Verify: search browser check. | Commit: `Improve beta docs search`
- T191 | Version: v1.8.8 | Status: pending | Goal: Add docs quality tests for beginner path coverage. | Verify: docs QA test. | Commit: `Test beginner docs path`
- T192 | Version: v1.8.9 | Status: pending | Goal: Phase 16 release and publish. | Verify: phase release verification. | Commit: `Release beginner docs phase`

## Phase 17: Product Examples Audit

- T193 | Version: v1.9.0 | Status: pending | Goal: Audit and polish basic Canvas example for npm users. | Verify: browser visual check. | Commit: `Polish Canvas example`
- T194 | Version: v1.9.1 | Status: pending | Goal: Audit and polish WebGL sprite batching example. | Verify: WebGL stats check. | Commit: `Polish WebGL example`
- T195 | Version: v1.9.2 | Status: pending | Goal: Audit and polish sprite/texture atlas example. | Verify: texture visual check. | Commit: `Polish sprite atlas example`
- T196 | Version: v1.9.3 | Status: pending | Goal: Audit and polish interaction example. | Verify: select drag resize browser check. | Commit: `Polish interaction example`
- T197 | Version: v1.9.4 | Status: pending | Goal: Audit and polish camera controls example. | Verify: pan zoom browser check. | Commit: `Polish camera example`
- T198 | Version: v1.9.5 | Status: pending | Goal: Audit and polish React example. | Verify: React example build and browser check. | Commit: `Polish React example`
- T199 | Version: v1.9.6 | Status: pending | Goal: Audit and polish benchmark page for Canvas/WebGL comparison. | Verify: benchmark browser check. | Commit: `Polish benchmark example`
- T200 | Version: v1.9.7 | Status: pending | Goal: Audit and polish showcase demo for public visitors. | Verify: showcase browser check. | Commit: `Polish showcase demo`
- T201 | Version: v1.9.8 | Status: pending | Goal: Add example copy buttons and package install notes. | Verify: examples browser check. | Commit: `Polish example copy flow`
- T202 | Version: v1.9.9 | Status: pending | Goal: Phase 17 release and publish. | Verify: phase release verification. | Commit: `Release examples audit phase`

## Phase 18: Raw2D Studio MVP Planning

- T203 | Version: v1.10.0 | Status: pending | Goal: Add Raw2D Studio product scope and non-goals. | Verify: design doc review. | Commit: `Plan Raw2D Studio`
- T204 | Version: v1.10.1 | Status: pending | Goal: Decide Studio app location and package boundary. | Verify: architecture doc review. | Commit: `Define Studio boundary`
- T205 | Version: v1.10.2 | Status: pending | Goal: Design Studio scene JSON save/load format. | Verify: schema doc review. | Commit: `Design Studio scene format`
- T206 | Version: v1.10.3 | Status: pending | Goal: Design Studio tools: select, move, resize, text, shape, sprite. | Verify: tools doc review. | Commit: `Design Studio tools`
- T207 | Version: v1.10.4 | Status: pending | Goal: Design Studio panels: layers, properties, assets, renderer stats. | Verify: panels doc review. | Commit: `Design Studio panels`
- T208 | Version: v1.10.5 | Status: pending | Goal: Add Studio MVP route placeholder without runtime coupling. | Verify: browser route check. | Commit: `Add Studio MVP shell`
- T209 | Version: v1.10.6 | Status: pending | Goal: Add Studio MVP task queue for implementation phases. | Verify: task review. | Commit: `Add Studio implementation queue`
- T210 | Version: v1.10.7 | Status: pending | Goal: Phase 18 release and publish. | Verify: phase release verification. | Commit: `Release Studio planning phase`
