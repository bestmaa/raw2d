# WebGL Kab Use Karna Hai

Raw2D me pehle simple start karein. Canvas se shuru karein, phir WebGL par tab switch karein jab scene me real performance pressure dikhe.

## Canvas First Rule

Canvas reference renderer hai. Learning, debugging, new object behavior, ya visual output verify karne ke liye pehle Canvas use karein.

```ts
import { Canvas } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
renderer.render(scene, camera);
```

## WebGL Kab Use Karein

`WebGLRenderer2D` tab use karein jab scene me bahut objects, bahut sprites, texture atlas, large static layers, ya repeated redraws hon.

```ts
const shouldUseWebGL =
  objectCount > 500 ||
  spriteCount > 200 ||
  usesTextureAtlas ||
  hasLargeStaticLayers;
```

Scene aur camera same rahte hain. Sirf renderer change hota hai, isliye app ka data model stable rehta hai.

## Stats Compare Karein

Renderer ke naam se decide mat karein. Same scene ko Canvas aur WebGL dono me measure karein.

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

Jahan WebGL2 available nahi hai, ya scene ko Canvas-only behavior chahiye, wahan Canvas fallback rakhein.

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
- Practical rule: same `Scene` aur `Camera2D` rakhein, sirf renderer swap karein
