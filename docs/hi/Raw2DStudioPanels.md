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

Assets panel ab local image metadata ko Studio scene state me track karta hai.

- image import
- imported asset select karna
- image preview
- asset remove karna
- selected Sprite par selected asset ko `Use` se bind karna
- missing asset warnings dikhana

Imported images current editing session ke liye browser object URLs use karte hain. Save safe metadata jaise id, name, dimensions, mimeType, aur object references rakhta hai, lekin image bytes ya blob URLs save nahi karta.

```json
{
  "id": "asset-1",
  "type": "image",
  "name": "hero.png",
  "width": 320,
  "height": 180,
  "mimeType": "image/png",
  "objectIds": ["sprite-1"]
}
```

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
