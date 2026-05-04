# Raw2D Studio Scene Format

Studio should save a stable JSON document that can be read by the editor, MCP tools, examples, and future import/export utilities.

## Format Goal

The format should be readable, versioned, and close to the public Raw2D object model.

It should not store renderer internals such as GPU buffers, Canvas context state, batch cache keys, or generated draw calls.

## Document Shape

```json
{
  "version": 1,
  "meta": {
    "name": "Untitled Scene",
    "createdWith": "raw2d-studio"
  },
  "camera": {
    "x": 0,
    "y": 0,
    "zoom": 1
  },
  "scene": {
    "objects": []
  },
  "assets": {
    "textures": []
  }
}
```

## Object Shape

Objects should use explicit `type` values and public Raw2D-style fields.

```json
{
  "id": "rect-1",
  "type": "rect",
  "x": 100,
  "y": 80,
  "width": 140,
  "height": 90,
  "origin": "center",
  "visible": true,
  "zIndex": 0,
  "material": {
    "fillColor": "#35c2ff",
    "strokeColor": "#f5f7fb",
    "lineWidth": 2,
    "opacity": 1
  }
}
```

## Assets

Texture assets should use IDs so Sprite objects do not store image bytes directly.

```json
{
  "id": "hero-texture",
  "src": "./assets/hero.png",
  "width": 256,
  "height": 256
}
```

Sprites reference assets by `textureId` and optional atlas `frameName`.

## Save Rule

Save only author-facing state:

- scene objects
- camera
- assets
- document metadata
- editor-safe layer names and locked flags later

Do not save runtime-only data.

## Load Rule

Load should validate first, then create Raw2D objects.

Invalid objects should be reported with useful path messages such as `scene.objects[2].width`.

## Compatibility

The first Studio format should extend the MCP scene JSON idea instead of inventing a separate incompatible format.

MCP can stay minimal, while Studio can add `version`, `meta`, and `assets`.
