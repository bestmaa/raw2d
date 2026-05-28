# Raw2D Studio Tools

Studio tools should be small editor modes that mutate scene state through explicit commands.

## Tool Model

Each tool should have one job:

```text
pointer event -> tool -> editor command -> scene JSON/state -> render
```

Tools should not draw directly. They can ask the renderer to redraw after state changes.

## Select Tool

Select chooses one or more objects using picking.

- click selects top object
- shift click toggles selection
- empty click clears selection
- drag can move selected objects as one group
- multiple selected objects draw one explicit selection bounds box
- handles can resize one selected object bounds

## Move Tool

Move is a focused mode for translating selected objects.

It should update `x` and `y`, not rewrite object geometry.
Multi-select move records a batch command so undo and redo keep the group edit atomic.

## Resize Tool

Resize uses bounds handles and preserves the opposite edge where possible.

Rect, Sprite, Text2D, and image-like objects can resize directly. Circle should resize radius. Line can move endpoints later.

## Current MVP Tools

The current Studio shell supports simple click-to-create tools:

```ts
// Small example
clickTool("rect");
clickTool("circle");
clickTool("line");
clickTool("text");
clickTool("sprite");
```

Each click appends one object to the scene state, redraws the canvas, and updates Layers and Properties.

## Rect Tool

Rect creates a drawable rectangle with width, height, and material data.

```ts
addStudioRectObject({ scene });
```

Full scene object:

```json
{
  "id": "rect-1",
  "type": "rect",
  "name": "Rect 1",
  "x": 120,
  "y": 120,
  "width": 160,
  "height": 96,
  "material": {
    "fillColor": "#35c2ff",
    "strokeColor": "#dff5ff",
    "lineWidth": 2
  }
}
```

## Circle Tool

Circle creates a drawable circle with radius and material data.

```ts
addStudioCircleObject({ scene });
```

The Properties panel shows `X`, `Y`, and `Radius`.

## Line Tool

Line creates a simple stroke with local start and end points.

```ts
addStudioLineObject({ scene });
```

The object stores transform separately from line geometry:

```json
{ "x": 120, "y": 300, "startX": 0, "startY": 0, "endX": 240, "endY": 0 }
```

## Text Tool

Text creates Text2D and exposes text and font values in Properties.
Studio resize handles use estimated text bounds and scale the `px` font size instead of storing separate text width and height fields.

```ts
addStudioTextObject({ scene });
```

Full text defaults:

```json
{ "type": "text2d", "text": "Raw2D Text", "font": "32px sans-serif" }
```

Resize rule:

```txt
drag text bounds -> update x/y and font size
```

## Sprite Tool

Sprite creates a placeholder object with an asset slot.

```ts
addStudioSpriteObject({ scene });
```

Current object:

```json
{ "type": "sprite", "width": 128, "height": 128, "assetSlot": "empty" }
```

After an image asset is imported in the Assets panel, select a Sprite, select the asset, then click `Use`. Studio records an explicit command and updates the Sprite `assetSlot` to the asset id.

```json
{ "type": "sprite", "width": 128, "height": 128, "assetSlot": "asset-1" }
```

The runtime adapter turns an asset-backed Sprite into a Raw2D `Sprite` with a `Texture` in Canvas and WebGL modes where the browser image source is available. If the asset is missing, Studio keeps the placeholder path visible and reports diagnostics on load.

## Command Rule

Studio tools now produce command objects for scene-changing edits so undo and redo can replay the same data path.

```text
create-object
delete-object
update-transform
update-material
update-text
set-visibility
reorder-object
update-sprite-asset
replace-objects
batch
```

The command history stays inside `apps/studio`. Canvas and WebGL renderers only receive the resulting scene state through the runtime adapter.

## Advanced Editing

Advanced tools still follow the same explicit command rule. They change Studio scene JSON first and never draw through Canvas or WebGL directly.

```text
Group -> replace root objects with a group object and children
Ungroup -> restore child world positions
Duplicate -> clone selection with stable id suffixes
Align -> move selected bounds to a shared edge or center
Distribute -> spread three or more bounds along one axis
Snap -> round selected world positions to the Studio grid
```

Grouping uses `Group2D`-style hierarchy without hiding the children. Duplicating a group clones its nested children and keeps Sprite asset references explicit. Align, distribute, and snap produce transform batch commands so undo and redo keep the whole edit atomic.

## Navigation And Clipboard

Large scenes use camera helpers instead of hidden renderer state.

```text
Zoom Selection -> camera frames selected bounds
Fit Scene -> camera frames all scene bounds
Minimap -> shows object bounds and viewport bounds
Copy -> raw2d-studio-clipboard payload
Paste -> replace-objects command with remapped ids and safe asset metadata
```

The clipboard format is document data, not DOM or canvas pixels. Paste validates the payload, remaps conflicting object ids, reuses matching asset metadata, and selects the pasted objects.

## Verification

- Every tool maps to explicit scene state changes.
- Tools do not own Canvas or WebGL rendering logic.
- Selection and resize reuse `raw2d-interaction` where possible.
- Undo/redo should work for create, delete, move, resize, layer, property, grouping, arrangement, and paste edits.
