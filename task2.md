# Raw2D Task Queue 2

This queue starts after `task.md` T110 / `v1.0.2`. Work one task at a time, in order.

## Auto Mode Rules

- Pick the first task with `Status: pending`.
- Set only that task to `in_progress`.
- Keep changes scoped to the current task.
- Verify before marking `completed`.
- Bump all package versions to the listed task version.
- Commit with the listed commit message.
- Continue to the next pending task automatically unless verification fails or the user says stop.
- Push only on phase release tasks or when the user explicitly asks.
- Keep every file below 250 lines; split before crossing the limit.
- Use strict TypeScript, avoid `any`, keep modules isolated, and update docs/readmes/examples/tests for user-facing behavior.

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

Manual browser check is required for docs, examples, demos, Canvas/WebGL rendering, and interaction tasks.

## GPT-5.5 Low-Token Prompt

```text
Raw2D task runner.
Read AGENTS.md, task.md, and task2.md. Pick first pending task in task2.md.
Set it in_progress. Implement only that task.
Rules: strict TS, no any, isolated modules, files <250 lines, docs/examples/tests for user-facing changes.
Verify: browser check + npm run typecheck + npm test + npm run build:docs + npm run test:browser + npm run pack:check -- --silent + npm run test:consumer + git diff --check.
Bump all package versions to task Version.
Set task completed. Commit with task Commit message.
Continue next task automatically unless blocked/failing.
Push only on phase release tasks or explicit user request.
```

## Phase 9: Post-Release Consumer Audit

- T111 | Version: v1.1.0 | Status: completed | Goal: Create fresh npm install audit plan for `raw2d`. | Verify: audit doc review. | Commit: `Add post release audit plan`
- T112 | Version: v1.1.1 | Status: completed | Goal: Add automated fresh install smoke for umbrella package. | Verify: generated app builds. | Commit: `Add umbrella install smoke`
- T113 | Version: v1.1.2 | Status: completed | Goal: Add focused package install smoke for core/canvas/webgl/sprite/text. | Verify: generated app builds. | Commit: `Add focused package install smoke`
- T114 | Version: v1.1.3 | Status: completed | Goal: Add `raw2d-mcp` separate install smoke. | Verify: MCP import works outside umbrella. | Commit: `Add MCP install smoke`
- T115 | Version: v1.1.4 | Status: completed | Goal: Add `raw2d-react` separate install smoke. | Verify: React consumer app builds. | Commit: `Add React install smoke`
- T116 | Version: v1.1.5 | Status: completed | Goal: Verify published npm README snippets compile in a temp app. | Verify: snippet test. | Commit: `Test README snippets`
- T117 | Version: v1.1.6 | Status: completed | Goal: Verify docs Canvas snippets compile in a temp app. | Verify: snippet test. | Commit: `Test Canvas docs snippets`
- T118 | Version: v1.1.7 | Status: completed | Goal: Verify docs WebGL snippets compile in a temp app. | Verify: snippet test. | Commit: `Test WebGL docs snippets`
- T119 | Version: v1.1.8 | Status: completed | Goal: Verify docs interaction snippets compile in a temp app. | Verify: snippet test. | Commit: `Test interaction docs snippets`
- T120 | Version: v1.1.9 | Status: completed | Goal: Add post-release npm/CDN/browser audit report. | Verify: report review. | Commit: `Add post release audit report`
- T121 | Version: v1.1.10 | Status: completed | Goal: Phase 9 release and publish. | Verify: phase release verification. | Commit: `Release post release audit phase`

## Phase 10: Product-Quality Examples

