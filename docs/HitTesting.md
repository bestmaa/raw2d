# Hit Testing

Hit testing checks whether a world-space point is inside or near an object. Use it for hover states, object selection, drag tools, resize handles, and editor-style interactions.

Raw2D keeps this logic in core helpers. Objects store data; renderers draw; hit testing reads object data and answers yes/no.

```ts
import { containsPoint } from "raw2d";

const hit = containsPoint({
  object: rect,
  x: pointerX,
  y: pointerY
});
```

## Full Click Example

This is the common use case: render a scene, listen for pointer input on the canvas, then test objects.

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene, containsPoint } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 120,
  y: 90,
  width: 160,
  height: 90,
  origin: "center",
  rotation: 0.35,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(rect);
raw2dCanvas.render(scene, camera);

canvasElement.addEventListener("pointerdown", (event) => {
  const bounds = canvasElement.getBoundingClientRect();
  const pointerX = event.clientX - bounds.left;
  const pointerY = event.clientY - bounds.top;

  const hit = containsPoint({
    object: rect,
    x: pointerX,
    y: pointerY
  });

  console.log(hit ? "Rect clicked" : "Empty space");
});
```

## Selection Example

When you have multiple objects, test them in the order you want selection to work.

```ts
const objects = [polygon, circle, rect, line];

const selected = objects.find((object) =>
  containsPoint({
    object,
    x: pointerX,
    y: pointerY,
    tolerance: 8
  })
);

if (selected) {
  selected.rotation += 0.1;
  raw2dCanvas.render(scene, camera);
}
```

## World Coordinates

`containsPoint()` expects world coordinates. Raw2D converts the point into object-local space using position, rotation, scale, and origin.

```ts
const rect = new Rect({
  x: 100,
  y: 80,
  width: 120,
  height: 80,
  origin: "center"
});

rect.rotation = Math.PI / 4;

const isInside = containsPoint({
  object: rect,
  x: pointerX,
  y: pointerY
});
```

This means you pass the same coordinates you use for canvas interaction. You do not manually undo rotation, scale, or origin.

## Line Tolerance

Lines and polylines use a tolerance because strokes are thin geometry.

```ts
const hitLine = containsPoint({
  object: line,
  x: pointerX,
  y: pointerY,
  tolerance: 6
});
```

Higher tolerance makes thin lines easier to click.

## Shape Examples

```ts
const hitCircle = containsPoint({
  object: circle,
  x: pointerX,
  y: pointerY
});

const hitPolygon = containsPoint({
  object: polygon,
  x: pointerX,
  y: pointerY
});
```

## Current Support

- Rect: local rectangle test.
- Circle: radius distance test.
- Ellipse: normalized radius test.
- Line: segment distance with tolerance.
- Polyline: segment distance with tolerance.
- Polygon: ray-casting fill test.
- Arc and ShapePath: conservative local bounds for now.

Precise curved ShapePath hit testing can be added later without changing the public API.
