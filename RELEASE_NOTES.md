# Raw2D Release Notes

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

