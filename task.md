# Raw2D Task Queue

This queue is the working contract for moving Raw2D forward in small verified version steps. Pick the first task with `Status: pending`, mark it `in_progress`, finish it, verify it, update version, commit it, then start the next task automatically.

## Operating Rules

- Work on exactly one task at a time.
- Pick the first task with `Status: pending`.
- Change its status to `in_progress` before editing code.
- Auto mode is enabled: after one task is implemented, verified, versioned, and committed, start the next pending task automatically.
- Do not start the next task until the current task is implemented, verified, versioned, and committed.
- If verification fails, keep the same task `in_progress` and fix it before moving on.
- Stop auto mode only when verification fails, a blocker appears, browser checks cannot run, Git fails, npm workflow fails, or the user says stop/pause/review.
- Keep changes scoped to the current task.
- Preserve user changes and unrelated worktree changes.
- Keep every source, docs, test, MCP, plugin, and skill file below 250 lines.
- Split large files before they cross 250 lines.
- Use TypeScript strict mode. Avoid `any` unless absolutely unavoidable and documented.
- Keep modules isolated. Use `*.type.ts` for types/interfaces of each class/module.
- Add or update docs, README, examples, tests, browser checks, package exports, MCP tools, plugin instructions, and skills when a user-facing behavior changes.
- After every completed task, bump package versions to the task version listed below.
- After every completed task, commit with the listed commit message.
- Do not push after every task. Push only at a phase release task or when the user explicitly asks.
- At every phase release task, run full verification, push to GitHub, verify GitHub Actions/npm publish workflow, verify docs deployment, then mark the phase complete.

## Standard Verification

Run these checks for every code task unless the task explicitly says docs-only:

```powershell
npm run typecheck
npm test
npm run build:docs
npm run pack:check -- --silent
npm run test:consumer
git diff --check
```

Manual browser verification is required before marking a user-facing task complete:

```text
Open /doc, /readme, related examples, and any new route in the browser.
Use Browser Use or Playwright-style browser checks.
Verify visible output, console errors, docs search, language toggle, and interactive controls.
For rendering tasks, verify Canvas and WebGL when both are supported.
```

## Phase Release Verification

For phase release tasks, do all standard checks, then:

```powershell
git status --short
git log -1 --oneline
git push origin main
```

Then verify:

- GitHub workflow finishes successfully.
- npm packages publish from workflow when version changed.
- `https://www.npmjs.com/package/raw2d` shows the new version/readme.
- `https://raw2d.com/doc` loads the latest docs.
- jsDelivr CDN URL works after npm publish delay.

## GPT-5.5 Low-Token Prompt

```text
Raw2D task runner.
Read AGENTS.md and task.md. Pick first `Status: pending`.
Set it `in_progress`. Implement only that task.
Rules: strict TS, no any, isolated modules, *.type.ts, files <250 lines.
If user-facing: update docs/readme/examples/tests.
Verify: browser manual check + npm run typecheck + npm test + npm run build:docs + npm run pack:check -- --silent + npm run test:consumer + git diff --check.
Bump all package versions to task Version.
Set task `completed`. Commit with task Commit message.
Continue next task automatically unless blocked/failing.
Push only on phase release tasks or explicit user request.
```

## Task Format

`Task ID | Version | Status | Goal | Verify | Commit`

## Queue

### Phase 1: API Stabilization

