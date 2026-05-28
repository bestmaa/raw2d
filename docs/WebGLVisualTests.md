# WebGL Visual Tests

Raw2D has a small browser pixel page for quick visual smoke checks:

```text
http://localhost:5174/visual-test
```

The page renders the same scene with Canvas and WebGL, then writes:

- `status`
- `hash`
- `coloredPixels`
- `width`
- `height`
- `matrix`

Read it from the browser console:

```ts
console.log(window.__raw2dPixelResult);
console.table(window.__raw2dPixelResult.matrix);
```

The matrix has one Canvas/WebGL row for `Rect`, `Circle`, `Ellipse`, `Arc`,
`Line`, `Polyline`, `Polygon`, `ShapePath`, `Sprite`, `Text2D`, and `Group2D`.

Use this for real browser pixel checks. Unit tests still lock WebGL geometry
snapshots, while this page catches blank canvas, background-only output,
context, color, shader, viewport, and per-object renderer parity problems.
