# WebGL Completion Status

`WebGLRenderer2D` ab Raw2D ka batch-first performance renderer hai. Isme shape geometry, Sprites, atlas frames, rasterized `Text2D`, culling, texture cache, static batch cache, static run compaction, context recovery, aur visual parity checks cover hain.

Canvas abhi bhi complete reference renderer hai. WebGL path intentionally explicit hai:

```text
Scene -> RenderPipeline -> RenderRun -> Batcher -> Buffer -> Shader -> DrawCall
```

## Covered

- `Rect`, `Circle`, `Ellipse`, `Arc`, `Line`, `Polyline`, simple `Polygon`, aur ShapePath stroke/simple fill geometry
- Sprite batches, atlas frame UVs, texture upload cache, aur sprite diagnostics
- `Text2D` chhote raster texture ke through
- complex ShapePath fill fallback through `shapePathFillFallback: "rasterize"`
- shared render pipeline culling
- static/dynamic render modes, static cache hits, aur static run compaction
- context lost/restored lifecycle
- Sprite, Text2D, ShapePath fallback, culling, aur static cache visual pixel coverage

## Tradeoffs

Complex ShapePath fills arbitrary GPU polygon geometry me convert nahi hote. Holes, multiple subpaths, ya self-intersections ke liye explicit raster fallback use karein.

Text abhi raster textures use karta hai. Future glyph atlas ya SDF text path aa sakta hai bina `raw2d-text` data boundary todhe.

Sprite sorting opt-in hai. Raw2D scene ko automatically reorder nahi karta, kyunki texture-friendly sorting visual stacking change kar sakti hai.

Static batch vertices clip space me projected hain, isliye camera move, zoom, ya renderer resize static batches ko correctly rebuild karte hain.

## Performance Reading

Stats ko is order me padhein:

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

Timing se pehle static cache warm karein. Canvas aur WebGL ko same scene, camera, viewport, aur culling setting ke saath compare karein.
