# WebGL Completion Status

`WebGLRenderer2D` is Raw2D's batch-first performance renderer. It now covers shape geometry, Sprites, atlas frames, rasterized `Text2D`, culling, texture caching, static batch caching, static run compaction, context recovery, and visual parity checks.

Canvas remains the complete reference renderer. WebGL is intentionally explicit:

```text
Scene -> RenderPipeline -> RenderRun -> Batcher -> Buffer -> Shader -> DrawCall
```

## What Is Covered

- `Rect`, `Circle`, `Ellipse`, `Arc`, `Line`, `Polyline`, simple `Polygon`, and ShapePath stroke/simple fill geometry
- Sprite batches, atlas frame UVs, texture upload cache, and sprite batch diagnostics
- `Text2D` through small raster textures
- complex ShapePath fill fallback through `shapePathFillFallback: "rasterize"`
- culling through the shared render pipeline
- static/dynamic render modes, static cache hits, and static run compaction
- context lost/restored lifecycle
- visual pixel coverage for Sprite, Text2D, ShapePath fallback, culling, and static cache signals

## Remaining Tradeoffs

Complex ShapePath fills are not converted into arbitrary GPU polygon geometry. Use the explicit raster fallback when holes, multiple subpaths, or self-intersections must appear in WebGL.

Text uses raster textures today. A glyph atlas or SDF text path can come later without moving text data out of `raw2d-text`.

Sprite sorting is opt-in. Raw2D does not reorder your scene automatically because texture-friendly sorting can change visual stacking.

Static batch vertices are projected into clip space, so camera moves, zoom changes, and renderer resizes rebuild static batches correctly.

## Performance Reading

Read WebGL stats in this order:

```ts
webglRenderer.render(scene, camera, { culling: true });
webglRenderer.render(scene, camera, { culling: true });

const stats = webglRenderer.getStats();

console.log(stats.renderList.total, stats.renderList.culled, stats.objects);
console.log(stats.drawCalls, stats.batches, stats.vertices);
console.log(stats.textureBinds, stats.textureUploads, stats.textureCacheHits);
console.log(stats.staticCacheHits, stats.staticCacheMisses);
console.log(stats.uploadedBytes);
```

Warm the static cache before timing. Compare Canvas and WebGL with the same scene, camera, viewport, and culling setting.

## Release Checks

```bash
npm run build:docs
node --test tests/browser/visual-pixel.test.mjs tests/webgl/visual-regression.test.mjs
```

The browser visual route exposes `window.__raw2dPixelResult`. Its WebGL coverage records Sprite, ShapePath, Text2D texture, culling, static batch, and static cache-hit signals.
