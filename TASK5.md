# Raw2D Task Queue 5

Status: active.

This queue starts after `TASK4.md` T251 / `v1.15.6` and the `v1.15.7` resize fix. Focus: Studio editing foundations, assets, stronger transform tools, and release reliability.

## Auto Mode Rules

- Pick the first task with `Status: pending`.
- Set only that task to `in_progress`.
- Implement only that task and keep edits scoped.
- Bump all package versions to the task version.
- Keep files below 250 lines; split before crossing the limit.
- Use strict TypeScript, avoid `any`, and keep modules isolated.
- Keep Canvas and WebGL renderer packages separate.
- Add docs/readmes/examples/tests for user-facing behavior.
- Browser-check every visible route or editor UI change.
- Commit with the listed commit message after verification.
- Continue to the next pending task automatically unless blocked or failing.
- Push only on phase release tasks or explicit user request.
- Add release notes and a release markdown file on phase release tasks.
- Publish through the GitHub tag workflow only, not manual `npm publish`, unless explicitly requested.

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

## Browser Verification

- Start the docs or Studio dev server on a free port.
- Open the changed route in the in-app browser or Playwright.
- Check visible UI, console errors, layout overflow, and core interactions.
- For Studio, verify Canvas and WebGL renderer switch behavior when available.

## GPT-5.5 Low-Token Prompt

```text
Raw2D TASK5 runner.
Read AGENTS.md, TASK4.md, TASK5.md, and STUDIO_TASKS.md.
Pick first pending task in TASK5.md. Set it in_progress.
Implement only that task. Rules: strict TS, no any, files <250 lines, isolated modules.
Add tests/docs/examples for user-facing behavior. Browser-check visible changes.
Bump all package versions to task Version.
Verify with the task Verify plus standard verification when practical.
Set task completed. Commit with task Commit message.
Continue next pending task unless blocked/failing.
Push only on phase release tasks or explicit user request.
On release tasks, add release notes, push main, tag version, verify CI/npm/Cloudflare.
```

## Hotfix Before Queue

- T252 | Version: v1.15.7 | Status: completed | Goal: Release corner-cross resize fix for Studio and `raw2d-interaction`. | Verify: npm test, docs build, pack check, GitHub tag publish workflow. | Commit: `Release resize fix`

## Phase 24: Studio Command History

- T253 | Version: v1.16.0 | Status: completed | Goal: Design Studio command history types for create, transform, material, delete, layer order, and visibility changes. | Verify: unit tests for command apply/invert behavior. | Commit: `Design Studio command history`
- T254 | Version: v1.16.1 | Status: completed | Goal: Add undo and redo state management to Studio actions without coupling commands to Canvas or WebGL. | Verify: unit tests for undo/redo stack boundaries. | Commit: `Add Studio undo redo state`
- T255 | Version: v1.16.2 | Status: completed | Goal: Wire undo and redo keyboard shortcuts and toolbar buttons in Studio. | Verify: browser keyboard and button check. | Commit: `Add Studio undo redo controls`
- T256 | Version: v1.16.3 | Status: pending | Goal: Convert create, drag, resize, delete, layer order, and property edits to explicit Studio commands. | Verify: unit tests plus browser edit workflow check. | Commit: `Use Studio edit commands`
- T257 | Version: v1.16.4 | Status: pending | Goal: Document Studio command history and undo/redo behavior. | Verify: docs route check and Hinglish docs parity. | Commit: `Document Studio undo redo`
- T258 | Version: v1.16.5 | Status: pending | Goal: Add browser smoke coverage for undo and redo workflows. | Verify: browser test for create, move, resize, property edit, undo, redo. | Commit: `Test Studio undo redo`
- T259 | Version: v1.16.6 | Status: pending | Goal: Phase 24 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio undo/redo workflow. | Commit: `Release Studio command history phase`

## Phase 25: Studio Assets

- T260 | Version: v1.17.0 | Status: pending | Goal: Add Studio asset state for image assets with stable ids, names, dimensions, and object references. | Verify: unit tests for add, remove, and lookup behavior. | Commit: `Add Studio asset state`
- T261 | Version: v1.17.1 | Status: pending | Goal: Add Assets panel UI for local image import, selection, preview, and removal. | Verify: browser import and preview check. | Commit: `Add Studio assets panel`
- T262 | Version: v1.17.2 | Status: pending | Goal: Bind Sprite objects to imported Studio image assets while keeping scene JSON explicit. | Verify: Sprite renders imported image in Canvas and WebGL modes where supported. | Commit: `Bind Studio sprites to assets`
- T263 | Version: v1.17.3 | Status: pending | Goal: Persist asset metadata safely in saved Studio scenes and validate missing asset references on load. | Verify: save/load tests with valid and missing asset references. | Commit: `Persist Studio assets`
- T264 | Version: v1.17.4 | Status: pending | Goal: Document Studio image asset workflow and current persistence limits. | Verify: docs route and README checks. | Commit: `Document Studio assets`
- T265 | Version: v1.17.5 | Status: pending | Goal: Add browser smoke coverage for image import, Sprite binding, save, and reload warnings. | Verify: browser asset workflow test. | Commit: `Test Studio assets`
- T266 | Version: v1.17.6 | Status: pending | Goal: Phase 25 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio assets workflow. | Commit: `Release Studio assets phase`

## Phase 26: Transform Tool Coverage

- T267 | Version: v1.18.0 | Status: pending | Goal: Add resize support for Circle radius using clear bounds handles without storing negative radius. | Verify: unit and browser resize checks. | Commit: `Add Studio circle resize`
- T268 | Version: v1.18.1 | Status: pending | Goal: Add Line endpoint handles for editing start and end points. | Verify: unit and browser line endpoint checks. | Commit: `Add Studio line endpoint handles`
- T269 | Version: v1.18.2 | Status: pending | Goal: Add Text2D resize behavior using explicit text bounds or scale rules documented in Studio tools. | Verify: unit and browser text resize checks. | Commit: `Add Studio text resize`
- T270 | Version: v1.18.3 | Status: pending | Goal: Add multi-select selection bounds and group move for selected objects. | Verify: shift-select, drag group, delete group, and layer panel tests. | Commit: `Add Studio multi select`
- T271 | Version: v1.18.4 | Status: pending | Goal: Add visual regression coverage for resize handles crossing all four corners. | Verify: browser screenshot or pixel check. | Commit: `Test Studio resize visuals`
- T272 | Version: v1.18.5 | Status: pending | Goal: Phase 26 release and publish. | Verify: CI, npm latest, Cloudflare docs, transform tool workflows. | Commit: `Release Studio transform tools phase`

## Later Queues

- React Fiber work starts only after Studio command history confirms object ownership rules.
- MCP Studio automation starts only after assets and command history are stable.
- Advanced editor features such as timeline animation, filters, plugin marketplace, and photo editing remain out of scope.
