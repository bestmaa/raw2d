# raw2d-webgl

WebGL2 renderer package for Raw2D.

This package is the batch-first renderer path. It keeps the render pipeline visible instead of hiding everything behind a black box:

```text
Scene -> RenderPipeline -> RenderRun -> Buffer -> Shader -> DrawCall
```

Effect work keeps the same transparent boundary:

```text
Raw2DEffect[] -> WebGLEffectPassPlan -> draw-batch pass | framebuffer shader pass
```

Current support:

- `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, convex `Polygon`
- `Sprite`
- `Text2D` fill and optional stroke through rasterized canvas textures
- complex `ShapePath` fill fallback through opt-in rasterized textures
- ordered shape material batches
- material-driven stroke caps and joins
- configurable curve sampling for WebGL curve quality
- ordered sprite texture batches
- rasterized text texture batches
- static and dynamic render run separation
- sprite frame UVs from `TextureAtlas`
- texture upload cache
- reusable CPU-side float buffers
- reusable GPU buffer upload capacity
- static batch cache for clean static runs
- static run compaction for adjacent clean WebGL runs
- explicit effect pass planning for opacity, grayscale, blur, and shadow
- render stats for objects, sprites, textures, batches, vertices, draw calls, buffer uploads, and unsupported objects

## Usage

```ts
import { Camera2D, Rect, Scene } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { WebGLRenderer2D, isWebGL2Available } from "raw2d-webgl";

if (!isWebGL2Available({ canvas: canvasElement })) {
  throw new Error("WebGL2 is not available.");
}

const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D();
const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

scene.add(new Rect({ x: 40, y: 40, width: 80, height: 50 }));
scene.add(new Sprite({ texture, x: 160, y: 40, width: 64, height: 64 }));

renderer.render(scene, camera);
console.log(renderer.getStats());
```

## Effect Boundary

`raw2d-webgl` does not put effect data into `raw2d-core`. Effects stay in `raw2d-effects`, while WebGL owns the renderer-specific pass plan:

```ts
import { createBlurEffect, createOpacityEffect } from "raw2d-effects";
import { createWebGLEffectPassPlan } from "raw2d-webgl";

const plan = createWebGLEffectPassPlan({
  effects: [createOpacityEffect(0.8), createBlurEffect(4)]
});

console.log(plan.inlinePasses);
console.log(plan.shaderPasses);
console.log(plan.requiresFramebuffer);
```

This is a boundary helper, not full WebGL effect execution yet. Opacity is planned as a future draw-batch alpha pass. Grayscale, blur, and shadow are planned as framebuffer shader passes because they need rendered pixels instead of scene object data.

## Notes

Sprite batching uses the same `Texture` object as the texture key. Consecutive Sprites with the same Texture are merged into one draw call, even when they use different atlas frames. Raw2D does not reorder across unrelated objects, so scene order remains predictable.

`Text2D` is rendered by rasterizing fill and optional stroke text to a small canvas texture, then drawing that texture through the same ordered texture batch path. Moving text reuses the texture; changing text or material style rebuilds it. Glyph atlas and SDF text can come later without changing `Text2D` object data.

Complex `ShapePath` fills can use an explicit texture fallback:

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "rasterize"
});
```

The fallback rasterizes unsupported fills to a cached canvas texture. Direct WebGL geometry is still used for simple closed fills and strokes.

Stroke style comes from `BasicMaterial`:

```ts
const material = new BasicMaterial({
  strokeColor: "#facc15",
  lineWidth: 6,
  strokeCap: "round",
  strokeJoin: "round",
  miterLimit: 8
});
```

The stroke cap, join, and miter limit are included in the material batch key.

Curve quality is explicit. WebGL approximates curves with segments, so higher values look smoother and write more vertices:

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  curveSegments: 48
});

renderer.render(scene, camera, { curveSegments: 16 });
```

The constructor option sets the default. The render option overrides one frame. Values below `8` are clamped.

Use `TextureAtlasPacker` from `raw2d-sprite` when separate sprite images should become one atlas texture:

```ts
const result = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 1024,
  maxHeight: 1024,
  sort: "area"
}).packWithStats([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage }
]);
const atlas = result.atlas;

scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle") }));
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run") }));

renderer.render(scene, camera);
console.log(renderer.getStats().textures);
// 1
```

Texture stats make this visible:

```ts
// separate textures:
// { textures: 2, textureBinds: 2, textureUploads: 2 }

