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
- T256 | Version: v1.16.3 | Status: completed | Goal: Convert create, drag, resize, delete, layer order, and property edits to explicit Studio commands. | Verify: unit tests plus browser edit workflow check. | Commit: `Use Studio edit commands`
- T257 | Version: v1.16.4 | Status: completed | Goal: Document Studio command history and undo/redo behavior. | Verify: docs route check and Hinglish docs parity. | Commit: `Document Studio undo redo`
- T258 | Version: v1.16.5 | Status: completed | Goal: Add browser smoke coverage for undo and redo workflows. | Verify: browser test for create, move, resize, property edit, undo, redo. | Commit: `Test Studio undo redo`
- T259 | Version: v1.16.6 | Status: completed | Goal: Phase 24 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio undo/redo workflow. | Commit: `Release Studio command history phase`

## Phase 25: Studio Assets

- T260 | Version: v1.17.0 | Status: completed | Goal: Add Studio asset state for image assets with stable ids, names, dimensions, and object references. | Verify: unit tests for add, remove, and lookup behavior. | Commit: `Add Studio asset state`
- T261 | Version: v1.17.1 | Status: completed | Goal: Add Assets panel UI for local image import, selection, preview, and removal. | Verify: browser import and preview check. | Commit: `Add Studio assets panel`
- T262 | Version: v1.17.2 | Status: completed | Goal: Bind Sprite objects to imported Studio image assets while keeping scene JSON explicit. | Verify: Sprite renders imported image in Canvas and WebGL modes where supported. | Commit: `Bind Studio sprites to assets`
- T263 | Version: v1.17.3 | Status: completed | Goal: Persist asset metadata safely in saved Studio scenes and validate missing asset references on load. | Verify: save/load tests with valid and missing asset references. | Commit: `Persist Studio assets`
- T264 | Version: v1.17.4 | Status: completed | Goal: Document Studio image asset workflow and current persistence limits. | Verify: docs route and README checks. | Commit: `Document Studio assets`
- T265 | Version: v1.17.5 | Status: completed | Goal: Add browser smoke coverage for image import, Sprite binding, save, and reload warnings. | Verify: browser asset workflow test. | Commit: `Test Studio assets`
- T266 | Version: v1.17.6 | Status: completed | Goal: Phase 25 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio assets workflow. | Commit: `Release Studio assets phase`

## Phase 26: Transform Tool Coverage

- T267 | Version: v1.18.0 | Status: completed | Goal: Add resize support for Circle radius using clear bounds handles without storing negative radius. | Verify: unit and browser resize checks. | Commit: `Add Studio circle resize`
- T268 | Version: v1.18.1 | Status: pending | Goal: Add Line endpoint handles for editing start and end points. | Verify: unit and browser line endpoint checks. | Commit: `Add Studio line endpoint handles`
- T269 | Version: v1.18.2 | Status: pending | Goal: Add Text2D resize behavior using explicit text bounds or scale rules documented in Studio tools. | Verify: unit and browser text resize checks. | Commit: `Add Studio text resize`
- T270 | Version: v1.18.3 | Status: pending | Goal: Add multi-select selection bounds and group move for selected objects. | Verify: shift-select, drag group, delete group, and layer panel tests. | Commit: `Add Studio multi select`
- T271 | Version: v1.18.4 | Status: pending | Goal: Add visual regression coverage for resize handles crossing all four corners. | Verify: browser screenshot or pixel check. | Commit: `Test Studio resize visuals`
- T272 | Version: v1.18.5 | Status: pending | Goal: Phase 26 release and publish. | Verify: CI, npm latest, Cloudflare docs, transform tool workflows. | Commit: `Release Studio transform tools phase`

## Later Queues

## Phase 27: Studio Import Export Polish

- T273 | Version: v1.19.0 | Status: pending | Goal: Add explicit Studio scene validation messages for unsupported object, missing asset, and invalid geometry states. | Verify: unit tests and browser load warning check. | Commit: `Add Studio validation messages`
- T274 | Version: v1.19.1 | Status: pending | Goal: Add copy-to-code export for Canvas scenes from Studio without importing Studio internals. | Verify: unit test generated code and browser copy check. | Commit: `Add Studio Canvas code export`
- T275 | Version: v1.19.2 | Status: pending | Goal: Add copy-to-code export for WebGL scenes with explicit renderer support warnings. | Verify: unit test generated code and browser warning check. | Commit: `Add Studio WebGL code export`
- T276 | Version: v1.19.3 | Status: pending | Goal: Add Studio scene import from Raw2D MCP JSON with deterministic id handling. | Verify: import tests for valid, duplicate, and invalid ids. | Commit: `Add Studio MCP import`
- T277 | Version: v1.19.4 | Status: pending | Goal: Document Studio import, export, validation, and generated-code boundaries. | Verify: docs route and README checks. | Commit: `Document Studio import export`
- T278 | Version: v1.19.5 | Status: pending | Goal: Phase 27 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio import/export workflow. | Commit: `Release Studio import export phase`

