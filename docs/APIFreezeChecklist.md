# Final API Freeze Checklist

Use this checklist before Raw2D is treated as a stable v1 API.

## Names To Freeze

- Package names: `raw2d`, `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`,
  `raw2d-sprite`, `raw2d-text`, `raw2d-effects`, `raw2d-interaction`,
  `raw2d-mcp`, `raw2d-react`, and `raw2d-react-fiber`.
- Public class names such as `Scene`, `Camera2D`, `CanvasRenderer`,
  `WebGLRenderer2D`, `Rect`, `Circle`, `Sprite`, and `Text2D`.
- Constructor option field names.
- Renderer lifecycle names: `render`, `setSize`, `clear`, `dispose`,
  `getStats`, and `resetStats`.
- Documented compatibility aliases.

## Frozen Surface Matrix

- `raw2d` keeps the app-level umbrella exports and the `Canvas` compatibility
  alias for `CanvasRenderer`.
- Focused renderer packages keep their documented low-level helpers in their own
  packages; renderer internals do not move into the umbrella package.
- `raw2d-effects` keeps renderer-neutral effect descriptors and validation
  helpers.
- `raw2d-mcp`, `raw2d-react`, and `raw2d-react-fiber` remain separate package
  surfaces and are not re-exported from `raw2d`.

## Audit Commands

```sh
npm run typecheck
node --test tests/package/public-surface-audit.test.mjs
node --test tests/package/core-exports.test.mjs tests/package/canvas-exports.test.mjs tests/package/webgl-exports.test.mjs tests/package/focused-exports.test.mjs tests/package/imports.test.mjs
node --test tests/package/metadata-audit.test.mjs
npm run pack:check -- --silent
```

## Breaking Change Rule

After v1, renames, removed exports, constructor field changes, and renderer
behavior changes need migration notes and an intentional semver decision.

## Migration Notes Rule

Every deprecation should name the old import, the preferred import, and whether
the old name remains as an alias. Raw2D v1 keeps `Canvas` as an alias for
`CanvasRenderer`; there are no scheduled runtime export removals in this freeze.
