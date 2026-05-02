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

Read it from the browser console:

```ts
console.log(window.__raw2dPixelResult);
```

Use this for real browser pixel checks. Unit tests still lock WebGL geometry snapshots, while this page catches blank canvas, background-only output, context, color, shader, and viewport problems.
