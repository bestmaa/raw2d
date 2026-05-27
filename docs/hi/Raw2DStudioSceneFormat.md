# Raw2D Studio Scene Format

Studio ko ek stable JSON document save karna chahiye jo editor, MCP tools, examples, aur future import/export utilities read kar saken.

## Format Goal

Format readable, versioned, aur public Raw2D object model ke close hona chahiye.

Isme renderer internals save nahi honge, jaise GPU buffers, Canvas context state, batch cache keys, ya generated draw calls.

## Current Document Shape

Abhi `apps/studio` save file `StudioSceneState` ke close hai, taaki Save aur Load hidden editor data ke bina round-trip kar sake.

```json
{
  "version": 1,
  "name": "Untitled Scene",
  "rendererMode": "canvas",
  "camera": {
    "x": 0,
    "y": 0,
    "zoom": 1
  },
  "assets": [],
  "objects": []
}
```

Save `serializeStudioScene(scene)` use karta hai aur `<scene-name>.raw2d.json` download karta hai.

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

## Save, Load, Export

Persistence me abhi teen user-facing actions hain:

- Save stable `.raw2d.json` download karta hai.
- Load valid `.raw2d.json` read karta hai, schema validate karta hai, phir Studio scene state replace karta hai.
- Export current canvas preview ko PNG ke roop me download karta hai.
- Copy Code clipboard me Canvas-only Raw2D snippet likhta hai jo public `raw2d` imports use karta hai, Studio internals nahi.

Invalid JSON, unsupported object types, aur invalid geometry Studio status bar me import errors ke roop me dikhte hain.
Missing asset references scene load karte hain, lekin explicit warnings dikhate hain taaki user IDs fix kar sake bina baaki scene data khoye.

## Assets

Image assets IDs use karte hain, taaki Sprite objects image bytes directly store na karein.

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

Sprites `assetSlot` ke through assets reference karte hain:

```json
{ "id": "sprite-1", "type": "sprite", "assetSlot": "asset-1" }
```

Studio sirf safe asset metadata save karta hai. Preview ke liye jo browser object URL use hota hai wo runtime-only hai aur `.raw2d.json` me nahi likha jata. Missing local image data ke saath scene reload hone par metadata visible rehna chahiye aur missing references warning deni chahiye.

## Save Rule

Sirf author-facing state save karo:

- scene objects
- camera
- assets
- document metadata
- later editor-safe layer names aur locked flags

Runtime-only data save nahi karna.

## Load Rule

Load flow pehle validate karta hai, phir runtime adapter ke through Raw2D objects create karta hai.

Invalid objects useful object messages ke saath report hone chahiye, jaise `Invalid Studio rect geometry rect-1: width must be greater than 0`.
Unsupported object types rejected type aur object id batayenge, jaise `Unsupported Studio object type "mesh" for object bad-1`.

Missing Sprite asset references diagnostics ke roop me return hote hain, jaise `Sprite sprite-1 references missing asset asset-9`.

## Compatibility

Pehla Studio format MCP scene JSON idea ke compatible rehna chahiye. Alag incompatible format invent nahi karna.

MCP minimal reh sakta hai, aur Studio `version`, `meta`, aur `assets` add kar sakta hai.
