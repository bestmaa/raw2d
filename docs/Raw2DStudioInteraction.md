# Raw2D Studio Interaction

Studio interaction is intentionally explicit: browser input becomes a small editor command, the command updates scene state, and the renderer redraws from that state.

## Current Controls

The current Studio app supports direct editing for one selected object at a time:

- click an object to select it
- drag the selected object to move `x` and `y`
- drag Rect or Sprite corner handles to resize
- press Arrow keys to nudge the selected object
- hold Shift with Arrow keys for larger movement
- press Escape to clear selection
- press Delete or Backspace to remove the selected object

## Scene State Flow

Selection, drag, resize, keyboard, layer, and property changes all produce a new scene object array instead of mutating Raw2D runtime objects directly.

```text
input -> Studio command -> StudioSceneState -> runtime adapter -> renderer
```

This keeps the editor debuggable. The canvas is a preview of the state, not the source of truth.

## Selection And Resize

Selection uses world-space hit testing from the Studio scene state. Resize handles are drawn by the Studio overlay path for Rect and Sprite objects only.

```text
Rect/Sprite selected -> four corner handles
Circle/Line/Text2D selected -> no resize handles yet
```

## Keyboard Commands

Keyboard commands are scoped to the Studio document listener and only handle known editor keys. Unknown keys are ignored so browser text inputs and future shortcuts can stay predictable.

```text
ArrowRight -> x + 1
Shift+ArrowRight -> x + 10
Escape -> selectedObjectId = undefined
Delete -> remove selected object
```

## Panel Commands

Layers, Properties, and Stats stay separate from drawing logic:

- Layers select, toggle visibility, and reorder scene objects.
- Properties edit transform, geometry, text, and material fields.
- Stats read renderer diagnostics after a render.

Panels update editor state or display renderer output. They do not draw objects themselves.
