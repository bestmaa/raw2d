# Raw2D Studio Scope

Raw2D Studio is planned as a visual editor built on top of Raw2D, not inside the core renderer packages.

## Product Goal

Studio should help developers and designers create Raw2D scenes visually, inspect the scene graph, and export usable scene data or images.

The first version should feel like a small focused editor, not a full Photoshop replacement.

## MVP Scope

- Canvas workspace with pan and zoom.
- Add Rect, Circle, Line, Text2D, Sprite, and basic paths.
- Select, drag, resize, rotate, and edit object origin.
- Properties panel for object transforms, material values, and text or sprite fields.
- Layers panel for scene order, visibility, locking, and names.
- Assets panel for uploaded images and texture atlas inputs.
- Renderer switch for CanvasRenderer and WebGLRenderer2D.
- Save and load Raw2D scene JSON.
- Export PNG from the visible canvas.
- Show renderer stats for draw calls, texture binds, and object counts.

## Non-Goals

- No full Photoshop clone in the first version.
- No advanced photo editing, brush engine, filters, or masking pipeline.
- No physics editor.
- No timeline animation editor in the first pass.
- No plugin marketplace yet.
- No hidden renderer magic that conflicts with Raw2D's transparent pipeline.
- No coupling that forces core users to install the Studio app.

## Package Boundary

Studio should live as an app or later package, separate from renderer packages.

```text
raw2d-core        scene objects, math, materials
raw2d-canvas      Canvas renderer
raw2d-webgl       WebGL renderer
raw2d-interaction selection, hit testing, drag, resize
raw2d-studio      visual editor app, later package
```

Core packages must remain usable without Studio.

## Design Principle

Studio should prove Raw2D is practical, but it must not make the engine heavy.

The editor can compose existing modules, add UI state, and serialize scenes. The renderer should still be responsible for drawing, while objects store scene data.

## Verification

- Read this scope before implementing Studio features.
- Reject features that belong to future advanced editor phases.
- Keep Studio code outside core package internals.
- Keep examples and docs clear enough for npm users to copy.
