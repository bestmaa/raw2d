# Raw2D Studio Interaction

Studio interaction is intentionally explicit: browser input becomes a small editor command, the command updates scene state, and the renderer redraws from that state.

## Current Controls

The current Studio app supports direct editing for one or more selected objects:

- click an object to select it
- shift click objects or Layers rows to build a multi-selection
- drag the selected object to move `x` and `y`
- drag Rect or Sprite corner handles to resize
- press Arrow keys to nudge the selected object
- hold Shift with Arrow keys for larger movement
- press Escape to clear selection
- press Delete or Backspace to remove the selected object
- press Ctrl/Cmd+Z to undo
- press Ctrl/Cmd+Shift+Z or Ctrl+Y to redo
- press Ctrl/Cmd+C to copy the current selection
- press Ctrl/Cmd+V to paste a valid Studio clipboard payload

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

## Advanced Editing Workflows

Group and Ungroup keep the scene graph visible. A group stores children, the Layers panel can still expose the hierarchy, and ungroup restores child world positions so the scene does not jump.

```text
select two objects -> Group -> selectedObjectIds = [group-id]
select group -> Ungroup -> selectedObjectIds = child ids
```

Duplicate, align, distribute, and snap work on the normalized selection. Duplicate offsets the clone, remaps ids, and carries Sprite asset references. Align and distribute use selection bounds. Snap rounds selected world positions to the grid.

```text
Duplicate -> replace-objects
Align Left -> update-transform batch
Distribute H -> update-transform batch
Snap -> update-transform batch
```

Zoom Selection, Fit Scene, and the minimap change or display camera state only. They do not rewrite object geometry.

## Clipboard Workflow

Copy writes a versioned `raw2d-studio-clipboard` JSON payload for the selected objects and safe asset metadata. Paste validates that payload before creating a command. Invalid clipboard text is ignored and does not replace the scene.

```text
Ctrl/Cmd+C -> serialize selected objects
Ctrl/Cmd+V -> validate, remap ids, paste, select pasted objects
```

## Keyboard Commands

Keyboard commands are scoped to the Studio document listener and only handle known editor keys. Unknown keys are ignored so browser text inputs and future shortcuts can stay predictable.

```text
ArrowRight -> x + 1
Shift+ArrowRight -> x + 10
Escape -> selectedObjectId = undefined
Delete -> remove selected object
Ctrl/Cmd+Z -> undo last edit
Ctrl/Cmd+Shift+Z -> redo last undone edit
Ctrl/Cmd+C -> copy selection
Ctrl/Cmd+V -> paste selection
```

## Keyboard Accessibility

Toolbar actions are buttons, so Tab and Shift+Tab can reach them and Enter can activate them. Property inputs keep text editing safe: editor shortcuts should not steal normal typing inside focused fields. Escape clears selection only for the editor workflow, and destructive commands still travel through undoable commands.

## Command History

Studio records reversible editor commands for changes that alter scene data:

- create object
- delete selected object
- drag move and keyboard movement
- Rect and Sprite resize
- layer visibility and layer order
- transform, material, text, and font property edits
- grouping, ungrouping, duplicate, arrangement, and paste edits

Selection-only changes, renderer switching, Save, Export, and failed imports are not added to history. Loading a scene or sample scene resets the history so an old undo stack cannot modify a new document.

```text
applyStudioHistoryCommand -> undoStack
undoStudioHistory -> redoStack
redoStudioHistory -> undoStack
```

## Panel Commands

Layers, Properties, and Stats stay separate from drawing logic:

- Layers select, toggle visibility, and reorder scene objects.
- Properties edit transform, geometry, text, and material fields.
- Stats read renderer diagnostics after a render.

Panels update editor state or display renderer output. They do not draw objects themselves.
