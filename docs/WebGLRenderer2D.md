# WebGLRenderer2D

`WebGLRenderer2D` is Raw2D's WebGL2 renderer path. It is built to stay explicit: scene data enters `RenderPipeline`, the renderer creates ordered render runs, each run writes a buffer, and WebGL issues draw calls.

Current scope:

- renders `Rect`, `Circle`, `Ellipse`, `Arc`, `Line`, `Polyline`, and simple `Polygon`
- renders `Sprite`
- renders `Text2D` by rasterizing it to a canvas texture
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

Text2D is rasterized to a small canvas texture, then drawn through the texture batch path. Changing text, font, or fill color rebuilds the text texture.

## Stats

```ts
renderer.render(scene, camera);
const stats = renderer.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.textureBinds);
console.log(stats.staticCacheHits);
console.log(stats.uploadedBytes);
```

`batches` and `drawCalls` stay separate from `objects` so you can see whether WebGL is actually reducing work. Texture stats show texture binding, first upload, and cache reuse. Upload stats show whether a frame grew GPU storage with `bufferData` or reused existing storage with `bufferSubData`. Static cache stats show whether static runs reused already uploaded buffers.

## Texture Stats

Texture stats help prove whether atlas batching is reducing WebGL state changes:

```ts
// separate textures: { textures: 3, textureBinds: 3, textureUploads: 3 }
// packed atlas: { textures: 1, textureBinds: 1, textureUploads: 1 }
webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureCacheHits);
// 1
```

## Static And Dynamic Runs

Every `Object2D` has a `renderMode`:

```ts
background.setRenderMode("static");
player.setRenderMode("dynamic");
```

WebGL render runs split when the mode changes. A static shape run and a dynamic shape run use separate upload channels:

```text
Scene -> RenderPipeline -> RenderRun(static) -> Buffer -> DrawCall
Scene -> RenderPipeline -> RenderRun(dynamic) -> Buffer -> DrawCall
```

Static runs are cached after their first upload. If the objects, materials, camera, viewport, and sprite textures stay the same, the next render reuses the cached GPU buffer and skips vertex upload for that run.

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

## Static Sprites

Use static mode for tile maps, background sprites, and decoration that rarely changes:

```ts
tileSprite.setRenderMode("static");
renderer.render(scene, camera);
renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheHits);
```

Changing a static Sprite frame rebuilds that static run:

```ts
tileSprite.setFrame(atlas.getFrame("grass-alt"));
renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
```

Animated sprites should stay dynamic because their frame changes often:

```ts
playerSprite.setRenderMode("dynamic");
```

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

## Frame Timing

Renderer stats explain what WebGL did. Browser timing estimates one render pass:

```ts
const start = performance.now();
renderer.render(scene, camera);
const frameMs = performance.now() - start;

console.log({ frameMs, fps: 1000 / frameMs, stats: renderer.getStats() });
```

When checking static cache cost, warm the cache and time the second pass:

```ts
renderer.render(scene, camera);
const start = performance.now();
renderer.render(scene, camera);
const cachedFrameMs = performance.now() - start;
```

Browser timing is approximate. Use it for relative Canvas/WebGL comparisons.

## Current Limitations

- no advanced texture atlas bin packing yet
- no automatic static batch compaction yet
- no glyph atlas or SDF text path yet
- arc curves are approximated with line segments or triangle fans
- polygon batching supports simple polygons, but not holes or self-intersections
- SVG texture sources should be rasterized to canvas before WebGL upload