- T001 | Version: v0.3.0 | Status: completed | Goal: Audit all public exports in `raw2d` umbrella package. | Verify: export audit test, consumer import, browser docs. | Commit: `Audit umbrella public exports`
- T002 | Version: v0.3.1 | Status: completed | Goal: Audit all public exports in `raw2d-core`. | Verify: focused package import test. | Commit: `Audit core public exports`
- T003 | Version: v0.3.2 | Status: completed | Goal: Audit all public exports in `raw2d-canvas`. | Verify: Canvas example in browser. | Commit: `Audit canvas public exports`
- T004 | Version: v0.3.3 | Status: completed | Goal: Audit all public exports in `raw2d-webgl`. | Verify: WebGL example in browser. | Commit: `Audit webgl public exports`
- T005 | Version: v0.3.4 | Status: completed | Goal: Audit `raw2d-sprite`, `raw2d-text`, `raw2d-effects`, and `raw2d-interaction` exports. | Verify: focused package imports. | Commit: `Audit focused package exports`
- T006 | Version: v0.3.5 | Status: completed | Goal: Finalize renderer naming for `Canvas`, `CanvasRenderer`, and `WebGLRenderer2D`. | Verify: docs and examples use final names. | Commit: `Stabilize renderer naming`
- T007 | Version: v0.3.6 | Status: completed | Goal: Add compatibility aliases only where they reduce breaking changes. | Verify: old and new imports work. | Commit: `Add renderer compatibility aliases`
- T008 | Version: v0.3.7 | Status: completed | Goal: Freeze object, material, texture, atlas, and interaction option names. | Verify: API docs and type tests. | Commit: `Freeze public option names`
- T009 | Version: v0.3.8 | Status: completed | Goal: Add API stability and deprecation policy docs. | Verify: `/doc` and `/readme`. | Commit: `Document API stability policy`
- T010 | Version: v0.3.9 | Status: completed | Goal: Add package export map tests for all packages. | Verify: consumer smoke. | Commit: `Test package export maps`
- T011 | Version: v0.3.10 | Status: completed | Goal: Add deprecation note helper for future breaking changes. | Verify: typecheck and docs. | Commit: `Add deprecation note helper`
- T012 | Version: v0.3.11 | Status: completed | Goal: Phase 1 release and publish. | Verify: phase release verification. | Commit: `Release API stabilization phase`

### Phase 2: Docs Polish

- T013 | Version: v0.4.0 | Status: completed | Goal: Rebuild docs navigation into grouped learning paths. | Verify: browser nav and search. | Commit: `Group docs navigation paths`
- T014 | Version: v0.4.1 | Status: completed | Goal: Add beginner path: install, canvas, scene, shape, render. | Verify: beginner flow in browser. | Commit: `Add beginner docs path`
- T015 | Version: v0.4.2 | Status: completed | Goal: Add texture path: load texture, atlas, sprite, animation. | Verify: sprite examples in browser. | Commit: `Add texture docs path`
- T016 | Version: v0.4.3 | Status: completed | Goal: Add WebGL path: renderer, support, batching, diagnostics. | Verify: WebGL docs in browser. | Commit: `Add WebGL docs path`
- T017 | Version: v0.4.4 | Status: completed | Goal: Add interaction path: pick, select, drag, resize, keyboard. | Verify: interaction example in browser. | Commit: `Add interaction docs path`
- T018 | Version: v0.4.5 | Status: completed | Goal: Improve docs search scoring for partial words. | Verify: manual search cases. | Commit: `Improve docs search scoring`
- T019 | Version: v0.4.6 | Status: completed | Goal: Improve search empty state and result highlighting. | Verify: manual search cases. | Commit: `Improve docs search feedback`
- T020 | Version: v0.4.7 | Status: completed | Goal: Add previous and next topic buttons. | Verify: browser navigation. | Commit: `Add docs previous next navigation`
- T021 | Version: v0.4.8 | Status: completed | Goal: Add topic progress indicator. | Verify: browser navigation. | Commit: `Add docs progress indicator`
- T022 | Version: v0.4.9 | Status: completed | Goal: Add copy code button to code examples. | Verify: copy in browser. | Commit: `Add docs copy code buttons`
- T023 | Version: v0.4.10 | Status: completed | Goal: Standardize small and full examples for shapes, materials, textures, WebGL, and interaction docs. | Verify: examples visible and correct. | Commit: `Standardize docs examples`
- T024 | Version: v0.4.11 | Status: completed | Goal: Manually polish Hindi/Hinglish docs for install, Canvas, WebGL, and interaction. | Verify: language toggle in browser. | Commit: `Polish Hinglish docs`
- T025 | Version: v0.4.12 | Status: completed | Goal: Add docs QA checklist page. | Verify: `/doc` route. | Commit: `Add docs QA checklist`
- T026 | Version: v0.4.13 | Status: completed | Goal: Phase 2 release and publish. | Verify: phase release verification. | Commit: `Release docs polish phase`

