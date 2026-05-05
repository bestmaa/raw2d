# Raw2D Studio Panels

Studio panels scene data ko clearly expose karenge aur Raw2D ke low-level model ko hide nahi karenge.

## Panel Layout

MVP layout predictable editor jaisa hona chahiye:

```text
left: tools
center: canvas workspace
right: renderer, stats, layers, properties
bottom: optional messages and validation results
```

## Layers Panel

Layers scene order aur object identity dikhata hai.

- object name
- object type
- visibility
- order controls
- selected state

Layers select, hide/show, move up, aur move down kar sakta hai. Ye scene state update karta hai, renderer internals nahi.

## Properties Panel

Properties selected object ke public fields edit karta hai.

- transform: x, y
- geometry: width, height, radius, text, font
- material: fillColor, strokeColor, lineWidth
- render state: visibility Layers se

## Assets Panel

Assets abhi planned hai. Sprite abhi `assetSlot` placeholder use karta hai jab tak save/load aur asset import nahi aate.

- image import
- textures list
- atlas frames list
- active sprite asset choose karna
- missing asset warnings dikhana

## Renderer Stats Panel

Stats har render ke baad Raw2D pipeline ko visible banata hai.

- renderer name
- object count
- draw calls
- accepted, hidden, aur culled render-list counts
- WebGL batches aur vertices
- textureBinds
- unsupported object warnings

## Verification

- Panels sirf scene ya editor state edit karte hain.
- Panels Canvas ya WebGL drawing APIs direct call nahi karte.
- Renderer stats read-only diagnostics hain.