## Phase 28: Effects Package Foundation

- T279 | Version: v1.20.0 | Status: pending | Goal: Replace the empty effects package with renderer-neutral effect descriptors and validation helpers. | Verify: unit tests for effect descriptors and package exports. | Commit: `Add effects descriptors`
- T280 | Version: v1.20.1 | Status: pending | Goal: Add Canvas effect application for opacity, shadow, blur, and grayscale using explicit renderer hooks. | Verify: Canvas renderer tests and visual route check. | Commit: `Add Canvas effects`
- T281 | Version: v1.20.2 | Status: pending | Goal: Add WebGL effect support plan and minimal shader-pass boundary without coupling effects into core. | Verify: WebGL package tests and docs boundary checks. | Commit: `Add WebGL effects boundary`
- T282 | Version: v1.20.3 | Status: pending | Goal: Add effects examples showing Canvas-first behavior and WebGL support limits. | Verify: examples tests and browser route check. | Commit: `Add effects examples`
- T283 | Version: v1.20.4 | Status: pending | Goal: Document effects package APIs, non-goals, and renderer separation rules. | Verify: docs route and package README checks. | Commit: `Document effects package`
- T284 | Version: v1.20.5 | Status: pending | Goal: Phase 28 release and publish. | Verify: CI, npm latest, Cloudflare docs, effects examples. | Commit: `Release effects foundation phase`

## Phase 29: WebGL Completion

- T285 | Version: v1.21.0 | Status: pending | Goal: Add documented SVG-to-canvas texture rasterization helper in the sprite or WebGL boundary. | Verify: unit tests and WebGL texture example check. | Commit: `Add SVG texture rasterization helper`
- T286 | Version: v1.21.1 | Status: pending | Goal: Add static batch compaction for compatible clean WebGL runs while preserving transparent diagnostics. | Verify: WebGL static cache and draw-call tests. | Commit: `Compact WebGL static batches`
- T287 | Version: v1.21.2 | Status: pending | Goal: Add advanced atlas packing diagnostics for fragmentation, wasted area, and resize suggestions. | Verify: sprite packer tests and docs snippets. | Commit: `Add atlas packing diagnostics`
- T288 | Version: v1.21.3 | Status: pending | Goal: Add WebGL renderer parity visual coverage for text, sprites, paths, culling, and static runs. | Verify: browser visual regression tests. | Commit: `Test WebGL renderer parity visuals`
- T289 | Version: v1.21.4 | Status: pending | Goal: Document WebGL completion status, remaining tradeoffs, and performance reading guide. | Verify: docs route and README checks. | Commit: `Document WebGL completion`
- T290 | Version: v1.21.5 | Status: pending | Goal: Phase 29 release and publish. | Verify: CI, npm latest, Cloudflare docs, WebGL benchmark workflow. | Commit: `Release WebGL completion phase`

## Phase 30: React Fiber Package

- T291 | Version: v1.22.0 | Status: pending | Goal: Add `raw2d-react-fiber` package scaffold with custom reconciler boundaries documented. | Verify: package metadata, export map, and build tests. | Commit: `Scaffold React Fiber package`
- T292 | Version: v1.22.1 | Status: pending | Goal: Implement host config for Rect, Circle, Line, Text2D, Sprite, Group2D, and material props. | Verify: reconciler unit tests for create, update, and remove. | Commit: `Add React Fiber host config`
- T293 | Version: v1.22.2 | Status: pending | Goal: Add lifecycle-safe texture and asset handling for React Fiber sprites. | Verify: consumer tests for mount, update, unmount, and texture cleanup. | Commit: `Add React Fiber asset lifecycle`
- T294 | Version: v1.22.3 | Status: pending | Goal: Add React Fiber interaction bridge for selection, drag, resize, and camera controls as optional helpers. | Verify: browser React example workflow. | Commit: `Add React Fiber interaction helpers`
- T295 | Version: v1.22.4 | Status: pending | Goal: Add React Fiber examples and migration guide from `raw2d-react`. | Verify: examples tests and docs route check. | Commit: `Document React Fiber package`
- T296 | Version: v1.22.5 | Status: pending | Goal: Phase 30 release and publish. | Verify: CI, npm latest, Cloudflare docs, React consumer installs. | Commit: `Release React Fiber phase`