### Phase 3: WebGL Pipeline Transparency

- T027 | Version: v0.5.0 | Status: completed | Goal: Document `Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall`. | Verify: docs in browser. | Commit: `Document WebGL pipeline`
- T028 | Version: v0.5.1 | Status: completed | Goal: Add render list docs and practical example. | Verify: browser example. | Commit: `Document render lists`
- T029 | Version: v0.5.2 | Status: completed | Goal: Add batcher docs and practical example. | Verify: browser example. | Commit: `Document WebGL batchers`
- T030 | Version: v0.5.3 | Status: completed | Goal: Add buffer upload docs and practical example. | Verify: WebGL stats. | Commit: `Document WebGL buffers`
- T031 | Version: v0.5.4 | Status: completed | Goal: Add shader docs without hiding low-level details. | Verify: docs in browser. | Commit: `Document WebGL shaders`
- T032 | Version: v0.5.5 | Status: completed | Goal: Add draw call docs with stats example. | Verify: stats example. | Commit: `Document WebGL draw calls`
- T033 | Version: v0.5.6 | Status: completed | Goal: Expose stable WebGL diagnostics type. | Verify: type tests. | Commit: `Stabilize WebGL diagnostics`
- T034 | Version: v0.5.7 | Status: completed | Goal: Add WebGL debug overlay example. | Verify: browser overlay. | Commit: `Add WebGL debug overlay example`
- T035 | Version: v0.5.8 | Status: completed | Goal: Document context lost/restored and fallback behavior. | Verify: docs and tests. | Commit: `Document WebGL context lifecycle`
- T036 | Version: v0.5.9 | Status: completed | Goal: Document ShapePath fallback, static/dynamic batches, and texture bind reduction. | Verify: docs and examples. | Commit: `Document WebGL batching details`
- T037 | Version: v0.5.10 | Status: completed | Goal: Add WebGL pipeline browser example. | Verify: manual browser check. | Commit: `Add WebGL pipeline example`
- T038 | Version: v0.5.11 | Status: completed | Goal: Add diagnostics stability and pipeline naming tests. | Verify: automated tests. | Commit: `Test WebGL pipeline diagnostics`
- T039 | Version: v0.5.12 | Status: completed | Goal: Add pipeline architecture README section. | Verify: readme route. | Commit: `Add pipeline README section`
- T040 | Version: v0.5.13 | Status: completed | Goal: Phase 3 release and publish. | Verify: phase release verification. | Commit: `Release WebGL pipeline phase`

### Phase 4: Performance Benchmark