- T122 | Version: v1.2.0 | Status: completed | Goal: Create examples index and shared example style. | Verify: examples route/browser. | Commit: `Add examples index`
- T123 | Version: v1.2.1 | Status: completed | Goal: Add basic Canvas scene example. | Verify: browser visual check. | Commit: `Add Canvas basic example`
- T124 | Version: v1.2.2 | Status: completed | Goal: Add WebGL sprite batching example. | Verify: WebGL visual/stats check. | Commit: `Add WebGL sprite example`
- T125 | Version: v1.2.3 | Status: completed | Goal: Add texture atlas example. | Verify: atlas sprites render. | Commit: `Add texture atlas example`
- T126 | Version: v1.2.4 | Status: completed | Goal: Add interaction select/drag/resize example. | Verify: browser interaction check. | Commit: `Add interaction example`
- T127 | Version: v1.2.5 | Status: completed | Goal: Add camera pan/zoom example. | Verify: browser interaction check. | Commit: `Add camera controls example`
- T128 | Version: v1.2.6 | Status: completed | Goal: Add ShapePath/advanced drawing example. | Verify: Canvas and WebGL comparison. | Commit: `Add shape path example`
- T129 | Version: v1.2.7 | Status: completed | Goal: Add React example app. | Verify: React build and browser check. | Commit: `Add React example app`
- T130 | Version: v1.2.8 | Status: completed | Goal: Add MCP scene JSON example. | Verify: MCP generated example builds. | Commit: `Add MCP example`
- T131 | Version: v1.2.9 | Status: completed | Goal: Add examples README with install/run instructions. | Verify: README review. | Commit: `Document examples`
- T132 | Version: v1.2.10 | Status: completed | Goal: Add browser smoke tests for all examples. | Verify: examples tests pass. | Commit: `Test examples routes`
- T133 | Version: v1.2.11 | Status: completed | Goal: Phase 10 release and publish. | Verify: phase release verification. | Commit: `Release examples phase`

## Phase 11: Docs Product Polish

- T134 | Version: v1.3.0 | Status: completed | Goal: Redesign docs beginner path: install, canvas, scene, shape, texture, WebGL. | Verify: browser route check. | Commit: `Polish docs beginner path`
- T135 | Version: v1.3.1 | Status: completed | Goal: Improve docs search scoring and keyboard behavior. | Verify: search browser check. | Commit: `Improve docs search`
- T136 | Version: v1.3.2 | Status: completed | Goal: Add grouped docs navigation descriptions. | Verify: navigation browser check. | Commit: `Polish docs navigation`
- T137 | Version: v1.3.3 | Status: pending | Goal: Make every docs code block copy-paste friendly with package imports. | Verify: snippet tests. | Commit: `Polish docs imports`
- T138 | Version: v1.3.4 | Status: pending | Goal: Add small/full example toggle consistency across docs. | Verify: browser visual check. | Commit: `Polish docs examples`
- T139 | Version: v1.3.5 | Status: pending | Goal: Polish Hindi/Hinglish docs manually for natural wording. | Verify: language browser check. | Commit: `Polish Hinglish docs`
- T140 | Version: v1.3.6 | Status: pending | Goal: Improve README and /readme route for v1 install and package split. | Verify: README route check. | Commit: `Polish v1 README`
- T141 | Version: v1.3.7 | Status: pending | Goal: Add Canvas vs WebGL decision guide with practical examples. | Verify: docs route check. | Commit: `Polish renderer guide`
- T142 | Version: v1.3.8 | Status: pending | Goal: Add docs glossary for scene, renderer, batch, atlas, bounds, hit testing. | Verify: glossary route check. | Commit: `Add docs glossary`
- T143 | Version: v1.3.9 | Status: pending | Goal: Add docs QA automation for dead links and missing topics. | Verify: QA test. | Commit: `Add docs link audit`
- T144 | Version: v1.3.10 | Status: pending | Goal: Phase 11 release and publish. | Verify: phase release verification. | Commit: `Release docs polish phase`

## Phase 12: Real-World Demo

