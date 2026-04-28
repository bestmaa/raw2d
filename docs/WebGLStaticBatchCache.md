# WebGL Static Batch Cache

`WebGLStaticBatchCache` stores prepared static WebGL batches and their GPU uploaders.

It is an internal WebGL foundation. Most app code should use it through `WebGLRenderer2D`, `renderMode`, and renderer stats.

## Why It Exists

Dynamic objects are uploaded often. Static objects should not upload the same vertex data every frame.

```text
Scene -> RenderRun(static) -> StaticBatchCache -> DrawCall
Scene -> RenderRun(dynamic) -> DynamicUploader -> DrawCall
```

This keeps Raw2D low-level and transparent: static runs are still visible in stats, and cache reuse is explicit.

## Renderer Usage

```ts
import { Camera2D, Rect, Scene, WebGLRenderer2D } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const renderer = new WebGLRenderer2D({ canvas: canvasElement });

const background = new Rect({
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  renderMode: "static"
});

scene.add(background);

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheHits);
// 1
```

## Invalidation

The cache key includes:

- render run type
- static object order
- object versions
- material versions
- sprite texture identity
- camera x, y, and zoom
- renderer width and height

Camera and viewport are included because current WebGL batches are stored as clip-space vertices.

```ts
background.setSize(900, 600);

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1
```

When a static object changes, its version changes, so the renderer creates a new static batch.

## Advanced Direct Use

Custom WebGL tooling can use the cache directly, but normal apps should not need this.

```ts
const cache = new WebGLStaticBatchCache<WebGLShapeBatch>(gl);

cache.beginFrame();

const entry = cache.get("run-a", "run-a:v1");

if (!entry) {
  const nextEntry = cache.set("run-a", "run-a:v2", batch);
  nextEntry.uploader.upload(batch.vertices);
}

cache.sweep();
```

`beginFrame()` marks the frame. `sweep()` removes stale entries that were not used during that frame.
