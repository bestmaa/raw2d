# raw2d-webgl

WebGL2 renderer package for Raw2D.

This package is the batch-first renderer path. It keeps the render pipeline visible instead of hiding everything behind a black box:

```text
Scene -> RenderPipeline -> RenderRun -> Buffer -> Shader -> DrawCall
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

SVG texture sources should be rasterized to canvas before upload. Smarter atlas packing strategies and static batch compaction are future steps.

`WebGLRenderer2D` already uses `WebGLFloatBuffer` internally for shape and sprite batch data. Custom batch code can pass a `floatBuffer` option to `createWebGLShapeBatch` or `createWebGLSpriteBatch`.

It also uses `WebGLBufferUploader` internally. The first frame that needs more GPU capacity uses `bufferData`; later frames that fit the same capacity use `bufferSubData`.
