# Camera World Bounds

`getCameraWorldBounds` returns the world-space rectangle currently visible through a `Camera2D`.

This is a small foundation helper for culling, minimaps, selection tools, viewport debugging, and future fit-to-screen helpers.

## Basic Usage

```ts
import { Camera2D, getCameraWorldBounds } from "raw2d";

const camera = new Camera2D({
  x: 100,
  y: 80,
  zoom: 2
});

const bounds = getCameraWorldBounds({
  camera,
  width: 800,
  height: 600
});

// bounds: x 100, y 80, width 400, height 300
```

## Culling Foundation

```ts
const visibleObjects = scene.getObjects().filter((object) => {
  const objectBounds = getWorldBounds({
    object,
    localBounds: getCoreLocalBounds(object)
  });

  return objectBounds.intersects(cameraBounds);
});
```

Raw2D does not hide this behind the renderer yet. Keep it explicit so engine builders can choose their own culling strategy.
