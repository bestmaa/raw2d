# Raw2D Release Notes

## v1.9.9 - Examples Audit Phase

Raw2D v1.9.9 publishes the examples audit phase for stronger fresh-user examples, clearer package install paths, browser-verified demo pages, and release-ready showcase/benchmark polish.

### Added

- Polished examples for Canvas, WebGL, sprite atlas, interaction, camera controls, React, benchmark, and showcase routes.
- Copyable install commands on `/examples/` for umbrella, Canvas-focused, WebGL-focused, and React installs.
- Benchmark presets for Canvas reference, WebGL batch, and culling stress comparison.
- Showcase visitor context with install notes, live status, and focus-selection controls.
- Tests that keep examples, browser smoke routes, benchmark controls, and showcase UI aligned.

### Changed

- Package versions are aligned at `1.9.9`.
- CDN smoke docs now point to the `1.9.9` pinned package URLs.
- Examples README now documents copyable install paths for package users.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.
- Browser checks for React, benchmark, showcase, and examples copy flow.

## v1.8.9 - Beginner Docs Phase

Raw2D v1.8.9 publishes the beginner docs phase for clearer onboarding, MCP guidance, Hinglish docs polish, docs pager flow, and stronger search behavior.

### Added

- MCP beginner docs that explain when `raw2d-mcp` should be installed separately from the runtime packages.
- Beginner path coverage tests for install, Canvas, Scene, Camera, shapes, texture/sprite, WebGL, interaction, MCP, and React docs.
- Group-aware docs next/previous navigation with stable topic metadata for browser checks.
- Search aliases for common misspellings such as `wevgl`, `sprit`, `camra`, `texure`, and `rezise`.

### Changed

- Package versions are aligned at `1.8.9`.
- Hinglish beginner docs are manually polished to avoid awkward mixed-language labels.
- CDN smoke docs now point to the `1.8.9` pinned package URLs.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Workspace package dry-run.
- Consumer install smoke tests.
- Docs search and beginner path browser checks.

## v1.6.6 - React Preparation Phase

Raw2D v1.6.6 publishes the React preparation phase for lifecycle-safe scene objects, current adapter parity checks, and a clear future Fiber boundary.

### Added

- React Fiber boundary docs that define package scope and non-goals.
- Renderer API audit notes for future reconciliation.
- Object lifecycle helpers for attach, detach, dispose, and lifecycle state inspection.
- Reconciler model docs for future JSX object ownership.
- Current adapter versus future Fiber docs in English and Hinglish.
- React parity tests that keep the `raw2d-react` public component set aligned with the example app and docs.

### Changed

- Package versions are aligned at `1.6.6`.
- React planning now stays documented without changing the current low-level renderer API.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.

## v1.5.10 - Publish Lockfile Fix

Raw2D v1.5.10 fixes the GitHub Actions install path for the MCP plugin hardening release.

### Fixed

- Regenerated the workspace lockfile from a clean install so `source-map-js` resolves to the real npm registry version.
- Keeps the v1.5.x MCP/plugin hardening package contents unchanged aside from version alignment.

### Verification

- npm 10 clean install.
- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.

## v1.5.9 - MCP Plugin Hardening Phase

Raw2D v1.5.9 publishes MCP and Codex plugin hardening for automation workflows, package boundaries, generated examples, and contributor audit commands.

### Added

- `raw2d-mcp` stdio server entry with deterministic method dispatch.
- MCP schema docs for public scene, validation, example, visual-check, and batch update tools.
- Batch MCP scene updates for multiple transform and material patches.
- Fresh install audit plugin command for pack and consumer smoke plans.
- Showcase scene generator command for larger Canvas/WebGL demos.
- MCP/plugin consumer guide in English and Hinglish.
- Package audit tests ensuring MCP stays core-only and plugin files do not ship in runtime packages.
- Updated Raw2D skills for post-release audits, generated examples, showcase demos, and package checks.

### Changed

- Package versions are aligned at `1.5.9`.
- MCP/plugin docs now explain the boundary between installable automation packages and repo-local contributor tooling.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.

## v1.4.9 - Showcase Phase

Raw2D v1.4.9 publishes the real-world showcase phase for proving Canvas/WebGL parity, interaction, camera controls, and visible renderer diagnostics in one runnable demo.

### Added

- Showcase demo route at `/examples/showcase/` with many sprites, shapes, labels, and a shared scene.
- Canvas/WebGL renderer switch using the same `Scene` and `Camera2D`.
- Camera pan, zoom, reset, and minimap viewport hints.
- Interaction selection, drag, resize, and transform overlay.
- Live renderer stats with copyable reports.
- Atlas sorting, static batch, and culling toggles for visible performance experiments.
- Showcase docs in English and Hinglish explaining what Raw2D proves.
- Showcase-specific browser and visual contract tests.

### Changed

- Package versions are aligned at `1.4.9`.
- Browser showcase tests now use a dynamic safe port for stable repeated verification.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer install smoke tests.

## v1.3.10 - Docs Polish Phase

Raw2D v1.3.10 publishes the docs polish phase for better onboarding, search, navigation, copyable examples, and release-safe docs QA.

### Added

- Beginner learning path from install to Canvas, Scene, shapes, texture/sprite, WebGL, and examples.
- Stronger docs search ranking and keyboard navigation.
- Grouped docs navigation with English and Hinglish descriptions.
- Copy-friendly code blocks that normalize snippets toward package imports.
- Focused live examples with small-code and full-example modes.
- V1 install docs, renderer choice guide, glossary, and linked README coverage.
- Automated docs link audit for imported markdown files, `/doc#...` topics, `/readme#...` topics, examples, and relative markdown links.

### Changed

- Package versions are aligned at `1.3.10`.
- Hinglish docs labels and fallback text are cleaner and easier to read.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Docs link audit.
- Workspace package dry-run.
- Consumer install smoke tests.

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

## v1.0.2 - Clean Publish Lockfile Fix

Older entries from v1.0.2 and earlier live in `docs/releases/ReleaseNotesArchive.md`.
