# Raw2D Studio Panels

Studio panels should expose scene data clearly without hiding Raw2D's low-level model.

## Panel Layout

The MVP should use a predictable editor layout:

```text
left: tools
center: canvas workspace
right: renderer, stats, layers, properties
bottom: optional messages and validation results
```

## Layers Panel

Layers now show scene order and object identity.

- object name
- object type
- visibility
- order controls
- selected state

Layers can select, hide/show, move up, and move down. They update scene state, not renderer internals.

## Properties Panel

Properties edit the selected object's public fields.

- transform: x, y
- geometry: width, height, radius, text, font
- material: fillColor, strokeColor, lineWidth
- render state: visibility through Layers

## Assets Panel

Assets are still planned. Sprite currently uses an `assetSlot` placeholder until save/load and asset import land.

- import image
- list textures
- list atlas frames
- choose active sprite asset
- show missing asset warnings

## Renderer Stats Panel

Stats make Raw2D's pipeline visible after every render.

- renderer name
- object count
- draw calls
- accepted, hidden, and culled render-list counts
- WebGL batches and vertices
- textureBinds
- unsupported object warnings

## Verification

- Panels edit scene or editor state only.
- Panels do not call Canvas or WebGL drawing APIs directly.
- Renderer stats are read-only diagnostics.
