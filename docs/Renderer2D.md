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

## Why It Exists

Raw2D will eventually need higher-level integrations, including a React fiber-style package. Those layers should not care whether rendering is Canvas or WebGL. They should receive a renderer, call the shared lifecycle, and leave renderer-specific control available for advanced users.
