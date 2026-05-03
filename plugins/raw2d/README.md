# Raw2D Codex Plugin

This repo-local plugin is for Raw2D contributor workflows. It is not part of the browser runtime and should not be bundled into npm packages.

## Scope

- Write feature docs and examples.
- Scaffold small Raw2D demo projects.
- Run docs QA, package audits, and visual checks.
- Use `raw2d-mcp` helpers for deterministic scene JSON generation.

## Boundaries

- Do not publish npm packages from normal plugin commands.
- Do not push Git unless a release task explicitly asks for it.
- Keep generated code isolated and easy to review.
- Explain which files were created, changed, tested, and visually checked.

## Structure

- `.codex-plugin/plugin.json`: plugin metadata.
- `.mcp.json`: future MCP server wiring.
- `skills/`: Raw2D-specific Codex skills.
- `scripts/`: deterministic helper scripts.
- `assets/`: plugin icons or screenshots later.

