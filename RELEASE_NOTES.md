# Raw2D Release Notes

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
