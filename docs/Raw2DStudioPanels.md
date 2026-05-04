# Raw2D Studio Panels

Studio panels should expose scene data clearly without hiding Raw2D's low-level model.

## Panel Layout

The MVP should use a predictable editor layout:

```text
left: tools and layers
center: canvas workspace
right: properties, assets, renderer stats
bottom: optional messages and validation results
```

## Layers Panel

Layers should show scene order and object identity.

- object name
- object type
- visibility
- locked state
- zIndex or order
- selected state

Layers should update scene state, not renderer internals.

## Properties Panel

Properties should edit the selected object's public fields.

- transform: x, y, rotation, scale, origin
- geometry: width, height, radius, points, text, sprite frame
- material: fillColor, strokeColor, lineWidth, opacity
- render: visible, renderMode, zIndex

## Assets Panel

Assets should manage textures and atlas frames.

- import image
- list textures
- list atlas frames
- choose active sprite asset
- show missing asset warnings

## Renderer Stats Panel

Stats should make Raw2D's pipeline visible.

- renderer name
- object count
- draw calls
- texture binds
- static cache hits and misses
- unsupported object warnings

## Verification

- Panels edit scene or editor state only.
- Panels do not call Canvas or WebGL drawing APIs directly.
- Renderer stats are read-only diagnostics.
