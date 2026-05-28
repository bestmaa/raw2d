# Final API Freeze Checklist

Raw2D ko stable v1 API treat karne se pehle ye checklist use karo.

## Names To Freeze

- Package names: `raw2d`, `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`,
  `raw2d-sprite`, `raw2d-text`, `raw2d-effects`, `raw2d-interaction`,
  `raw2d-mcp`, `raw2d-react`, aur `raw2d-react-fiber`.
- Public class names jaise `Scene`, `Camera2D`, `CanvasRenderer`,
  `WebGLRenderer2D`, `Rect`, `Circle`, `Sprite`, aur `Text2D`.
- Constructor option field names.
- Renderer lifecycle names: `render`, `setSize`, `clear`, `dispose`,
  `getStats`, aur `resetStats`.
- Documented compatibility aliases.

## Frozen Surface Matrix

- `raw2d` app-level umbrella exports aur `CanvasRenderer` ke liye `Canvas`
  compatibility alias rakhta hai.
- Focused renderer packages apne documented low-level helpers apne package me
  rakhte hain; renderer internals umbrella package me move nahi hote.
- `raw2d-effects` renderer-neutral effect descriptors aur validation helpers
  own karta hai.
- `raw2d-mcp`, `raw2d-react`, aur `raw2d-react-fiber` separate package surfaces
  rehte hain aur `raw2d` se re-export nahi hote.

## Audit Commands

```sh
npm run typecheck
node --test tests/package/public-surface-audit.test.mjs
node --test tests/package/core-exports.test.mjs tests/package/canvas-exports.test.mjs tests/package/webgl-exports.test.mjs tests/package/focused-exports.test.mjs tests/package/imports.test.mjs
node --test tests/package/metadata-audit.test.mjs
npm run pack:check -- --silent
```

## Breaking Change Rule

v1 ke baad renames, removed exports, constructor field changes, aur renderer
behavior changes ke liye migration notes aur intentional semver decision chahiye.

## Migration Notes Rule

Har deprecation me old import, preferred import, aur old name alias ke roop me
available rahega ya nahi, ye clear hona chahiye. Raw2D v1 me `Canvas`,
`CanvasRenderer` ka alias rahega; is freeze me runtime export removals schedule
nahi hain.
