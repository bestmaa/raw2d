# Final Renderer Parity Checklist

Use this checklist before claiming Canvas and WebGL behavior is release-ready.

## Shared Behavior

CanvasRenderer and WebGLRenderer2D should agree on:

- Scene traversal.
- `object.visible`.
- Position, rotation, scale, and origin.
- zIndex render order.
- Camera x/y/zoom.
- Material color basics.

## Browser Matrix

The `/visual-test` page must expose `window.__raw2dPixelResult.matrix` with one
row for every public support-matrix object:

- `Rect`, `Circle`, `Ellipse`, `Arc`, `Line`, `Polyline`, and `Polygon`.
- `ShapePath`, including the WebGL rasterized fill fallback.
- `Sprite` and `Text2D` texture paths.
- `Group2D` flattened child rendering.

Each row should render through Canvas and WebGL, report status, hash, and
colored pixel count, and fail the browser test when either renderer draws only
background pixels.

## Known Differences

- Canvas is the reference renderer.
- WebGL is the batched renderer.
- WebGL may use texture fallback for unsupported ShapePath fills.
- WebGL2 unavailable messaging must be clear.
- Renderer stats may exist only where the renderer supports them.

## Checks

```sh
npm run test:browser
node --test tests/browser/visual-pixel.test.mjs
```

Also open `/benchmark` and `/visual-test` in a browser before release.