- T041 | Version: v0.6.0 | Status: completed | Goal: Create benchmark page route. | Verify: route loads in browser. | Commit: `Add benchmark page route`
- T042 | Version: v0.6.1 | Status: completed | Goal: Add Canvas benchmark panel. | Verify: Canvas loop visible. | Commit: `Add Canvas benchmark panel`
- T043 | Version: v0.6.2 | Status: completed | Goal: Add WebGL benchmark panel. | Verify: WebGL loop visible. | Commit: `Add WebGL benchmark panel`
- T044 | Version: v0.6.3 | Status: completed | Goal: Add object count slider and object type selector. | Verify: controls update scene. | Commit: `Add benchmark object controls`
- T045 | Version: v0.6.4 | Status: completed | Goal: Add mixed scene benchmark. | Verify: mixed objects render. | Commit: `Add mixed benchmark scene`
- T046 | Version: v0.6.5 | Status: completed | Goal: Add FPS, frame time, draw call, and texture bind display. | Verify: live stats update. | Commit: `Add benchmark stats`
- T047 | Version: v0.6.6 | Status: completed | Goal: Add static/dynamic ratio, atlas toggle, and culling toggle. | Verify: stats change. | Commit: `Add benchmark renderer controls`
- T048 | Version: v0.6.7 | Status: completed | Goal: Add pause/resume and result copy controls. | Verify: browser controls. | Commit: `Add benchmark control buttons`
- T049 | Version: v0.6.8 | Status: completed | Goal: Document when to use Canvas versus WebGL. | Verify: docs in browser. | Commit: `Document renderer choice`
- T050 | Version: v0.6.9 | Status: completed | Goal: Add benchmark limitations docs. | Verify: docs in browser. | Commit: `Document benchmark limitations`
- T051 | Version: v0.6.10 | Status: completed | Goal: Add browser smoke test for benchmark page. | Verify: test passes. | Commit: `Test benchmark route`
- T052 | Version: v0.6.11 | Status: completed | Goal: Phase 4 release and publish. | Verify: phase release verification. | Commit: `Release benchmark phase`

### Phase 5: MCP Server

- T053 | Version: v0.7.0 | Status: completed | Goal: Design `raw2d-mcp` package scope and commands. | Verify: design doc. | Commit: `Design Raw2D MCP package`
- T054 | Version: v0.7.1 | Status: completed | Goal: Add MCP package scaffold. | Verify: build and pack check. | Commit: `Scaffold Raw2D MCP package`
- T055 | Version: v0.7.2 | Status: completed | Goal: Add MCP tool to create scene JSON. | Verify: MCP unit test. | Commit: `Add MCP scene creation tool`
- T056 | Version: v0.7.3 | Status: completed | Goal: Add MCP tool to add objects to scene JSON. | Verify: MCP unit test. | Commit: `Add MCP object creation tool`
- T057 | Version: v0.7.4 | Status: completed | Goal: Add MCP tool to update object transform. | Verify: MCP unit test. | Commit: `Add MCP transform tool`
- T058 | Version: v0.7.5 | Status: completed | Goal: Add MCP tool to update material. | Verify: MCP unit test. | Commit: `Add MCP material tool`
- T059 | Version: v0.7.6 | Status: completed | Goal: Add MCP tool to inspect scene. | Verify: MCP unit test. | Commit: `Add MCP scene inspection tool`
- T060 | Version: v0.7.7 | Status: completed | Goal: Add MCP tool to validate scene. | Verify: invalid scene test. | Commit: `Add MCP scene validation tool`
- T061 | Version: v0.7.8 | Status: completed | Goal: Add MCP tools to generate Canvas and WebGL examples. | Verify: generated examples build. | Commit: `Add MCP example generation tools`
- T062 | Version: v0.7.9 | Status: completed | Goal: Add MCP tool to generate docs snippets. | Verify: docs snippet test. | Commit: `Add MCP docs snippet tool`
- T063 | Version: v0.7.10 | Status: completed | Goal: Add MCP tool to run visual tests. | Verify: visual test command. | Commit: `Add MCP visual test tool`
- T064 | Version: v0.7.11 | Status: completed | Goal: Add MCP package export audit tool. | Verify: audit output. | Commit: `Add MCP export audit tool`
- T065 | Version: v0.7.12 | Status: completed | Goal: Add MCP README, docs page, and consumer example. | Verify: docs and consumer example. | Commit: `Document Raw2D MCP package`
- T066 | Version: v0.7.13 | Status: completed | Goal: Add MCP tests and AI control boundary docs. | Verify: MCP test suite. | Commit: `Test and document MCP boundaries`
- T067 | Version: v0.7.14 | Status: completed | Goal: Phase 5 release and publish. | Verify: phase release verification. | Commit: `Release MCP phase`

