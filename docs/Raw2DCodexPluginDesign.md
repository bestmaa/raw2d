# Raw2D Codex Plugin Design

Raw2D Codex plugin will help contributors build, document, test, and inspect Raw2D projects from Codex without adding code to the browser runtime packages.

## Goal

The plugin should make Raw2D easier to work on, not hide how Raw2D works. It should keep the engine transparent: Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall.

## Location

- Plugin folder: `plugins/raw2d`
- Required manifest: `plugins/raw2d/.codex-plugin/plugin.json`
- Optional folders: `skills`, `scripts`, `assets`, `mcp`
- Marketplace entry: `.agents/plugins/marketplace.json` only when this repo should expose the plugin in Codex UI

The plugin stays outside `packages/*` so it does not ship inside npm browser packages.

## Manifest Plan

The plugin manifest should use the normalized name `raw2d` and describe Raw2D developer workflows:

```json
{
  "name": "raw2d",
  "version": "0.1.0",
  "description": "Codex tools and skills for building, documenting, and visually testing Raw2D.",
  "interface": {
    "displayName": "Raw2D",
    "description": "Build Raw2D features with docs, examples, and visual verification."
  }
}
```

The scaffold task should keep required manifest fields from the Codex plugin schema and fill missing values intentionally.

## Initial Capabilities

- Scaffold a small Raw2D app.
- Generate feature docs with English and Hinglish guidance.
- Create focused Canvas or WebGL examples.
- Run docs QA checks.
- Run visual pixel tests.
- Explain renderer stats and batching diagnostics.
- Call `raw2d-mcp` helpers for JSON scene generation and inspection.

## Skill Plan

- `raw2d-doc-writer`: write docs, readme notes, and examples for one feature.
- `raw2d-feature-builder`: implement one isolated Raw2D feature with tests.
- `raw2d-visual-check`: start docs/examples and verify them in a browser.
- `raw2d-package-audit`: verify exports, package sizes, and consumer installs.

## Boundaries

- Do not publish npm packages from normal plugin commands.
- Do not push Git unless a release task asks for it.
- Do not edit unrelated packages.
- Do not depend on React Fiber until the core renderer API is stable.
- Keep commands deterministic and explain every file they touch.

## Verification

Every plugin command should document the command it runs and return a clear result:

- files created or changed
- tests executed
- browser page checked
- package or docs output inspected
- next suggested task

