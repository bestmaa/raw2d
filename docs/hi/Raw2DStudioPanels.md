# Raw2D Studio Panels

Studio panels scene data ko clearly expose karenge aur Raw2D ke low-level model ko hide nahi karenge.

## Panel Layout

MVP layout predictable editor jaisa hona chahiye:

```text
left: tools and layers
center: canvas workspace
right: properties, assets, renderer stats
bottom: optional messages and validation results
```

## Layers Panel

Layers scene order aur object identity dikhayega.

- object name
- object type
- visibility
- locked state
- zIndex ya order
- selected state

Layers scene state update karega, renderer internals nahi.

## Properties Panel

Properties selected object ke public fields edit karega.

- transform: x, y, rotation, scale, origin
- geometry: width, height, radius, points, text, sprite frame
- material: fillColor, strokeColor, lineWidth, opacity
- render: visible, renderMode, zIndex

## Assets Panel

Assets textures aur atlas frames manage karega.

- image import
- textures list
- atlas frames list
- active sprite asset choose karna
- missing asset warnings dikhana

## Renderer Stats Panel

Stats Raw2D pipeline ko visible banayega.

- renderer name
- object count
- draw calls
- texture binds
- static cache hits aur misses
- unsupported object warnings

## Verification

- Panels sirf scene ya editor state edit karte hain.
- Panels Canvas ya WebGL drawing APIs direct call nahi karte.
- Renderer stats read-only diagnostics hain.
