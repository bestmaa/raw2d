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
- drag can move selected objects
- handles can resize selected object bounds

## Move Tool

Move is a focused mode for translating selected objects.

It should update `x` and `y`, not rewrite object geometry.

## Resize Tool

Resize uses bounds handles and preserves the opposite edge where possible.

Rect, Sprite, Text2D, and image-like objects can resize directly. Circle should resize radius. Line can move endpoints later.

## Shape Tool

Shape tool creates Rect, Circle, Line, Polygon, and ShapePath objects.

The first MVP should support click-drag Rect and Circle. More complex paths can come later.

## Text Tool

Text tool creates Text2D and opens the properties panel for editing content, font, and material.

It should not become a rich text editor in the MVP.

## Sprite Tool

Sprite tool creates Sprite objects from selected assets.

If an atlas frame is selected, the new Sprite should store `textureId` and `frameName`.

## Command Rule

All tools should produce command objects later so undo/redo can be added without rewriting tool logic.

```text
CreateObjectCommand
UpdateTransformCommand
UpdateMaterialCommand
DeleteSelectionCommand
```

## Verification

- Every tool maps to explicit scene state changes.
- Tools do not own Canvas or WebGL rendering logic.
- Selection and resize reuse `raw2d-interaction` where possible.
