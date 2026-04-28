# Polygon

Polygon stores an ordered list of local points. The Canvas renderer closes the path, fills it, and strokes it when `lineWidth` is above zero.

WebGL triangulates simple polygons with ear clipping, so concave polygons can be filled without relying on a simple triangle fan. Holes and self-intersecting polygons are still outside the current Polygon scope.

```ts
import { BasicMaterial, Camera2D, Canvas, Polygon, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
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
raw2dCanvas.render(scene, camera);
```

## Parameters

- `x`, `y`: object position.
- `points`: local points closed in order.
- `material.fillColor`: fill color.
- `material.strokeColor`: stroke color.
- `material.lineWidth`: stroke width. Use `0` for no stroke.

## Concave Polygon

```ts
const polygon = new Polygon({
  x: 80,
  y: 60,
  points: [
    { x: 0, y: 0 },
    { x: 120, y: 0 },
    { x: 120, y: 100 },
    { x: 60, y: 48 },
    { x: 0, y: 100 }
  ],
  material: new BasicMaterial({ fillColor: "#22c55e" })
});
```

In WebGL this becomes three triangles before upload. The object API stays the same; only the renderer owns the triangulation step.
