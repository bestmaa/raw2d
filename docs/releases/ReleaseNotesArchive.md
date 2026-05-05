# Raw2D Release Notes Archive

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