- T145 | Version: v1.4.0 | Status: pending | Goal: Design showcase demo scope and performance targets. | Verify: design doc. | Commit: `Design Raw2D showcase`
- T146 | Version: v1.4.1 | Status: pending | Goal: Add showcase scene with many sprites and shapes. | Verify: browser visual check. | Commit: `Add showcase scene`
- T147 | Version: v1.4.2 | Status: pending | Goal: Add Canvas/WebGL renderer switch to showcase. | Verify: both renderers work. | Commit: `Add showcase renderer switch`
- T148 | Version: v1.4.3 | Status: pending | Goal: Add camera controls and minimap/viewport hints. | Verify: browser interaction check. | Commit: `Add showcase camera controls`
- T149 | Version: v1.4.4 | Status: pending | Goal: Add interaction selection and transform handles to showcase. | Verify: select/drag/resize browser check. | Commit: `Add showcase interaction`
- T150 | Version: v1.4.5 | Status: pending | Goal: Add live renderer stats panel and copy report button. | Verify: stats update. | Commit: `Add showcase stats`
- T151 | Version: v1.4.6 | Status: pending | Goal: Add atlas/static/dynamic/culling toggles to showcase. | Verify: stats change. | Commit: `Add showcase performance toggles`
- T152 | Version: v1.4.7 | Status: pending | Goal: Add showcase docs explaining what Raw2D proves. | Verify: docs route check. | Commit: `Document showcase demo`
- T153 | Version: v1.4.8 | Status: pending | Goal: Add visual/browser tests for showcase. | Verify: showcase tests pass. | Commit: `Test showcase demo`
- T154 | Version: v1.4.9 | Status: pending | Goal: Phase 12 release and publish. | Verify: phase release verification. | Commit: `Release showcase phase`

## Phase 13: MCP And Plugin Hardening

- T155 | Version: v1.5.0 | Status: pending | Goal: Add MCP CLI/server entry design without coupling to browser packages. | Verify: design doc. | Commit: `Design MCP server entry`
- T156 | Version: v1.5.1 | Status: pending | Goal: Add executable MCP server entrypoint for stdio usage. | Verify: local MCP smoke. | Commit: `Add MCP stdio entry`
- T157 | Version: v1.5.2 | Status: pending | Goal: Add MCP schema docs for every tool input/output. | Verify: docs review. | Commit: `Document MCP schemas`
- T158 | Version: v1.5.3 | Status: pending | Goal: Add MCP scene patch/update commands for multiple objects. | Verify: MCP unit tests. | Commit: `Add MCP batch update tools`
- T159 | Version: v1.5.4 | Status: pending | Goal: Add plugin command to run fresh install audit. | Verify: command test. | Commit: `Add plugin install audit command`
- T160 | Version: v1.5.5 | Status: pending | Goal: Add plugin command to generate showcase scenes. | Verify: generated scene builds. | Commit: `Add plugin showcase command`
- T161 | Version: v1.5.6 | Status: pending | Goal: Add skill update for post-release audits and examples. | Verify: skill tests. | Commit: `Update Raw2D skills`
- T162 | Version: v1.5.7 | Status: pending | Goal: Add MCP/plugin consumer documentation. | Verify: docs route check. | Commit: `Polish MCP plugin docs`
- T163 | Version: v1.5.8 | Status: pending | Goal: Add MCP/plugin package audit tests. | Verify: package audit test. | Commit: `Test MCP plugin packages`
- T164 | Version: v1.5.9 | Status: pending | Goal: Phase 13 release and publish. | Verify: phase release verification. | Commit: `Release MCP plugin hardening phase`

## Phase 14: React Fiber Preparation

- T165 | Version: v1.6.0 | Status: pending | Goal: Define React Fiber package boundary and non-goals. | Verify: design doc. | Commit: `Design React fiber boundary`
- T166 | Version: v1.6.1 | Status: pending | Goal: Audit renderer API stability for React reconciliation needs. | Verify: API audit. | Commit: `Audit React renderer API needs`
- T167 | Version: v1.6.2 | Status: pending | Goal: Add object lifecycle hooks needed by future React Fiber adapter. | Verify: core tests. | Commit: `Add object lifecycle hooks`
- T168 | Version: v1.6.3 | Status: pending | Goal: Add reconciler data model design for JSX objects. | Verify: docs review. | Commit: `Design React reconciler model`
- T169 | Version: v1.6.4 | Status: pending | Goal: Add React docs explaining current adapter versus future Fiber. | Verify: docs route check. | Commit: `Document React fiber plan`
- T170 | Version: v1.6.5 | Status: pending | Goal: Add React example parity tests for current adapter. | Verify: React tests. | Commit: `Test React example parity`
- T171 | Version: v1.6.6 | Status: pending | Goal: Phase 14 release and publish. | Verify: phase release verification. | Commit: `Release React preparation phase`
