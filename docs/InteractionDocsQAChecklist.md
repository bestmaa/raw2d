# Interaction Docs Visual QA Checklist

Use this checklist before an interaction docs or example change is accepted.

## Routes

- Open `/doc#interaction-controller`.
- Open `/doc#selection-manager`.
- Open `/doc#keyboard-controller`.
- Open `/doc#camera-controls`.
- Open `/examples/interaction-basic/`.

## Pointer Check

- Click an object and confirm it becomes selected.
- Drag the selected object and confirm x/y changes.
- Drag a Rect resize handle and confirm width/height changes.
- Click empty canvas and confirm selection clears.

## Keyboard Check

- Arrow keys move selected objects.
- Shift plus arrow uses the fast move step.
- Escape clears selection.
- Delete removes selected objects when enabled.

## Camera Check

After pan or zoom, selection, drag, resize, and hit testing should still match
the pointer position. Handles should remain aligned with the selected Rect.
