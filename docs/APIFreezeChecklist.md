# Final API Freeze Checklist

Use this checklist before Raw2D is treated as a stable v1 API.

## Names To Freeze

- Package names: `raw2d`, `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`,
  `raw2d-sprite`, `raw2d-text`, `raw2d-interaction`, `raw2d-react`.
- Public class names such as `Scene`, `Camera2D`, `CanvasRenderer`,
  `WebGLRenderer2D`, `Rect`, `Circle`, `Sprite`, and `Text2D`.
- Constructor option field names.
- Renderer lifecycle names: `render`, `setSize`, `clear`, `dispose`,
  `getStats`, and `resetStats`.
- Documented compatibility aliases.

## Audit Commands

```sh
node --test tests/package/public-surface-audit.test.mjs
node --test tests/package/metadata-audit.test.mjs
npm run pack:check -- --silent
```

## Breaking Change Rule

After v1, renames, removed exports, constructor field changes, and renderer
behavior changes need migration notes and an intentional semver decision.
