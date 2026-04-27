# Object Resize

Object resize is an optional interaction helper in `raw2d-interaction`.

The first MVP supports `Rect`. It assumes simple axis-aligned Rect editing. Rotated objects, origin-aware resizing, Circle, Ellipse, and Sprite resize strategies can be added later as separate focused modules.

## Basic Flow

```ts
const handles = getResizeHandles({ bounds, size: 8 });
const handle = pickResizeHandle({ handles, x: pointerX, y: pointerY });

if (handle) {
  resizeState = startObjectResize({
    object: rect,
    handleName: handle.name,
    pointerX,
    pointerY,
    minWidth: 20,
    minHeight: 20
  });
}
```

## Update Resize

```ts
updateObjectResize({
  state: resizeState,
  pointerX,
  pointerY
});

raw2dCanvas.render(scene, camera);
```

## End Resize

```ts
endObjectResize({ state: resizeState });
resizeState = null;
```

## Handle Behavior

- `right`: changes width.
- `bottom`: changes height.
- `bottom-right`: changes width and height.
- `left`: changes x and width while keeping the right edge fixed.
- `top`: changes y and height while keeping the bottom edge fixed.
- corner handles combine the relevant horizontal and vertical behavior.

This gives Raw2D a practical editor foundation without putting resize logic inside objects or renderers.
