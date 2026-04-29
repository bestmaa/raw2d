# Rect

Rect ek simple rectangle object hai. Ye position, size, rotation, scale, origin, visibility, aur material data rakhta hai.

Rect khud canvas par draw nahi karta. Canvas ya WebGL renderer usko draw karta hai.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const raw2dCanvas = new Canvas({ canvas: canvasElement });

const rect = new Rect({
  x: 100,
  y: 100,
  width: 160,
  height: 90,
  material: new BasicMaterial({
    fillColor: "#35c2ff",
    strokeColor: "#f5f7fb",
    lineWidth: 2
  })
});

scene.add(rect);
raw2dCanvas.render(scene, camera);
```

## Update Rect

```ts
rect.setSize(220, 120);
rect.rotation += 0.1;
raw2dCanvas.render(scene, camera);
```

## Important Parameters

- `x`, `y`: world position
- `width`, `height`: rectangle size
- `rotation`: radians me rotation
- `scaleX`, `scaleY`: local scale
- `origin`: pivot point, jaise center ya top-left
- `material.fillColor`: fill color
- `material.strokeColor`: border color
- `material.lineWidth`: border thickness

## English Reference

Detailed English version: `docs/Rect.md`
