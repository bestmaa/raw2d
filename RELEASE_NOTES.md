# Raw2D Release Notes

## v1.0.2 - Clean Publish Lockfile Fix

Raw2D v1.0.2 fixes the release lockfile after the v1.0.1 publish attempt exposed an invalid generated dependency tarball URL.

### Changed

- Package versions are aligned at `1.0.2`.
- The workspace lockfile is regenerated from package metadata instead of broad text replacement.

### Verification

- npm 10 clean install.
- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.

## v1.0.1 - npm 10 Release Lockfile Fix

Raw2D v1.0.1 attempted to fix the clean GitHub Actions publish path for the stable v1 release.

### Changed

- Package versions are aligned at `1.0.1`.
- The workspace lockfile is regenerated for npm 10 clean installs used by the publish workflow.

### Verification

- npm 10 clean install.
- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.

## v1.0.0 - Stable Raw2D MVP

Raw2D v1.0.0 is the first stable release candidate for the modular 2D rendering engine.

### Highlights

- Stable public API checklist, package metadata, release workflow, and docs QA gates.
- Canvas reference renderer and WebGL2 batched renderer with documented parity boundaries.
- Modular packages for core, canvas, webgl, sprite, text, interaction, mcp, react, and effects.
- Docs and examples for Canvas, WebGL, interaction, MCP/plugin tooling, React readiness, and release verification.

### Added

- Final QA checklists for Canvas, WebGL, interaction, console, accessibility, install smoke, API freeze, renderer parity, MCP/plugin, React, npm, CDN, and Cloudflare.
- Browser and package audit tests for final v1 hardening docs.
- Release notes, changelog, API freeze, install smoke, and v1 release workflows.

### Changed

- Package versions are aligned at `1.0.0`.

### Known Limits

- `raw2d-effects` remains intentionally empty.
- `raw2d-react` is an early optional adapter package.
- `WebGLRenderer2D` remains explicit and batch-focused, with documented renderer differences.

### Verification

- TypeScript strict typecheck.
- Full unit and browser test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.
- npm, CDN, and docs deployment checks after publish.

## v0.9.9 - Clean Release Lockfile Fix

Raw2D v0.9.9 fixes the npm 10 clean-install lockfile used by GitHub Actions release publishing.

### Changed

- Package versions are aligned at `0.9.9`.
- The workspace lockfile now includes npm 10 Linux optional dependencies required by clean release installs.

### Verification

- npm 10 clean install.
- TypeScript strict typecheck.
- Full unit test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.

## v0.9.8 - React Package Build Fix

Raw2D v0.9.8 fixes the clean CI release path for the first React package phase.

### Changed

- Package versions are aligned at `0.9.8`.
- Workspace package build order now builds the `raw2d` umbrella package before `raw2d-react`.

### Verification

- Clean install.
- TypeScript strict typecheck.
- Full unit test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.

## v0.9.7 - React Package Phase

Raw2D v0.9.7 publishes the first `raw2d-react` phase for React users.

### Added

- New `raw2d-react` package with isolated React bridge boundaries.
- `<Raw2DCanvas>` component with explicit Canvas/WebGL renderer choice.
- React primitives for `RawRect`, `RawCircle`, `RawLine`, `RawSprite`, and `RawText2D`.
- React package docs, Hinglish docs, package README, and Vite React example.
- External consumer test that installs `raw2d-react` in a generated Vite app and builds it.

### Changed

- Publish workflow now includes `raw2d-react`.
- Package versions are aligned at `0.9.7`.

### Verification

- TypeScript strict typecheck.
- Full unit test suite, including React consumer build.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.

## v0.8.12 - Codex Plugin And Skills Phase

Raw2D v0.8.12 publishes the first repo-local Codex plugin phase for contributor automation.

### Added

- Repo-local `plugins/raw2d` Codex plugin scaffold outside runtime packages.
- Raw2D-specific skills for docs writing, isolated feature building, visual checks, and package audits.
- Plugin commands for app scaffolding, example generation, docs QA, visual pixel test planning, and renderer stats explanations.
- Plugin docs page, English README, Hinglish README, and dedicated plugin workflow.
- Plugin tests covering manifest metadata, skills, command outputs, docs registration, and workflow coverage.

### Changed

- Package versions are aligned at `0.8.12`.
- Docs now include an AI Tools section for MCP and plugin contributor workflows.

### Verification

- TypeScript strict typecheck.
- Full unit test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.

## v0.7.14 - MCP Phase

Raw2D v0.7.14 publishes the first MCP-focused phase for AI-assisted scene automation.

### Added

- New `raw2d-mcp` package for deterministic Raw2D scene automation helpers.
- MCP manifest helper with stable tool names for scene creation, object edits, docs snippets, visual checks, and package export audits.
- JSON scene helpers for creating scenes, adding objects, updating transforms, updating materials, inspecting scenes, and validating scene data.
- Example generators for Canvas and WebGL usage.
- Visual check plan helper for browser smoke and WebGL visual regression workflows.
- MCP docs page, README coverage, and AI control boundary guidance.

### Changed

- Publish workflow now includes `raw2d-mcp` with the other public packages.
- Package versions are aligned at `0.7.14`.

### Verification

- TypeScript strict typecheck.
- Full unit test suite.
- Docs production build.
- Workspace package dry-run.
- Consumer smoke test.
