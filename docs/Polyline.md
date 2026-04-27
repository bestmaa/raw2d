# Polyline

Polyline stores an ordered list of local points. The Canvas renderer connects those points with one open stroked path.

```ts
import { BasicMaterial, Camera2D, Canvas, Polyline, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const polyline = new Polyline({
  x: 85,
  y: 70,
  points: [
    { x: 0, y: 120 },
    { x: 120, y: 20 },
    { x: 320, y: 150 }
  ],
  material: new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 6 })
});

scene.add(polyline);
raw2dCanvas.render(scene, camera);
```

## Parameters

- `x`, `y`: object position.
- `points`: local points connected in order.
- `material.strokeColor`: stroke color.
- `material.lineWidth`: stroke width.
