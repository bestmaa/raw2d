# Resize Handles

Resize handles are small rectangles around selected bounds. They are geometry only. Raw2D does not resize objects automatically yet.

Use them to draw editor handles and detect which handle the pointer is over.

```ts
const handles = getResizeHandles({
  bounds,
  size: 8
});
```

## Handle Names

Raw2D returns eight handles:

```ts
top-left
top
top-right
right
bottom-right
bottom
bottom-left
left
```

Each handle includes:

```ts
{
  name: "top-left",
  x: number,
  y: number,
  width: number,
  height: number,
  cursor: "nwse-resize"
}
```

## Pick A Handle

Use `pickResizeHandle()` to check if the pointer is over a handle.

```ts
const pickedHandle = pickResizeHandle({
  handles,
  x: pointerX,
  y: pointerY
});

if (pickedHandle) {
  canvasElement.style.cursor = pickedHandle.cursor;
}
```

## With Selection Bounds

The usual flow is:

```ts
const bounds = getSelectionBounds({
  objects: [rect, circle]
});

if (bounds) {
  const handles = getResizeHandles({ bounds, size: 8 });
  const pickedHandle = pickResizeHandle({ handles, x: pointerX, y: pointerY });
}
```

Actual resize behavior can be built next on top of these handle names.
