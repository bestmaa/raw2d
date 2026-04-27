# Selection

Selection is optional interaction state. It belongs in `raw2d-interaction` because it is not rendering and it is not object data.

Use `SelectionManager` to track which objects are selected.

```ts
import { SelectionManager } from "raw2d";

const selection = new SelectionManager();

selection.select(rect);
selection.select(circle, { append: true });
selection.toggle(rect);
selection.clear();
```

## Pick And Select

Use `pickObject()` to find the object under the pointer, then pass that object into `SelectionManager`.

```ts
const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY
});

if (picked) {
  selection.select(picked);
} else {
  selection.clear();
}
```

## Multiple Selection

Use `append` when you want to keep the current selected objects.

```ts
selection.select(rect);
selection.select(circle, { append: true });

const selectedObjects = selection.getSelected();
```

Use `toggle` for shift-click behavior.

```ts
selection.select(picked, {
  toggle: event.shiftKey,
  append: event.shiftKey
});
```

## Selection Bounds

Use `getSelectionBounds()` when you need an outline rectangle for selected core shape objects.

```ts
const bounds = getSelectionBounds({
  objects: [rect, circle]
});

if (bounds) {
  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
}
```

The helper returns world bounds. Drawing the outline is still your renderer/tooling responsibility.
