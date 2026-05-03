# Raw2D Codex Plugin

This repo-local plugin is for Raw2D contributor workflows. It is not part of the browser runtime and should not be bundled into npm packages.

## Purpose

Raw2D should stay lightweight for browser users. The plugin keeps contributor automation in one isolated place so docs, examples, visual checks, and package audits can grow without changing runtime packages.

## Scope

- Write feature docs and examples.
- Scaffold small Raw2D demo projects.
- Run docs QA, package audits, and visual checks.
- Use `raw2d-mcp` helpers for deterministic scene JSON generation.

## Skills

- `raw2d-doc-writer`: write English and Hinglish docs with focused examples.
- `raw2d-feature-builder`: build one isolated feature with tests and docs.
- `raw2d-visual-check`: run browser checks and visual pixel tests.
- `raw2d-package-audit`: inspect package exports, versions, pack output, and release readiness.

## Commands

```bash
node plugins/raw2d/scripts/scaffold-raw2d-app.mjs --out ./demo --renderer webgl
node plugins/raw2d/scripts/create-raw2d-example.mjs --out ./examples/card --shape rect
node plugins/raw2d/scripts/run-docs-qa.mjs --json
node plugins/raw2d/scripts/run-visual-pixel-tests.mjs --dry-run --json
node plugins/raw2d/scripts/explain-renderer-stats.mjs --sample
```

## Test Workflow

Run plugin checks after package build output exists:

```bash
npm ci
npm run build
node --test tests/plugin/*.test.mjs
node plugins/raw2d/scripts/run-docs-qa.mjs
```

## Boundaries

- Do not publish npm packages from normal plugin commands.
- Do not push Git unless a release task explicitly asks for it.
- Keep generated code isolated and easy to review.
- Explain which files were created, changed, tested, and visually checked.
- Release tasks own version bumps, tags, release notes, npm publish, and CDN verification.

## Structure

- `.codex-plugin/plugin.json`: plugin metadata.
- `.mcp.json`: future MCP server wiring.
- `skills/`: Raw2D-specific Codex skills.
- `scripts/`: deterministic helper scripts.
- `assets/`: plugin icons or screenshots later.
