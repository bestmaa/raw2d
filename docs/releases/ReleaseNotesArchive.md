# Raw2D Release Notes Archive

## v1.22.5 - React Fiber Phase

Raw2D v1.22.5 publishes the React Fiber package phase.

### Added

- `raw2d-react-fiber` as a separate package with an explicit custom reconciler boundary.
- Host config helpers for Rect, Circle, Line, Text2D, Sprite, and Group2D instances without copying PixiJS or Phaser APIs.
- Lifecycle-safe Sprite texture handling for external textures, owned textures, and `AssetGroup` lookups.
- Optional interaction bridge helpers that connect React-managed Raw2D objects to selection, camera, and controller workflows.
- Runnable React Fiber example and migration docs for moving from the older `raw2d-react` helpers.

### Verification

- Full test suite.
- Browser smoke suite.
- React consumer install smoke tests.
- Docs production build.
- Workspace package dry-run.
- CDN pinned dry-run.

## v1.21.5 - WebGL Completion Phase

Raw2D v1.21.5 publishes the WebGL completion phase.

### Added

- SVG texture rasterization helpers in `raw2d-sprite` for Canvas and WebGL texture workflows.
- Static WebGL run compaction with explicit diagnostics through `compactWebGLStaticRuns`.
- Advanced atlas packing diagnostics for fragmentation, outer waste, occupancy, and resize suggestions.
- Browser visual pixel coverage for WebGL Sprite, Text2D, ShapePath fallback, culling, static batches, and static cache hits.
- WebGL completion docs covering status, tradeoffs, performance reading, and release verification.

### Verification

- Full test suite.
- Docs production build.
- Browser visual pixel and WebGL geometry regression checks.
- WebGL docs snippet smoke.
- Workspace package dry-run.
- CDN pinned dry-run.

## v1.20.5 - Effects Foundation Phase

Raw2D v1.20.5 publishes the effects foundation phase.

### Added

- `raw2d-effects` descriptor factories and validation helpers for opacity, blur, grayscale, and shadow.
- Canvas effect application through explicit renderer hooks while keeping scene objects renderer-neutral.
- WebGL effect pass planning that separates draw-batch alpha work from framebuffer shader-pass work.
- `/examples/effects-basic/` showing Canvas-first effect behavior and WebGL support limits.
- Effects package docs covering APIs, non-goals, renderer boundaries, and core separation.

### Verification

- Full test suite.
- Docs production build.
- Workspace package dry-run.
- Focused effects, Canvas effects, WebGL pass-plan, examples, and docs checks.
- CDN pinned dry-run.

## v1.19.5 - Studio Import Export Phase

Raw2D v1.19.5 publishes the Studio import/export polish phase.

### Added

- Studio import validation messages for unsupported objects, invalid geometry, and missing asset references.
- Canvas code export that copies public `raw2d` app code without importing Studio internals.
- WebGL code export with explicit WebGL2 checks, texture placeholder warnings, and renderer diagnostics.
- Raw2D MCP scene JSON import with deterministic handling for valid, duplicate, and invalid object IDs.
- English and Hinglish docs for Studio import/export, validation, generated-code boundaries, and MCP import behavior.
- Browser and unit coverage for Studio generated code, MCP import, persistence wiring, and docs route coverage.

### Verification

- Full test suite.
- Docs production build.
- Browser Studio import/export workflow smoke tests.
- Workspace package dry-run.
- CDN pinned dry-run.

## v1.18.5 - Studio Transform Tools Phase

Raw2D v1.18.5 publishes the Studio transform tools phase.

### Added

- Studio Circle resize handles that update center and radius without storing negative radius.
- Studio Line endpoint handles for editing local start and end points.
- Studio Text2D resize behavior that scales `px` font size from estimated text bounds.
- Studio multi-select state, layer shift-select, group selection bounds, group move, and group delete workflows.
- Batch Studio commands so grouped transform/delete edits stay atomic for undo and redo.
- Browser regression coverage for resize handles crossing all four corners.
- English and Hinglish docs for transform tool behavior and multi-select movement.

### Verification

- Full test suite.
- Docs production build.
- Browser transform workflow smoke tests.
- Workspace package dry-run.
- CDN pinned dry-run.

## v1.17.6 - Studio Assets Phase

Raw2D v1.17.6 publishes the Studio assets phase.

### Added

- Studio image asset state for local imports, dimensions, mime metadata, and object references.
- Assets panel import, selection, preview, remove, and Sprite bind workflows.
- Runtime adapter support that turns asset-backed Studio Sprite objects into Raw2D `Sprite` and `Texture` instances.
- Scene save/load support for safe asset metadata, with diagnostics for missing Sprite assets and stale object references.
- English and Hinglish docs for Studio asset workflows, persistence limits, and Sprite asset binding.
- Browser smoke coverage for image import, Sprite binding, save metadata, and reload warnings.

### Verification

- Full test suite.
- Docs production build.
- Browser asset workflow smoke test.
- Workspace package dry-run.
- CDN pinned dry-run.

## v1.16.6 - Studio Command History Phase

Raw2D v1.16.6 publishes the Studio command history phase.

### Added

- Studio command model for create, delete, transform, material, text, visibility, and layer order edits.
- Undo and redo state management with toolbar buttons and Ctrl/Cmd keyboard shortcuts.
- Explicit command wiring for Studio create tools, keyboard movement, delete, canvas drag, resize, layer actions, and property edits.
- Studio command history documentation in English and Hinglish.
- Browser smoke coverage for create, move, resize, property edit, undo, and redo workflows.

### Verification

