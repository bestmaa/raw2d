# Raw2D Studio Scene Format

Studio ko ek stable JSON document save karna chahiye jo editor, MCP tools, examples, aur future import/export utilities read kar saken.

## Format Goal

Format readable, versioned, aur public Raw2D object model ke close hona chahiye.

Isme renderer internals save nahi honge, jaise GPU buffers, Canvas context state, batch cache keys, ya generated draw calls.

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

Objects explicit `type` values aur public Raw2D-style fields use karenge.

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

Texture assets IDs use karenge, taaki Sprite objects image bytes directly store na karein.

```json
{
  "id": "hero-texture",
  "src": "./assets/hero.png",
  "width": 256,
  "height": 256
}
```

Sprites `textureId` aur optional atlas `frameName` se asset reference karenge.

## Save Rule

Sirf author-facing state save karo:

- scene objects
- camera
- assets
- document metadata
- later editor-safe layer names aur locked flags

Runtime-only data save nahi karna.

## Load Rule

Load flow pehle validate karega, phir Raw2D objects create karega.

Invalid objects useful path messages ke saath report hone chahiye, jaise `scene.objects[2].width`.

## Compatibility

Pehla Studio format MCP scene JSON idea ko extend karega. Alag incompatible format invent nahi karna.

MCP minimal reh sakta hai, aur Studio `version`, `meta`, aur `assets` add kar sakta hai.
