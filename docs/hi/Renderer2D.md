# Renderer2D

`Renderer2DLike` Raw2D ka shared renderer contract hai. Iska use tab hota hai jab aapka tool Canvas aur WebGL dono ke saath kaam kare, bina renderer-specific code likhe.

## Basic Idea

```ts
import type { Renderer2DLike } from "raw2d-core";

function drawFrame(renderer: Renderer2DLike, scene: Scene, camera: Camera2D): void {
  renderer.render(scene, camera, { culling: true });
}
```

## Common Lifecycle

Dono public renderers ye common methods dete hain:

- `render(scene, camera, options?)`
- `createRenderList(scene?, camera?, options?)`
- `clear(color?)`
- `setSize(width, height)`
- `getSize()`
- `getStats()`
- `getSupport()`
- `setBackgroundColor(color)`
- `dispose()`

## Canvas Ya WebGL Choose Karna

```ts
const renderer: Renderer2DLike = useWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });

renderer.setSize(800, 600);
renderer.render(scene, camera);
```

## Decision Guide

Canvas use karein jab:

- scene small ya medium ho
- exact Canvas path behavior important ho
- shape, origin, bounds ya interaction debug karna ho
- WebGL unsupported objects ko bhi render karna ho

WebGLRenderer2D use karein jab:

- bahut saare sprites ya repeated redraws bottleneck ban rahe hon
- atlas packing se texture binds kam ho sakte hon
- static objects cached buffers reuse kar sakte hon
- draw calls, uploads aur batching diagnostics dekhne hon

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

Same `Scene` aur `Camera2D` dono renderers ke saath use ho sakte hain. Isse renderer choice explicit rahti hai.

## Real Stats Compare Karein

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

Actual scene benchmark karein. Tiny scenes me Canvas faster ho sakta hai kyunki setup overhead kam hota hai. WebGL tab useful hota hai jab batching, atlas reuse aur static cache repeated work ko kam kare.

## Shared Stats

Generic tools Canvas aur WebGL dono se same base stats read kar sakte hain:

```ts
const stats = renderer.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.renderList.total);
console.log(stats.renderList.culled);
```

WebGL iske upar extra stats deta hai, jaise `batches`, `textureBinds`, `uploadedBytes`, aur `staticCacheHits`.

## Support Profile

```ts
const support = renderer.getSupport();

console.log(support.renderer);
console.log(support.objects.Text2D);
console.log(support.notes.Text2D);
```

Iska use editor UI, docs, ya future React wrapper me kar sakte ho jab active renderer ki capability check karni ho.

## Kyu Important Hai

Future React fiber-style package aur editor tools ko renderer swap karna easy hona chahiye. Isliye shared API small hai, aur advanced control concrete renderer classes me rakha gaya hai.

## English Reference

Detailed English version: `docs/Renderer2D.md`
