# Raw2D Task Queue 4

Status: active.

This queue starts after `TASK3.md` T211 / `v1.10.8`. Focus: Raw2D Studio MVP, public docs verification, examples, and release reliability.

## Auto Mode Rules

- Pick the first task with `Status: pending`.
- Set only that task to `in_progress`.
- Implement only that task and keep edits scoped.
- Bump all package versions to the task version.
- Keep files below 250 lines; split before crossing the limit.
- Use strict TypeScript, avoid `any`, and keep modules isolated.
- Add docs/readmes/examples/tests for user-facing behavior.
- Browser-check every visible route or editor UI change.
- Commit with the listed commit message after verification.
- Continue to the next pending task automatically unless blocked or failing.
- Push only on phase release tasks or explicit user request.
- Add release notes and a release markdown file on phase release tasks.
- Publish through the GitHub tag workflow only, not manual `npm publish`, unless the user explicitly asks.

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
Raw2D TASK4 runner.
Read AGENTS.md, TASK3.md, TASK4.md, and STUDIO_TASKS.md.
Pick first pending task in TASK4.md. Set it in_progress.
Implement only that task. Rules: strict TS, no any, files <250 lines, isolated modules.
Add tests/docs/examples for user-facing behavior. Browser-check visible changes.
Bump all package versions to task Version.
Verify with the task Verify plus standard verification when practical.
Set task completed. Commit with task Commit message.
Continue next pending task unless blocked/failing.
Push only on phase release tasks or explicit user request.
On release tasks, add release notes, push main, tag version, verify CI/npm/Cloudflare.
```

## Phase 19: Studio App Shell

- T212 | Version: v1.11.0 | Status: completed | Goal: Create `apps/studio` Vite TypeScript app with strict config. | Verify: Studio app typecheck and build. | Commit: `Create Studio app`
- T213 | Version: v1.11.1 | Status: completed | Goal: Add Studio layout shell: topbar, left tools, canvas workspace, right panels. | Verify: browser layout check. | Commit: `Add Studio layout shell`
- T214 | Version: v1.11.2 | Status: completed | Goal: Add Studio route docs and README entry from `/doc` and `/readme`. | Verify: docs route check. | Commit: `Document Studio shell`
- T215 | Version: v1.11.3 | Status: completed | Goal: Add renderer switch UI for Canvas and WebGL placeholders. | Verify: browser state check. | Commit: `Add Studio renderer switch`
- T216 | Version: v1.11.4 | Status: completed | Goal: Add Studio scene state container with camera and empty object list. | Verify: unit test. | Commit: `Add Studio scene state`
- T217 | Version: v1.11.5 | Status: completed | Goal: Add Studio render adapter that converts scene JSON to Raw2D runtime objects. | Verify: unit test and browser canvas check. | Commit: `Add Studio render adapter`
- T218 | Version: v1.11.6 | Status: completed | Goal: Add Studio sample scene button. | Verify: browser render check. | Commit: `Add Studio sample scene`
- T219 | Version: v1.11.7 | Status: completed | Goal: Add Studio shell visual smoke test. | Verify: browser visual test. | Commit: `Test Studio shell`
- T220 | Version: v1.11.8 | Status: completed | Goal: Phase 19 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio route. | Commit: `Release Studio shell phase`

## Phase 20: Studio Drawing Tools

- T221 | Version: v1.12.0 | Status: completed | Goal: Add Rect creation tool. | Verify: browser render and properties check. | Commit: `Add Studio rect tool`
- T222 | Version: v1.12.1 | Status: completed | Goal: Add Circle creation tool. | Verify: browser render and properties check. | Commit: `Add Studio circle tool`
- T223 | Version: v1.12.2 | Status: completed | Goal: Add Line creation tool. | Verify: browser render and properties check. | Commit: `Add Studio line tool`
- T224 | Version: v1.12.3 | Status: completed | Goal: Add Text2D creation tool. | Verify: browser render and text edit check. | Commit: `Add Studio text tool`
- T225 | Version: v1.12.4 | Status: completed | Goal: Add Sprite placeholder tool with asset slot. | Verify: browser placeholder render check. | Commit: `Add Studio sprite tool`
- T226 | Version: v1.12.5 | Status: completed | Goal: Add tool docs with small and full examples. | Verify: docs QA and browser check. | Commit: `Document Studio tools`
- T227 | Version: v1.12.6 | Status: completed | Goal: Add drawing tool unit tests for scene JSON output. | Verify: unit tests. | Commit: `Test Studio tools`
- T228 | Version: v1.12.7 | Status: completed | Goal: Phase 20 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio tools. | Commit: `Release Studio tools phase`

## Phase 21: Studio Interaction And Panels

- T229 | Version: v1.13.0 | Status: completed | Goal: Add single-object selection in Studio. | Verify: browser click check. | Commit: `Add Studio selection`
- T230 | Version: v1.13.1 | Status: completed | Goal: Add drag selected object. | Verify: browser drag check. | Commit: `Add Studio drag`
- T231 | Version: v1.13.2 | Status: completed | Goal: Add resize handles for Rect and Sprite. | Verify: browser resize check. | Commit: `Add Studio resize`
- T232 | Version: v1.13.3 | Status: completed | Goal: Add keyboard move, delete, and escape clear. | Verify: browser keyboard check. | Commit: `Add Studio keyboard`
- T233 | Version: v1.13.4 | Status: completed | Goal: Add Layers panel with select, visibility, and ordering. | Verify: browser layers check. | Commit: `Add Studio layers panel`
- T234 | Version: v1.13.5 | Status: completed | Goal: Add Properties panel for transform and material edits. | Verify: browser edit check. | Commit: `Add Studio properties panel`
- T235 | Version: v1.13.6 | Status: pending | Goal: Add Renderer Stats panel for Canvas/WebGL diagnostics. | Verify: browser stats check. | Commit: `Add Studio stats panel`
- T236 | Version: v1.13.7 | Status: pending | Goal: Add interaction and panel docs. | Verify: docs route check. | Commit: `Document Studio interaction`
- T237 | Version: v1.13.8 | Status: pending | Goal: Phase 21 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio interaction. | Commit: `Release Studio interaction phase`

## Phase 22: Studio Persistence And Export

- T238 | Version: v1.14.0 | Status: pending | Goal: Add save scene JSON. | Verify: schema snapshot test. | Commit: `Add Studio save`
- T239 | Version: v1.14.1 | Status: pending | Goal: Add load scene JSON. | Verify: browser load check. | Commit: `Add Studio load`
- T240 | Version: v1.14.2 | Status: pending | Goal: Add export PNG. | Verify: browser export check. | Commit: `Add Studio png export`
- T241 | Version: v1.14.3 | Status: pending | Goal: Add import validation errors for invalid JSON. | Verify: unit and browser error check. | Commit: `Validate Studio scene import`
- T242 | Version: v1.14.4 | Status: pending | Goal: Add Studio persistence docs and README. | Verify: docs QA. | Commit: `Document Studio persistence`
- T243 | Version: v1.14.5 | Status: pending | Goal: Add browser smoke for save, load, export. | Verify: browser test. | Commit: `Test Studio persistence`
- T244 | Version: v1.14.6 | Status: pending | Goal: Phase 22 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio persistence. | Commit: `Release Studio persistence phase`

## Phase 23: Public Beta Studio Polish

- T245 | Version: v1.15.0 | Status: pending | Goal: Audit `/doc`, `/readme`, `/examples`, `/studio`, and CDN smoke after Studio MVP. | Verify: browser bug bash. | Commit: `Audit Studio beta routes`
- T246 | Version: v1.15.1 | Status: pending | Goal: Polish beginner docs flow to include Studio after examples. | Verify: docs navigation check. | Commit: `Polish Studio beginner docs`
- T247 | Version: v1.15.2 | Status: pending | Goal: Polish Hinglish Studio docs manually. | Verify: Hinglish route review. | Commit: `Polish Studio Hinglish docs`
- T248 | Version: v1.15.3 | Status: pending | Goal: Add Studio mobile and overflow checks. | Verify: browser viewport checks. | Commit: `Audit Studio responsive UI`
- T249 | Version: v1.15.4 | Status: pending | Goal: Add Studio public demo checklist. | Verify: checklist route check. | Commit: `Add Studio demo checklist`
- T250 | Version: v1.15.5 | Status: pending | Goal: Add post-release npm and CDN audit for Studio packages/docs. | Verify: fresh install and CDN checks. | Commit: `Audit Studio release`
- T251 | Version: v1.15.6 | Status: pending | Goal: Phase 23 release and publish. | Verify: CI, npm latest, Cloudflare docs, Studio demo. | Commit: `Release Studio beta polish phase`

## Later Queues

- React Fiber package starts only after Studio MVP confirms renderer and scene APIs.
- MCP Studio tools start only after save/load scene JSON is stable.
- Advanced editor features such as timeline, filters, plugin marketplace, and photo editing are not part of TASK4.