## Phase 31: MCP Studio Automation

- T297 | Version: v1.23.0 | Status: pending | Goal: Add MCP scene edit plans for Studio-safe create, update, delete, reorder, and asset-reference operations. | Verify: MCP unit tests for deterministic plans. | Commit: `Add MCP Studio edit plans`
- T298 | Version: v1.23.1 | Status: pending | Goal: Add MCP validators for Studio scene JSON including assets, commands, and renderer warnings. | Verify: schema tests for valid and invalid Studio scenes. | Commit: `Add MCP Studio validation`
- T299 | Version: v1.23.2 | Status: pending | Goal: Add MCP generated Studio examples that round-trip through save/load and renderer adapters. | Verify: generated example build and scene validation tests. | Commit: `Add MCP Studio examples`
- T300 | Version: v1.23.3 | Status: pending | Goal: Document MCP Studio automation boundaries and agent-safe workflows. | Verify: docs route and README checks. | Commit: `Document MCP Studio automation`
- T301 | Version: v1.23.4 | Status: pending | Goal: Phase 31 release and publish. | Verify: CI, npm latest, Cloudflare docs, MCP install smoke. | Commit: `Release MCP Studio automation phase`

## Phase 32: Studio Advanced Editing

- T302 | Version: v1.24.0 | Status: pending | Goal: Add grouping and ungrouping in Studio using `Group2D` semantics without hiding scene hierarchy. | Verify: unit and browser group edit tests. | Commit: `Add Studio grouping`
- T303 | Version: v1.24.1 | Status: pending | Goal: Add object duplication, alignment, distribute, and snapping helpers as explicit commands. | Verify: unit and browser editing tests. | Commit: `Add Studio arrangement tools`
- T304 | Version: v1.24.2 | Status: pending | Goal: Add zoom-to-selection, fit-to-scene, and minimap helpers for large Studio scenes. | Verify: browser camera workflow tests. | Commit: `Add Studio navigation helpers`
- T305 | Version: v1.24.3 | Status: pending | Goal: Add stable Studio clipboard format for copy and paste across documents. | Verify: unit tests for clipboard serialization and browser paste check. | Commit: `Add Studio clipboard`
- T306 | Version: v1.24.4 | Status: pending | Goal: Document advanced Studio editing workflows and keyboard accessibility. | Verify: docs route and accessibility checks. | Commit: `Document Studio advanced editing`
- T307 | Version: v1.24.5 | Status: pending | Goal: Phase 32 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio advanced editing workflow. | Commit: `Release Studio advanced editing phase`

## Phase 33: V1 Final Hardening

- T308 | Version: v1.25.0 | Status: pending | Goal: Freeze public APIs across all packages and add migration notes for aliases or deprecated names. | Verify: public surface audit and type tests. | Commit: `Freeze Raw2D public API`
- T309 | Version: v1.25.1 | Status: pending | Goal: Add full renderer parity browser matrix across Canvas and WebGL examples. | Verify: browser and visual regression suite. | Commit: `Add renderer parity matrix`
- T310 | Version: v1.25.2 | Status: pending | Goal: Add final package size, tree-shaking, CDN, and fresh install audits for every public package. | Verify: audit scripts and consumer smoke tests. | Commit: `Audit final package readiness`
- T311 | Version: v1.25.3 | Status: pending | Goal: Polish docs IA, beginner path, Hinglish parity, and release checklists for v1 users. | Verify: docs build, docs tests, browser mobile checks. | Commit: `Polish v1 docs`
- T312 | Version: v1.25.4 | Status: pending | Goal: Run final bug bash for docs, examples, Studio, React, MCP, Canvas, and WebGL. | Verify: bug bash report and linked fixes. | Commit: `Run v1 bug bash`
- T313 | Version: v1.25.5 | Status: pending | Goal: Phase 33 release candidate and publish. | Verify: CI, npm latest, Cloudflare docs, CDN pinned URLs, post-release audit. | Commit: `Release Raw2D v1 candidate`
