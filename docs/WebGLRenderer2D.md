# WebGLRenderer2D

`WebGLRenderer2D` is Raw2D's WebGL2 renderer path. It is built to stay explicit: scene data enters `RenderPipeline`, the renderer creates ordered render runs, each run writes a buffer, and WebGL issues draw calls.

Current scope:

- renders `Rect`, `Circle`, `Ellipse`, `Arc`, `Line`, `Polyline`, simple `Polygon`, and simple ShapePath fill/stroke
- renders `Sprite`
- renders `Text2D` fill and optional stroke by rasterizing it to a canvas texture
- uses cached world matrices from `RenderPipeline`
- batches consecutive shape objects by material key
- batches consecutive sprites by texture key
- batches rasterized text through the texture path
- supports sprite frame UVs from `TextureAtlas`
- uploads textures through a small `WebGLTextureCache`
- reuses CPU-side typed arrays through `WebGLFloatBuffer`
- reuses GPU buffer capacity through `WebGLBufferUploader`
- separates static and dynamic render runs
- caches clean static render runs
- supports opt-in rasterized fallback for complex ShapePath fills
- reports batch, cache, texture, vertex, draw call, and upload stats

Canvas is still the complete renderer. WebGL is the performance path being built out.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Rect, Scene, WebGLRenderer2D } from "raw2d";

const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 100,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);
```

## Sprite Usage

```ts
import { Camera2D, Scene, Sprite, Texture, WebGLRenderer2D } from "raw2d";

const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

const sprite = new Sprite({
  texture,
  x: 80,
  y: 60,
  width: 64,
  height: 64,
  opacity: 0.9
});

scene.add(sprite);
renderer.render(scene, new Camera2D());
```

Sprites with the same `Texture` object are grouped only when they are consecutive in render order. They can use different atlas frames because each Sprite writes its own UV coordinates. Raw2D keeps ordering predictable instead of silently reordering the scene.

## Text2D Usage

```ts
import { BasicMaterial, Camera2D, Scene, Text2D, WebGLRenderer2D } from "raw2d";

const label = new Text2D({
  x: 80,
  y: 90,
  text: "GPU label",
  font: "28px sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
});

scene.add(label);
renderer.render(scene, new Camera2D());
```

Text2D is rasterized to a small canvas texture, then drawn through the texture batch path. Moving text reuses the raster texture. Changing text, font, alignment, baseline, or fill color rebuilds it.
If `strokeColor` differs from `fillColor`, WebGL also rasterizes the text stroke with `lineWidth`.

## Stats

```ts
renderer.render(scene, camera);
const stats = renderer.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.textureBinds);
console.log(stats.textTextureCacheHits);
console.log(stats.staticCacheHits);
console.log(stats.shapePathUnsupportedFills);
console.log(stats.renderList.culled);
console.log(stats.uploadedBytes);
```

`batches` and `drawCalls` stay separate from `objects` so you can see whether WebGL is actually reducing work. Texture stats show texture binding, first upload, and cache reuse. Text texture stats show frame-used raster text textures, cache hits, misses, evictions, and retired textures. Upload stats show whether a frame grew GPU storage with `bufferData` or reused existing storage with `bufferSubData`. Static cache stats show whether static runs reused already uploaded buffers.

`shapePathUnsupportedFills` reports ShapePath fills that direct WebGL geometry could not draw because the fill is not a single simple closed subpath. In `skip` and `warn` mode those fills are skipped. In `rasterize` mode the fill is drawn through a cached canvas texture fallback. ShapePath stroke can still render as WebGL geometry.

`objects` is the accepted render-list item count. Use `renderList.total`, `renderList.accepted`, and `renderList.culled` to inspect what the pipeline did before batching.

## Culling And Render Lists

Use culling when objects outside the camera viewport should be skipped before WebGL batch writing:

```ts
renderer.render(scene, camera, { culling: true });
console.log(renderer.getStats().renderList);
```

You can also prebuild a render list and reuse it for the same frame:

```ts
const renderList = renderer.createRenderList(scene, camera, {
  culling: true
});

renderer.render(scene, camera, { renderList });
```

This keeps the pipeline explicit: `Scene -> RenderPipeline -> RenderList -> WebGL batches`.

## ShapePath Fill Fallback Policy

The default ShapePath fill fallback mode is `skip`. Unsupported WebGL fills are skipped and counted in `shapePathUnsupportedFills`.

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "skip"
});
```

Use `warn` when an app or editor should surface skipped fills during development:

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "warn",
  onShapePathFillFallback: (fallback) => {
    console.warn(fallback.objectId, fallback.objectName, fallback.reason);
  }
});
```

Current fallback modes:

- `skip`: silently skip unsupported ShapePath fills and report the count in stats
- `warn`: skip the fill and emit a callback, or `console.warn` when no callback is provided
- `rasterize`: draw unsupported fills to an offscreen canvas texture, then render that texture in WebGL

Use `rasterize` when a WebGL scene needs holes, multiple subpaths, or self-intersecting fills to appear:

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "rasterize"
});
```

The fallback is explicit because it trades pure GPU geometry for visual compatibility. It can increase texture uploads when complex paths change often. Moving, rotating, or scaling the ShapePath reuses the cached fallback texture.

## Static And Dynamic Runs

Every `Object2D` has a `renderMode`:

```ts
background.setRenderMode("static");
player.setRenderMode("dynamic");
```

WebGL render runs split when the mode changes. Static runs are cached after their first upload. If the objects, materials, camera, viewport, and sprite textures stay the same, the next render reuses the cached GPU buffer and skips vertex upload for that run.

Object and material versions provide the invalidation signal:

```ts
background.setRenderMode("static");
background.markClean();
background.setSize(900, 600);

console.log(background.getDirtyState());
// { version: 2, dirty: true }
```

## Static Batch Cache

Static cache behavior is visible through renderer stats:

```ts
background.setRenderMode("static");
renderer.render(scene, camera);
const miss = renderer.getStats().staticCacheMisses;
renderer.render(scene, camera);
const hit = renderer.getStats().staticCacheHits;
background.setSize(900, 600);
renderer.render(scene, camera);
const rebuilt = renderer.getStats().staticCacheMisses;
```

The current WebGL vertex batches are already projected into clip space, so camera position, camera zoom, renderer width, and renderer height are part of the static cache key. Panning, zooming, or resizing the renderer rebuilds static batches correctly.

## GPU Buffer Uploads

`WebGLRenderer2D` also keeps reusable GPU upload helpers:

```text
WebGLFloatBuffer -> Float32Array -> WebGLBufferUploader -> WebGLBuffer
```

The first large frame usually uses `bufferData`; later frames that fit the same capacity use `bufferSubData`:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().uploadBufferDataCalls);

renderer.render(scene, camera);
console.log(renderer.getStats().uploadBufferSubDataCalls);
```

This keeps dynamic rendering simple while static runs can keep their own cached uploaders.

## Current Limitations

- no advanced texture atlas bin packing yet
- no automatic static batch compaction yet
- no glyph atlas or SDF text path yet
- direct ShapePath fill supports one simple closed subpath only; complex fills need `shapePathFillFallback: "rasterize"` for texture fallback
- arc curves are approximated with line segments or triangle fans
- polygon batching supports simple polygons, but not holes or self-intersections
- SVG texture sources should be rasterized to canvas before WebGL upload
