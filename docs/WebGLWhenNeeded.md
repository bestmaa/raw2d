# WebGL When Needed

Raw2D should start simple. Use Canvas first, then move to WebGL when real scene pressure appears.

## Canvas First Rule

Canvas is the reference renderer. Use it while learning, debugging, building new object behavior, or proving exact visual output.

```ts
import { Canvas } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
renderer.render(scene, camera);
```

## Move To WebGL When Needed

Use `WebGLRenderer2D` when the scene has many objects, many sprites, texture atlas usage, large static layers, or repeated redraws.

```ts
const shouldUseWebGL =
  objectCount > 500 ||
  spriteCount > 200 ||
  usesTextureAtlas ||
  hasLargeStaticLayers;
```

The scene and camera stay the same. Only the renderer changes.

## Compare Stats

Do not choose by renderer name. Measure the same scene.

```ts
canvasRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();

console.table({
  canvasDrawCalls: canvasRenderer.getStats().drawCalls,
  webglDrawCalls: stats.drawCalls,
  textureBinds: stats.textureBinds,
  staticCacheHits: stats.staticCacheHits,
  uploadedBytes: stats.uploadedBytes
});
```

## Safe Fallback

Keep Canvas as fallback for devices without WebGL2 or scenes that need Canvas-only behavior.

```ts
import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { Renderer2DLike } from "raw2d";

const renderer: Renderer2DLike = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });
```

## Tradeoff Summary

- Canvas: simple, complete, debug-friendly
- WebGL: batched, atlas-friendly, stats-driven
- Rule: keep the same `Scene` and `Camera2D`, swap only the renderer