### Phase 6: Codex Plugin And Skills

- T068 | Version: v0.8.0 | Status: completed | Goal: Design Raw2D Codex plugin manifest. | Verify: plugin design doc. | Commit: `Design Raw2D Codex plugin`
- T069 | Version: v0.8.1 | Status: completed | Goal: Add plugin scaffold outside runtime packages. | Verify: plugin files and docs. | Commit: `Scaffold Raw2D Codex plugin`
- T070 | Version: v0.8.2 | Status: completed | Goal: Add skill `raw2d-doc-writer`. | Verify: skill instructions. | Commit: `Add Raw2D doc writer skill`
- T071 | Version: v0.8.3 | Status: completed | Goal: Add skill `raw2d-feature-builder`. | Verify: skill instructions. | Commit: `Add Raw2D feature builder skill`
- T072 | Version: v0.8.4 | Status: completed | Goal: Add skill `raw2d-visual-check`. | Verify: skill instructions. | Commit: `Add Raw2D visual check skill`
- T073 | Version: v0.8.5 | Status: completed | Goal: Add skill `raw2d-package-audit`. | Verify: skill instructions. | Commit: `Add Raw2D package audit skill`
- T074 | Version: v0.8.6 | Status: completed | Goal: Add plugin command to scaffold a Raw2D app. | Verify: generated app builds. | Commit: `Add Raw2D app scaffold command`
- T075 | Version: v0.8.7 | Status: completed | Goal: Add plugin command to create examples. | Verify: generated example loads. | Commit: `Add Raw2D example command`
- T076 | Version: v0.8.8 | Status: completed | Goal: Add plugin command to run docs QA. | Verify: command output. | Commit: `Add Raw2D docs QA command`
- T077 | Version: v0.8.9 | Status: completed | Goal: Add plugin command to run visual pixel tests. | Verify: command output. | Commit: `Add Raw2D visual test command`
- T078 | Version: v0.8.10 | Status: completed | Goal: Add plugin command to explain renderer stats. | Verify: command output. | Commit: `Add renderer stats explanation command`
- T079 | Version: v0.8.11 | Status: completed | Goal: Add plugin README, docs page, and test workflow. | Verify: docs and workflow. | Commit: `Document Raw2D Codex plugin`
- T080 | Version: v0.8.12 | Status: completed | Goal: Phase 6 release and publish. | Verify: phase release verification. | Commit: `Release plugin and skills phase`

### Phase 7: React Fiber Later

- T081 | Version: v0.9.0 | Status: completed | Goal: Define React package goals without changing core API. | Verify: design doc. | Commit: `Design Raw2D React package`
- T082 | Version: v0.9.1 | Status: completed | Goal: Design JSX mapping for scene, camera, renderer, and objects. | Verify: docs review. | Commit: `Design Raw2D JSX mapping`
- T083 | Version: v0.9.2 | Status: completed | Goal: Create `raw2d-react` package scaffold. | Verify: build and pack check. | Commit: `Scaffold Raw2D React package`
- T084 | Version: v0.9.3 | Status: completed | Goal: Add `<Raw2DCanvas>` component. | Verify: React example. | Commit: `Add Raw2DCanvas component`
- T085 | Version: v0.9.4 | Status: completed | Goal: Add JSX primitives for Rect, Circle, Line, Sprite, and Text2D. | Verify: React example. | Commit: `Add Raw2D JSX primitives`
- T086 | Version: v0.9.5 | Status: completed | Goal: Add React docs and examples. | Verify: browser example. | Commit: `Document Raw2D React package`
- T087 | Version: v0.9.6 | Status: completed | Goal: Add React consumer tests. | Verify: consumer test. | Commit: `Test Raw2D React package`
- T088 | Version: v0.9.9 | Status: completed | Goal: Phase 7 release and publish. | Verify: phase release verification. | Commit: `Release React package phase`

### Phase 8: v1.0 Hardening

