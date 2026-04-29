# Line

Line ek stroke-based object hai. Isme start point aur end point local coordinates me hote hain, aur object ka `x`, `y`, rotation, scale world transform deta hai.

Line ke liye `strokeColor` aur `lineWidth` important hote hain. `fillColor` ka use line drawing me nahi hota.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Canvas, Line, Scene } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const raw2dCanvas = new Canvas({ canvas: canvasElement });

const line = new Line({
  x: 100,
  y: 120,
  startX: 0,
  startY: 0,
  endX: 360,
  endY: 7,
  material: new BasicMaterial({
    strokeColor: "#facc15",
    lineWidth: 6
  })
});

scene.add(line);
raw2dCanvas.render(scene, camera);
```

## Update Points

```ts
line.setPoints(0, 0, 260, 80);
raw2dCanvas.render(scene, camera);
```

## Important Parameters

- `x`, `y`: line object ki world position
- `startX`, `startY`: local start point
- `endX`, `endY`: local end point
- `material.strokeColor`: line color
- `material.lineWidth`: line thickness
- `pickTolerance`: hit testing ke waqt line ko select karna easy banata hai

## English Reference

Detailed English version: `docs/Line.md`
