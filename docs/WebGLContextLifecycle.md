# WebGL Context Lifecycle

Browsers can lose a WebGL context when GPU memory is under pressure, the tab is moved between GPUs, or the driver resets. When that happens, all WebGL textures, buffers, and shader programs become invalid.

Raw2D handles the browser events and keeps the state visible.

## Context Lost

`WebGLRenderer2D` listens for `webglcontextlost`, calls `preventDefault()`, and marks itself as lost:

```ts
console.log(renderer.isContextLost());
// false
```

When the context is lost, `render()` skips WebGL work and resets frame stats to an empty frame:

```ts
renderer.render(scene, camera);

if (renderer.isContextLost()) {
  console.log("Waiting for WebGL restore");
}
```

This avoids calling draw or upload commands while the browser is rebuilding the GPU context.

## Context Restored

When the browser fires `webglcontextrestored`, Raw2D recreates:

- shader programs
- dynamic and static buffer uploaders
- static batch caches
- sprite texture cache
- rasterized text texture cache

After restore, the next `render()` uploads visible textures and buffers again:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().textureUploads);
```

Your scene objects stay the same. Only GPU-side resources are rebuilt.

## App Loop Pattern

Keep the animation loop simple:

```ts
function frame(): void {
  if (!renderer.isContextLost()) {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(frame);
}

frame();
```

If your app shows a warning overlay, clear it after `isContextLost()` becomes `false`.

## Dispose Still Matters

Context restore is automatic, but disposal is still explicit:

```ts
renderer.dispose();
```

Use `dispose()` when the canvas is removed. Use `clearTextureCache()` when assets unload but the renderer stays alive.
