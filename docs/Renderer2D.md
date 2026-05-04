# Renderer2D

`Renderer2DLike` is the shared renderer contract in `raw2d-core`.

It lets higher-level tools accept either `Canvas` or `WebGLRenderer2D` without hard-coding one renderer.

## Contract

```ts
import type { Renderer2DLike } from "raw2d-core";

function drawFrame(renderer: Renderer2DLike, scene: Scene, camera: Camera2D): void {
  renderer.render(scene, camera, { culling: true });
}
```

The shared surface is intentionally small:

- `render(scene, camera, options?)`
- `createRenderList(scene?, camera?, options?)`
- `clear(color?)`
- `setSize(width, height)`
- `getSize()`
- `getStats()`
- `getSupport()`
- `setBackgroundColor(color)`
- `dispose()`

## Canvas And WebGL

```ts
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
import type { Renderer2DLike } from "raw2d-core";

const renderer: Renderer2DLike = useWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });

renderer.render(scene, camera);
```

Canvas and WebGL still keep their focused APIs. WebGL exposes extra methods such as `clearTextureCache()` and `isContextLost()`. Use the common contract when generic tooling only needs the renderer lifecycle.

## Decision Guide

Use Canvas when:

- the scene is small or medium
- exact Canvas path behavior matters
- you are debugging shape, origin, bounds, or interaction logic
- unsupported WebGL objects should still render

Use WebGLRenderer2D when:

- many sprites or repeated redraws are the bottleneck
- atlas packing can reduce texture binds
- static objects can reuse cached buffers
- draw calls, uploads, and batching diagnostics should be visible

```ts
const shouldUseWebGL =
  spriteCount > 200 ||
  objectCount > 500 ||
  needsStaticBatchCache ||
  needsAtlasBatching;

const renderer: Renderer2DLike = shouldUseWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });
```

The same `Scene` and `Camera2D` can be rendered by either renderer. That keeps renderer choice explicit instead of leaking drawing logic into objects.

## Compare Real Stats

```ts
canvasRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

console.table({
  canvasDrawCalls: canvasRenderer.getStats().drawCalls,
  webglDrawCalls: webglRenderer.getStats().drawCalls,
  textureBinds: webglRenderer.getStats().textureBinds,
  staticCacheHits: webglRenderer.getStats().staticCacheHits
});
```

Benchmark with the actual scene. Canvas can be faster for tiny scenes because it has less setup overhead. WebGL should win when batching, atlas reuse, and static cache reuse reduce repeated CPU/GPU work.

## Shared Render Options

Canvas and WebGL both accept the common render options:

```ts
renderer.render(scene, camera, {
  culling: true
});
```

You can also build a render list once and pass it into a renderer:

```ts
const renderList = renderer.createRenderList(scene, camera, { culling: true });

renderer.render(scene, camera, { renderList });
```

Canvas adds `cullingFilter` for Canvas-specific filtering. WebGL keeps WebGL-only controls on `WebGLRenderer2D`.

## Shared Stats

Both public renderers expose the same base stats:

```ts
const stats = renderer.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.renderList.total);
console.log(stats.renderList.culled);
```

WebGL returns more stats on top, including batches, texture binds, upload bytes, and cache hits.

## Support Profile

```ts
const support = renderer.getSupport();

console.log(support.renderer);
console.log(support.objects.Text2D);
console.log(support.notes.Text2D);
```

Use this in docs, tools, and future integrations when you need renderer capability checks from the active renderer instance.

## Why It Exists

Raw2D will eventually need higher-level integrations, including a React fiber-style package. Those layers should not care whether rendering is Canvas or WebGL. They should receive a renderer, call the shared lifecycle, and leave renderer-specific control available for advanced users.