- Full test suite.
- Docs production build.
- Browser smoke suite.
- Workspace package dry-run.
- Consumer install smoke tests.
- CDN pinned dry-run.

## v1.15.7 - Resize Fix

Raw2D v1.15.7 publishes a focused resize behavior fix for `raw2d-interaction` and Raw2D Studio.

### Fixed

- Corner resize now keeps dimensions non-negative while allowing the dragged corner to cross the opposite corner.
- Studio Rect and Sprite resize now normalize bounds from a fixed edge instead of getting stuck at the minimum size.
- `raw2d-interaction` resize helpers now use the same fixed-edge axis model for all corner handles.

### Verification

- Full test suite.
- Docs production build.
- Workspace package dry-run.

## v1.15.6 - Studio Beta Polish Phase

Raw2D v1.15.6 publishes the Studio beta polish phase.

### Added

- Public beta route audit coverage for docs, readme, examples, Studio, and CDN smoke.
- Beginner docs flow that points users to Studio after runnable examples.
- Polished Hinglish Studio documentation.
- Studio mobile and dark-overflow checks for stacked layout, wrapped actions, and scrollable panels.
- Studio public demo checklist and post-release npm/CDN audit guidance.

### Verification

- Full package and docs tests.
- Browser route, Studio persistence, mobile viewport, and dark overflow checks.
- Consumer install smoke, CDN pinned dry-run, and workspace pack dry-run.

## v1.14.6 - Studio Persistence Phase

Raw2D v1.14.6 publishes the Studio persistence phase.

### Added

- Studio scene JSON save and load workflows with deterministic filenames.
- Import validation errors surfaced in the Studio status area.
- Canvas PNG export from the active Studio viewport.
- Persistence docs in English and Hinglish.
- Browser smoke coverage for Studio save, load, and export wiring.

### Verification

- Full package and docs tests.
- Browser Studio persistence and import error checks.
- Consumer install smoke and workspace pack dry-run.

## v1.13.8 - Studio Interaction Phase

Raw2D v1.13.8 publishes the Studio interaction phase.

### Added

- Studio selection, drag movement, Rect/Sprite resize handles, keyboard nudge/delete/escape, and Layers panel actions.
- Editable Properties panel for transform, geometry, text, and material fields.
- Renderer Stats panel showing Canvas render-list stats and WebGL diagnostics.
- Studio interaction and panel docs in English and Hinglish.

### Verification

- Full package and docs tests.
- Browser Studio interaction and stats checks.
- Consumer install smoke and workspace pack dry-run.

## v1.12.7 - Studio Tools Phase

Raw2D v1.12.7 publishes the first Studio drawing tools phase.

### Added

- Rect, Circle, Line, Text2D, and Sprite placeholder tools in `apps/studio`.
- Dynamic Layers and Properties output for created Studio objects.
- Scene JSON factory tests and runtime adapter coverage for Studio tools.
- Studio tools documentation with small and full examples.

### Verification

- Full package and docs tests.
- Browser Studio tool checks.
- Consumer install smoke and workspace pack dry-run.

## v1.11.8 - Studio Shell Phase

Raw2D v1.11.8 publishes the first Studio editor shell phase.

### Added

- Strict Vite TypeScript Studio app scaffold under `apps/studio`.
- Editor workspace shell with tools, canvas workspace, renderer controls, layers, and properties.
- Studio scene JSON state, Raw2D runtime adapter, and sample scene rendering.
- Studio smoke tests for scene state, render adapter, and visual shell wiring.

### Verification

- Studio typecheck and production build.
- Workspace TypeScript strict typecheck.
- Studio Node tests and browser shell check.

## v1.1.10 - Post-Release Consumer Audit Phase

Raw2D v1.1.10 publishes the post-release audit hardening phase for real npm users.

### Added

- Fresh install smoke tests for the umbrella `raw2d` package.
- Focused package install smoke tests for core, canvas, webgl, sprite, and text usage.
- Separate install smoke tests for `raw2d-mcp` and `raw2d-react`.
- README, Canvas docs, WebGL docs, and interaction docs snippet compile checks against packed packages.
- Post-release npm/CDN/browser audit plan and audit report docs.

### Fixed

- Updated stale jsDelivr README URLs to use the current package path.
- Fixed one interaction docs snippet that passed an invalid `camera` field to `pickObject`.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.
- README and docs snippet compile smoke tests.

## v1.7.10 - Public Beta Hardening

Raw2D v1.7.10 completes the Public Beta Hardening phase.

### Added

- Fresh install audits for `raw2d`, focused Canvas/WebGL packages, and `raw2d-react`.
- CDN smoke page and pinned jsDelivr verification.
- Product docs snippet compile audit for user-facing docs examples.
- Browser bug-bash, mobile viewport, and dark UI overflow checks for docs and examples.

### Verification

- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.
- Mobile docs and dark UI browser route checks.

## v1.2.11 - Product Examples Phase

Raw2D v1.2.11 publishes the product-quality examples phase.

### Added

- Examples index and shared example styling.
- Canvas basic scene with shapes, text, animation, and stats.
- WebGL sprite batching example with texture sorting diagnostics.
- Texture atlas example with packed sprite frames.
- Interaction example for selection, drag, and Rect resize.
- Camera controls example for pointer pan and wheel zoom.
- ShapePath Canvas/WebGL comparison example.
- React bridge example for `raw2d-react`.
- MCP scene JSON example for `raw2d-mcp`.
- Examples README with install, route, package import, and verification instructions.
- Route coverage tests for all example folders.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.
- React and MCP install smoke checks.

Older v1.0.x entries live in `docs/releases/ReleaseNotesArchiveLegacy.md`.
