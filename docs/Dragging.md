# Dragging Objects

Dragging is an optional interaction workflow. It lives in `raw2d-interaction`, not in core objects or renderers.

The drag helpers are low-level on purpose:

- `startObjectDrag()` stores the selected object and initial pointer/object position.
- `updateObjectDrag()` moves the object by pointer delta.
- `endObjectDrag()` marks the drag as inactive.

## Basic Flow

```ts
import { endObjectDrag, pickObject, startObjectDrag, updateObjectDrag } from "raw2d";
import type { ObjectDragState } from "raw2d";

let dragState: ObjectDragState | null = null;

canvasElement.addEventListener("pointerdown", (event) => {
  const pointer = getCanvasPoint(event);
  const picked = pickObject({ scene, x: pointer.x, y: pointer.y });

  if (!picked) {
    return;
  }

  dragState = startObjectDrag({
    object: picked,
    pointerX: pointer.x,
    pointerY: pointer.y
  });
});

canvasElement.addEventListener("pointermove", (event) => {
  if (!dragState) {
    return;
  }

  const pointer = getCanvasPoint(event);
  updateObjectDrag({
    state: dragState,
    pointerX: pointer.x,
    pointerY: pointer.y
  });

  raw2dCanvas.render(scene, camera);
});

canvasElement.addEventListener("pointerup", () => {
  if (dragState) {
    endObjectDrag({ state: dragState });
    dragState = null;
  }
});
```

## Canvas Pointer Helper

Browser pointer events use viewport coordinates. Convert them into canvas coordinates before picking or dragging.

```ts
function getCanvasPoint(event: PointerEvent): { x: number; y: number } {
  const bounds = canvasElement.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  };
}
```

## Why Separate Package?

Dragging is not rendering. It is not object data either. Keeping it in `raw2d-interaction` keeps Raw2D modular:

- `raw2d-core`: objects, scene, hit testing, picking.
- `raw2d-canvas`: drawing.
- `raw2d-webgl`: future WebGL drawing.
- `raw2d-interaction`: optional editor-style pointer workflows.

This keeps the engine transparent and lets apps choose how much interaction logic they want.
