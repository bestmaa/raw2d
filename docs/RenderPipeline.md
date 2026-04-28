# Render Pipeline

RenderPipeline prepares scene data before any renderer draws.

It is the transparent middle layer of Raw2D:

```txt
Scene -> RenderPipeline -> RenderList -> Renderer
```

Canvas uses it now. WebGL can use the same render list later for batching, buffers, shaders, and draw calls.

## Why It Exists

Renderers should not do every decision inline. A renderer should draw prepared work.

RenderPipeline handles:

- scene object traversal
- `Group2D` child hierarchy
- object visibility
- optional filtering
- optional culling
- stable `zIndex` sorting
- render item metadata
- debug stats

This keeps Raw2D low-level and readable without hiding the render flow.

## Canvas Usage

For normal rendering, Canvas builds the render list internally:

```ts
raw2dCanvas.render(scene, camera, {
  culling: true
});
```

For debugging or tooling, build the list yourself:

```ts
const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());
raw2dCanvas.render(scene, camera, { renderList });
```

## Inspect Items

Use root items when you need hierarchy. Use flat items when you need a debug table or future batching input.

```ts
const rootItems = renderList.getRootItems();
const flatItems = renderList.getFlatItems();

for (const item of flatItems) {
  console.log({
    id: item.id,
    depth: item.depth,
    zIndex: item.zIndex,
    bounds: item.bounds
  });
}
```

## Stats

Stats explain what happened during preparation:

```ts
const stats = renderList.getStats();

console.log(stats.total);
console.log(stats.accepted);
console.log(stats.hidden);
console.log(stats.filtered);
console.log(stats.culled);
```

This is useful for debugging culling, editor tools, and future performance overlays.

## Custom Pipeline

Engine builders can create `RenderPipeline` directly.

```ts
import {
  RenderPipeline,
  getCoreLocalBounds,
  getWorldBounds
} from "raw2d";

const pipeline = new RenderPipeline({
  boundsProvider: (object) => getWorldBounds({
    object,
    localBounds: getCoreLocalBounds(object)
  })
});

const renderList = pipeline.build({
  scene,
  camera,
  viewport: { width: 800, height: 600 },
  culling: true,
  filter: (object) => object.visible
});
```

## WebGL Direction

The future WebGL path should stay explicit:

```txt
Scene -> RenderPipeline -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall
```

RenderPipeline does not batch yet. It prepares the data that a batcher can consume.

## Current Scope

Nested group culling is intentionally conservative for now. Canvas preserves group hierarchy, and deeper group-aware bounds can be added separately without changing the public pipeline shape.

