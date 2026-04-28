# Renderer2D

`Renderer2DLike` is the shared renderer contract in `raw2d-core`.

It lets higher-level tools accept either `Canvas` or `WebGLRenderer2D` without hard-coding one renderer.

## Contract

```ts
import type { Renderer2DLike } from "raw2d-core";

function drawFrame(renderer: Renderer2DLike, scene: Scene, camera: Camera2D): void {
  renderer.render(scene, camera);
}
```

The shared surface is intentionally small:

- `render(scene, camera, options?)`
- `createRenderList(scene?, camera?, options?)`
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

## Why It Exists

Raw2D will eventually need higher-level integrations, including a React fiber-style package. Those layers should not care whether rendering is Canvas or WebGL. They should receive a renderer, call the shared lifecycle, and leave renderer-specific control available for advanced users.
