# Final MCP And Plugin Readiness Checklist

Raw2D AI tooling ko release-ready bolne se pehle ye checklist use karo.

## MCP Package

- `raw2d-mcp` build hota hai.
- Public MCP helpers scene JSON validate karte hain.
- Scene update helpers input mutate nahi karte, new objects return karte hain.
- Visual check helpers clear command plans return karte hain.
- Package export surface audited hai.

```sh
npm run build --workspace raw2d-mcp
node --test tests/mcp/*.test.mjs
```

## Codex Plugin

- Plugin scaffold runtime packages ke bahar rahta hai.
- `.codex-plugin/plugin.json` stable metadata rakhta hai.
- Commands documented hain.
- Skills documented hain.
- Plugin checks plugin tests se pehle packages build karte hain.

## Skills

Release se pehle ye skills review karo:

- `raw2d-doc-writer`
- `raw2d-feature-builder`
- `raw2d-visual-check`
- `raw2d-package-audit`

Har skill me verification, browser/manual checks, aur file-size discipline mention hona chahiye.
