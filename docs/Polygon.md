# Polygon

Polygon stores an ordered list of local points. The Canvas renderer closes the path, fills it, and strokes it when `lineWidth` is above zero.

```ts
import { BasicMaterial, Camera2D, Canvas, Polygon, Scene } from "raw2d";

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const polygon = new Polygon({
  x: 110,
  y: 55,
  points: [
    { x: 80, y: 0 },
    { x: 260, y: 70 },
    { x: 40, y: 160 }
  ],
  material: new BasicMaterial({
    fillColor: "#22c55e",
    strokeColor: "#bbf7d0",
    lineWidth: 3
  })
});

scene.add(polygon);
rawCanvas.render(scene, camera);
```

## Parameters

- `x`, `y`: object position.
- `points`: local points closed in order.
- `material.fillColor`: fill color.
- `material.strokeColor`: stroke color.
- `material.lineWidth`: stroke width. Use `0` for no stroke.
