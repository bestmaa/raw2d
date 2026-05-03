# Final MCP And Plugin Readiness Checklist

Use this checklist before presenting Raw2D AI tooling as release-ready.

## MCP Package

- `raw2d-mcp` builds.
- Public MCP helpers validate scene JSON.
- Scene update helpers return new objects instead of mutating input.
- Visual check helpers return clear command plans.
- Package export surface is audited.

```sh
npm run build --workspace raw2d-mcp
node --test tests/mcp/*.test.mjs
```

## Codex Plugin

- Plugin scaffold stays outside runtime packages.
- `.codex-plugin/plugin.json` has stable metadata.
- Commands are documented.
- Skills are documented.
- Plugin checks build packages before running plugin tests.

## Skills

Review these skills before release:

- `raw2d-doc-writer`
- `raw2d-feature-builder`
- `raw2d-visual-check`
- `raw2d-package-audit`

Each skill should mention verification, browser/manual checks, and file-size discipline.