// packed atlas:
// { textures: 1, textureBinds: 1, textureUploads: 1 }
```

`edgeBleed` copies source edge pixels into atlas padding, which helps reduce thin filtering seams between packed frames.

When a texture has already been uploaded, later frames report cache reuse:

```ts
renderer.render(scene, camera);
renderer.render(scene, camera);

console.log(renderer.getStats().textureCacheHits);
```

Clear texture caches when an asset pack or document is unloaded:

```ts
renderer.clearTextureCache();
console.log(renderer.getTextureCacheSize());
console.log(renderer.getTextTextureCacheSize());
```

Dispose the renderer when the canvas is removed:

```ts
renderer.dispose();
```

`dispose()` releases cached textures, rasterized text textures, static batch buffers, dynamic upload buffers, and shader programs. Create a new renderer after disposal.

WebGL context loss is handled by the renderer. While the browser context is lost, `render()` skips GPU work. After `webglcontextrestored`, Raw2D recreates programs, uploaders, static caches, and texture caches:

```ts
if (!renderer.isContextLost()) {
  renderer.render(scene, camera);
}
```

Static sprites can also reuse their vertex buffer:

```ts
tileSprite.setRenderMode("static");

renderer.render(scene, camera);
renderer.render(scene, camera);

console.log(renderer.getStats().staticCacheHits);
// 1
```

Keep animated sprites dynamic because changing `sprite.frame` invalidates static sprite cache data.

Adjacent clean static shape or sprite runs are compacted before rendering:

```ts
import { compactWebGLStaticRuns } from "raw2d-webgl";

const result = compactWebGLStaticRuns({ runs });

console.log(result.inputRuns);
console.log(result.outputRuns);
console.log(result.compactedRuns);
console.log(result.mergedStaticObjects);
```

Compaction does not reorder the scene and does not cross dynamic, unsupported, or shape/sprite boundaries. The helper exposes the same diagnostics that the renderer uses internally, so custom pipelines can inspect exactly what was merged.

## Performance Reading

Render twice when measuring static cache:

```ts
renderer.render(scene, camera);
renderer.render(scene, camera);

const stats = renderer.getStats();

console.log(stats.drawCalls);
console.log(stats.textureBinds);
console.log(stats.staticCacheHits);
console.log(stats.uploadedBytes);
```

Packed atlas sprites should reduce `textureBinds`. Clean static runs should increase `staticCacheHits` and reduce vertex upload bytes after the first frame.

Measure frame timing around the render call when comparing Canvas and WebGL in a browser:

```ts
const start = performance.now();
renderer.render(scene, camera);
const frameMs = performance.now() - start;
const fps = frameMs > 0 ? 1000 / frameMs : 0;

console.log({ frameMs, fps, stats: renderer.getStats() });
```

For static cache timing, warm the cache first and time the second pass. Browser timing is approximate and should be used for relative checks before deeper profiling.

Use `object.setRenderMode("static")` for rarely changing objects and `object.setRenderMode("dynamic")` for animated or frequently changing objects. WebGL splits render runs by mode and reports `staticBatches`, `dynamicBatches`, `staticObjects`, `dynamicObjects`, `staticCacheHits`, and `staticCacheMisses`.

Object and material versions invalidate static cached batches:

```ts
staticRect.setRenderMode("static");

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheHits);
// 1

staticRect.setSize(200, 120);

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1
```

SVG texture sources should be rasterized to canvas before upload. WebGL intentionally accepts raster `Texture` sources and leaves SVG-specific conversion in `raw2d-sprite`.

Raw2D keeps Canvas as the complete reference renderer. WebGL is the batch-first performance path for large, texture-heavy, or mostly static scenes. Remaining tradeoffs are explicit: complex ShapePath fills use the raster fallback, Text2D uses raster textures rather than a glyph atlas, sprite sorting is opt-in, and static batches rebuild when camera or viewport inputs change.

`WebGLRenderer2D` already uses `WebGLFloatBuffer` internally for shape and sprite batch data. Custom batch code can pass a `floatBuffer` option to `createWebGLShapeBatch` or `createWebGLSpriteBatch`.

It also uses `WebGLBufferUploader` internally. The first frame that needs more GPU capacity uses `bufferData`; later frames that fit the same capacity use `bufferSubData`.
