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

## Kyu Important Hai

Future React fiber-style package aur editor tools ko renderer swap karna easy hona chahiye. Isliye shared API small hai, aur advanced control concrete renderer classes me rakha gaya hai.

## English Reference

Detailed English version: `docs/Renderer2D.md`
