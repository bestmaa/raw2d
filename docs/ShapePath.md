# ShapePath

ShapePath stores explicit path commands. It is useful for custom 2D shapes that do not fit Rect, Circle, Line, Polyline, or Polygon.

Canvas renders ShapePath fill and stroke with native path commands. WebGL supports flattened ShapePath stroke and simple closed ShapePath fill. Complex fill rules, holes, and self-intersections are still future work.

```ts
import { BasicMaterial, Camera2D, Canvas, Scene, ShapePath } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const shapePath = new ShapePath({
  x: 105,
  y: 55,
  material: new BasicMaterial({
    fillColor: "#38bdf8",
    strokeColor: "#f5f7fb",
    lineWidth: 3
  })
});

shapePath
  .moveTo(0, 95)
  .quadraticCurveTo(260, 18, 300, 95)
  .bezierCurveTo(255, 190, 45, 190, 0, 95)
  .closePath();

scene.add(shapePath);
raw2dCanvas.render(scene, camera);
```

## Commands

- `moveTo(x, y)`: move the current point.
- `lineTo(x, y)`: add a straight line.
- `quadraticCurveTo(cpx, cpy, x, y)`: add a quadratic curve.
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`: add a cubic bezier curve.
- `closePath()`: close the current contour.
- `clear()`: remove all commands.

## Flattening

Use `flattenShapePath` when a renderer or tool needs point geometry instead of curve commands.

```ts
import { ShapePath, flattenShapePath } from "raw2d";

const shapePath = new ShapePath()
  .moveTo(0, 0)
  .quadraticCurveTo(80, 60, 160, 0)
  .lineTo(160, 80)
  .closePath();

const flattened = flattenShapePath(shapePath, {
  curveSegments: 12
});

console.log(flattened.subpaths[0].points);
console.log(flattened.subpaths[0].closed);
```

Flattening keeps `ShapePath` as data. It does not draw by itself. Canvas can still use native path commands, while WebGL uses these points for stroke geometry and simple closed fills.

Multiple `moveTo` commands create multiple subpaths:

```ts
const flattened = flattenShapePath(shapePath);

for (const subpath of flattened.subpaths) {
  console.log(subpath.points);
  console.log(subpath.closed);
}
```

## WebGL Fill And Stroke

```ts
const shapePath = new ShapePath({
  stroke: true,
  fill: true,
  material: new BasicMaterial({
    fillColor: "#38bdf8",
    strokeColor: "#f5f7fb",
    lineWidth: 4
  })
})
  .moveTo(0, 0)
  .quadraticCurveTo(80, 60, 160, 0)
  .lineTo(160, 80)
  .lineTo(0, 80)
  .closePath();

scene.add(shapePath);
webglRenderer.render(scene, camera);
```

Closed subpaths draw the closing stroke segment. WebGL fills simple closed subpaths by triangulating the flattened points.

## Notes

ShapePath bounds are conservative. Curve control points are included so culling and selection tools have a useful rectangle before precise curve math is added.
