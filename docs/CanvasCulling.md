# Canvas Culling

Canvas culling lets `Canvas.render` skip objects that are outside the current camera viewport.

It is built for larger scenes where many objects exist in the world, but only a smaller part is visible on screen. Without culling, Canvas still checks every object and sends every visible object to the draw path. With culling enabled, Raw2D first compares each object's world bounds with the camera bounds, then draws only objects that intersect the viewport.

## What It Solves

Use Canvas culling when:

- the scene has many objects
- the camera shows only part of the world
- off-screen objects do not need to be drawn
- you want a simple Canvas performance win before WebGL batching exists

Do not use it because every scene must use it. Small scenes are often fine with normal rendering.

## Basic Usage

```ts
raw2dCanvas.render(scene, camera, {
  culling: true
});
```

This keeps the normal render flow:

```txt
clear canvas -> calculate camera bounds -> filter visible objects -> apply camera -> draw
```

## Full Example

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });

scene.add(new Rect({
  x: 40,
  y: 80,
  width: 120,
  height: 90,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

scene.add(new Rect({
  x: 1200,
  y: 80,
  width: 120,
  height: 90,
  material: new BasicMaterial({ fillColor: "#f45b69" })
}));

raw2dCanvas.render(scene, camera, { culling: true });
```

The second rect is far outside the viewport, so Canvas skips it while culling is enabled.

## Filter Before Drawing

`cullingFilter` lets you decide which objects are eligible for this render pass.

```ts
raw2dCanvas.render(scene, camera, {
  culling: true,
  cullingFilter: (object) => object.name.startsWith("enemy")
});
```

This is useful for custom passes, debug views, editor tools, or drawing only a category of objects.

## Relationship To Visible Objects

`getVisibleObjects` is a core helper for engine builders who want to inspect visible objects manually.

Canvas culling is the renderer-level version:

```ts
const visibleObjects = getVisibleObjects({ scene, camera, width, height });
raw2dCanvas.render(scene, camera, { culling: true });
```

Use `getVisibleObjects` when you need the list. Use Canvas culling when you only want the renderer to skip off-screen objects.

## Current Scope

Canvas culling currently supports Raw2D core shapes plus Canvas-supported `Sprite` and `Text2D` bounds.

It is intentionally explicit. Raw2D does not turn it on by default because culling has a small calculation cost, and tiny scenes may not benefit from it.
