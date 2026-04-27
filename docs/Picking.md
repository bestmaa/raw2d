# Picking Objects

Picking means finding which scene object is under a pointer point. It is built on top of hit testing.

Use `containsPoint()` when you already know the object you want to test. Use `pickObject()` when you have a whole scene and want Raw2D to find the object.

```ts
import { pickObject } from "raw2d";

const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY
});
```

## Full Example

This example creates two objects, renders them, then selects the topmost object on click.

```ts
import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Rect,
  Scene,
  pickObject
} from "raw2d";

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
  name: "card",
  x: 120,
  y: 100,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

const circle = new Circle({
  name: "badge",
  x: 210,
  y: 120,
  radius: 46,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
scene.add(circle);
raw2dCanvas.render(scene, camera);

canvasElement.addEventListener("pointerdown", (event) => {
  const bounds = canvasElement.getBoundingClientRect();
  const pointerX = event.clientX - bounds.left;
  const pointerY = event.clientY - bounds.top;

  const picked = pickObject({
    scene,
    x: pointerX,
    y: pointerY
  });

  console.log(picked?.name ?? "empty");
});
```

## Topmost Object

By default, `pickObject()` checks from the end of the scene list. This matches normal canvas drawing where later objects are drawn above earlier objects.

```ts
scene.add(rect);
scene.add(circle);

// If rect and circle overlap, circle is returned first.
const picked = pickObject({ scene, x: pointerX, y: pointerY });
```

To pick the first matching object instead:

```ts
const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY,
  topmost: false
});
```

## Line Tolerance

Use `tolerance` when the scene contains `Line` or `Polyline` objects. This makes thin strokes easier to select.

```ts
const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY,
  tolerance: 8
});
```

## Filter Objects

Use `filter` to ignore locked, disabled, or non-selectable objects.

```ts
const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY,
  filter: (object) => object.name !== "locked"
});
```

## Important

`pickObject()` is pointer picking, not full physics collision. It answers "which object is under this point?" Object-vs-object collision can be a separate module later.
