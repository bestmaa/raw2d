# Raw2D Studio MVP Task Queue

This queue starts after TASK3 Phase 18 planning.

## Rules

- Work one task at a time.
- Keep Studio code in `apps/studio` unless a reusable UI-free helper clearly belongs in a Raw2D package.
- Do not import Studio code from `packages/*`.
- Keep files below 250 lines.
- Browser-check every visible editor change.
- Keep CanvasRenderer and WebGLRenderer2D switchable.
- Add examples only after the shell works.
- Do not add photo editing, physics, timeline animation, plugin marketplace, or rich text editing in MVP.

## Phase A: App Shell

- S001 | Goal: Create `apps/studio` Vite app. | Verify: app builds. | Commit: `Create Studio app`
- S002 | Goal: Add editor layout shell: toolbar, layers, canvas workspace, right panels. | Verify: browser layout check. | Commit: `Add Studio layout`
- S003 | Goal: Add renderer switch placeholder for Canvas and WebGL. | Verify: UI state check. | Commit: `Add Studio renderer switch`
- S004 | Goal: Add scene state container with empty scene and camera defaults. | Verify: unit test. | Commit: `Add Studio scene state`

## Phase B: Objects

- S005 | Goal: Add Rect creation tool. | Verify: browser render check. | Commit: `Add Studio rect tool`
- S006 | Goal: Add Circle creation tool. | Verify: browser render check. | Commit: `Add Studio circle tool`
- S007 | Goal: Add Line creation tool. | Verify: browser render check. | Commit: `Add Studio line tool`
- S008 | Goal: Add Text2D creation tool. | Verify: browser render check. | Commit: `Add Studio text tool`
- S009 | Goal: Add Sprite creation placeholder from selected asset. | Verify: browser render check. | Commit: `Add Studio sprite tool`

## Phase C: Interaction

- S010 | Goal: Add single-object selection. | Verify: browser click check. | Commit: `Add Studio selection`
- S011 | Goal: Add drag selected object. | Verify: browser drag check. | Commit: `Add Studio drag`
- S012 | Goal: Add resize handles for Rect and Sprite. | Verify: browser resize check. | Commit: `Add Studio resize`
- S013 | Goal: Add keyboard move and delete. | Verify: browser keyboard check. | Commit: `Add Studio keyboard`

## Phase D: Panels

- S014 | Goal: Add Layers panel. | Verify: order and visibility check. | Commit: `Add Studio layers panel`
- S015 | Goal: Add Properties panel. | Verify: transform and material edits. | Commit: `Add Studio properties panel`
- S016 | Goal: Add Assets panel. | Verify: texture list check. | Commit: `Add Studio assets panel`
- S017 | Goal: Add Renderer Stats panel. | Verify: Canvas/WebGL stats check. | Commit: `Add Studio stats panel`

## Phase E: Save, Load, Export

- S018 | Goal: Save scene JSON. | Verify: schema snapshot test. | Commit: `Add Studio save`
- S019 | Goal: Load scene JSON. | Verify: browser load check. | Commit: `Add Studio load`
- S020 | Goal: Export PNG. | Verify: browser export check. | Commit: `Add Studio png export`

## Phase F: Beta Demo

- S021 | Goal: Add Studio example scene. | Verify: browser smoke. | Commit: `Add Studio sample scene`
- S022 | Goal: Add Studio README and docs route. | Verify: docs QA. | Commit: `Document Studio MVP`
- S023 | Goal: Add Studio visual regression smoke. | Verify: visual test. | Commit: `Test Studio visual shell`
- S024 | Goal: Studio MVP release notes. | Verify: release checklist. | Commit: `Release Studio MVP phase`
