# InteractionController

InteractionController is the optional editor-style pointer workflow for Raw2D.

It combines picking, selection, dragging, and Rect resizing while keeping rendering separate from object data.

## Basic Setup

```ts
import { Camera2D, Canvas, InteractionController, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement });
const scene = new Scene();
const camera = new Camera2D();

const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => raw2dCanvas.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
```

## Global Scene Mode

Use global mode when every eligible object in the scene should use the same behavior.

```ts
interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
```

## Single Object

Use `attach` when only one object should be interactive.

```ts
interaction.attach(rect);
```

`attach(rect)` enables selection, dragging, and supported resize by default.

## Single Object Custom Features

Pass options when one object should only support specific behavior.

```ts
interaction.attach(rect, {
  select: true,
  drag: true,
  resize: false
});
```

If options are passed, omitted features are disabled. For example, `{ drag: true }` means drag only.

## Many Objects

Use `attachMany` when a known group of objects should share behavior.

```ts
interaction.attachMany([rect, circle, line], {
  select: true,
  drag: true
});
```

## Current Selection

Use `attachSelection` when the current `SelectionManager` selection should become the active interaction scope.

```ts
selection.select(rectA);
selection.select(rectB, { append: true });

interaction.attachSelection({
  drag: true,
  resize: true
});
```

## Detach

```ts
interaction.detach(rect);
interaction.clearAttachments();
```

When no objects are attached, global `enableSelection`, `enableDrag`, and `enableResize` decide behavior.

## What It Does

- Converts pointer coordinates into Raw2D world coordinates.
- Uses `pickObject` to find the topmost object.
- Tracks selected objects through `SelectionManager`.
- Starts object dragging when drag is enabled.
- Starts Rect resizing when a resize handle is picked.

## What It Does Not Do

- It does not draw objects.
- It does not draw editor overlays.
- It does not own CanvasRenderer or WebGLRenderer2D.
- It does not resize Circle, Sprite, Text2D, or rotated objects yet.

## Current Resize Scope

Resize support is currently Rect-only and axis-aligned. Future modules should add separate resize strategies for Sprite, Circle, Ellipse, Text2D, and rotated objects.
