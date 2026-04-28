# WebGLRenderer2D

`WebGLRenderer2D` is Raw2D's WebGL2 renderer path. It is built to stay explicit: scene data enters `RenderPipeline`, the renderer creates ordered render runs, each run writes a buffer, and WebGL issues draw calls.

Current scope:

- renders `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, and convex `Polygon`
- renders `Sprite`
- uses cached world matrices from `RenderPipeline`
- batches consecutive shape objects by material key
- batches consecutive sprites by texture key
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

## Stats

```ts
renderer.render(scene, camera);
console.log(renderer.getStats());
```

Example:

```ts
{
  objects: 500,
  rects: 100,
  circles: 80,
  ellipses: 80,
  lines: 80,
  polylines: 80,
  polygons: 40,
  sprites: 40,
  textures: 1,
  batches: 240,
  staticBatches: 120,
  dynamicBatches: 120,
  staticObjects: 260,
  dynamicObjects: 240,
  vertices: 18000,
  drawCalls: 240,
  uploadBufferDataCalls: 1,
  uploadBufferSubDataCalls: 1,
  uploadedBytes: 432000,
  staticCacheHits: 0,
  staticCacheMisses: 120,
  unsupported: 0
}
```

`batches` and `drawCalls` stay separate from `objects` so you can see whether WebGL is actually reducing work. Upload stats show whether a frame grew GPU storage with `bufferData` or reused existing storage with `bufferSubData`. Static cache stats show whether static runs reused already uploaded buffers.

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
console.log(renderer.getStats().staticCacheMisses);
// 1

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheHits);
// 1

background.setSize(900, 600);

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1
```

The current WebGL vertex batches are already projected into clip space, so camera position, camera zoom, renderer width, and renderer height are part of the static cache key. Panning, zooming, or resizing the renderer rebuilds static batches correctly.

## Ordered Runs

The renderer does not hide the pipeline too much:

```text
Scene -> RenderPipeline -> RenderList -> RenderRun -> Buffer -> Shader -> DrawCall
```

Render runs are consecutive groups:

- shape run: `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, `Polygon`
- sprite run: `Sprite`
- unsupported run: counted but skipped

This makes WebGL behavior easy to debug and prepares Raw2D for future atlas and batch systems.

## Typed Array Reuse

`WebGLRenderer2D` keeps reusable float buffers for shape and sprite vertices. A frame can still upload dynamic vertex data, but the CPU-side `Float32Array` backing storage does not need to be recreated every render when capacity is already large enough.

```ts
const floatBuffer = new WebGLFloatBuffer();

const batch = createWebGLSpriteBatch({
  items: renderList.getFlatItems(),
  camera,
  width,
  height,
  getTextureKey,
  floatBuffer
});
```

This is the base for future static and dynamic batches.

## GPU Buffer Uploads

`WebGLRenderer2D` also keeps reusable GPU upload helpers:

```text
WebGLFloatBuffer -> Float32Array -> WebGLBufferUploader -> WebGLBuffer
```

The first large frame usually uses `bufferData` because GPU capacity must be created:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().uploadBufferDataCalls);
// 1
```

Later frames that fit the same capacity use `bufferSubData`:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().uploadBufferSubDataCalls);
// 1
```

This keeps dynamic rendering simple while static runs can keep their own cached uploaders.

## Current Limitations

- no automatic texture atlas packing yet
- no automatic static batch compaction yet
- no text WebGL path yet
- polygon batching expects convex polygons
- SVG texture sources should be rasterized to canvas before WebGL upload

Future work should keep the same transparent path while improving batching.
