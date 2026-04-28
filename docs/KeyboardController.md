# KeyboardController

KeyboardController is an optional interaction helper for editor-style keyboard workflows.

It works with `SelectionManager` and can move, delete, or clear selected objects.

## Basic Setup

```ts
import { KeyboardController, SelectionManager } from "raw2d";

const selection = new SelectionManager();
selection.select(rect);

const keyboard = new KeyboardController({
  target: window,
  selection,
  scene,
  moveStep: 1,
  fastMoveStep: 10,
  onChange: () => raw2dCanvas.render(scene, camera)
});

keyboard.enableMove();
keyboard.enableDelete();
keyboard.enableClear();
```

## Supported Keys

- Arrow keys move selected objects.
- Shift + Arrow moves selected objects by `fastMoveStep`.
- Delete or Backspace removes selected objects from the scene when `scene` is provided.
- Escape clears selection.

KeyboardController does not render anything. Use `onChange` to render with Canvas or WebGL after data changes.