- T089 | Version: v0.10.0 | Status: completed | Goal: Audit every docs route and example route manually. | Verify: browser checklist. | Commit: `Audit docs and examples`
- T090 | Version: v0.10.1 | Status: completed | Goal: Audit all packages for accidental internals in public exports. | Verify: export audit. | Commit: `Audit public package surfaces`
- T091 | Version: v0.10.2 | Status: completed | Goal: Audit bundle size and tree-shaking behavior. | Verify: build output. | Commit: `Audit bundle size`
- T092 | Version: v0.10.3 | Status: completed | Goal: Audit README, LICENSE, NOTICE, TRADEMARKS, and npm metadata. | Verify: npm pack. | Commit: `Audit package metadata`
- T093 | Version: v0.10.4 | Status: completed | Goal: Add migration guide for pre-v1 APIs. | Verify: docs route. | Commit: `Add pre-v1 migration guide`
- T094 | Version: v0.10.5 | Status: completed | Goal: Add v1.0 release checklist. | Verify: checklist review. | Commit: `Add v1 release checklist`
- T095 | Version: v0.10.6 | Status: completed | Goal: Add docs visual QA checklist for Canvas examples. | Verify: browser checklist. | Commit: `Add Canvas docs QA checklist`
- T096 | Version: v0.10.7 | Status: completed | Goal: Add docs visual QA checklist for WebGL examples. | Verify: browser checklist. | Commit: `Add WebGL docs QA checklist`
- T097 | Version: v0.10.8 | Status: completed | Goal: Add docs visual QA checklist for interaction examples. | Verify: browser checklist. | Commit: `Add interaction docs QA checklist`
- T098 | Version: v0.10.9 | Status: pending | Goal: Add npm publish verification checklist. | Verify: checklist review. | Commit: `Add npm publish checklist`
- T099 | Version: v0.10.10 | Status: pending | Goal: Add Cloudflare docs deploy verification checklist. | Verify: checklist review. | Commit: `Add docs deploy checklist`
- T100 | Version: v0.10.11 | Status: pending | Goal: Add CDN verification checklist for jsDelivr. | Verify: checklist review. | Commit: `Add CDN verification checklist`
- T101 | Version: v0.10.12 | Status: pending | Goal: Add browser console error audit checklist. | Verify: browser checklist. | Commit: `Add browser console audit checklist`
- T102 | Version: v0.10.13 | Status: pending | Goal: Add accessibility smoke checklist for docs controls. | Verify: browser checklist. | Commit: `Add docs accessibility checklist`
- T103 | Version: v0.10.14 | Status: pending | Goal: Add release notes template. | Verify: template review. | Commit: `Add release notes template`
- T104 | Version: v0.10.15 | Status: pending | Goal: Add changelog workflow notes. | Verify: docs review. | Commit: `Add changelog workflow notes`
- T105 | Version: v0.10.16 | Status: pending | Goal: Add final package install smoke instructions. | Verify: consumer smoke. | Commit: `Add install smoke instructions`
- T106 | Version: v0.10.17 | Status: pending | Goal: Add final API freeze checklist. | Verify: checklist review. | Commit: `Add API freeze checklist`
- T107 | Version: v0.10.18 | Status: pending | Goal: Add final renderer parity checklist. | Verify: Canvas and WebGL examples. | Commit: `Add renderer parity checklist`
- T108 | Version: v0.10.19 | Status: pending | Goal: Add final MCP/plugin readiness checklist. | Verify: checklist review. | Commit: `Add MCP plugin readiness checklist`
- T109 | Version: v0.10.20 | Status: pending | Goal: Add final React package readiness checklist. | Verify: checklist review. | Commit: `Add React readiness checklist`
- T110 | Version: v1.0.0 | Status: pending | Goal: Final v1.0 release, push, publish, CDN check, and docs deployment check. | Verify: phase release verification. | Commit: `Release Raw2D v1.0`
