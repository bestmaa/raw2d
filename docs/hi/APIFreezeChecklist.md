# Final API Freeze Checklist

Raw2D ko stable v1 API treat karne se pehle ye checklist use karo.

## Names To Freeze

- Package names: `raw2d`, `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`,
  `raw2d-sprite`, `raw2d-text`, `raw2d-interaction`, `raw2d-react`.
- Public class names jaise `Scene`, `Camera2D`, `CanvasRenderer`,
  `WebGLRenderer2D`, `Rect`, `Circle`, `Sprite`, aur `Text2D`.
- Constructor option field names.
- Renderer lifecycle names: `render`, `setSize`, `clear`, `dispose`,
  `getStats`, aur `resetStats`.
- Documented compatibility aliases.

## Audit Commands

```sh
node --test tests/package/public-surface-audit.test.mjs
node --test tests/package/metadata-audit.test.mjs
npm run pack:check -- --silent
```

## Breaking Change Rule

v1 ke baad renames, removed exports, constructor field changes, aur renderer
behavior changes ke liye migration notes aur intentional semver decision chahiye.
