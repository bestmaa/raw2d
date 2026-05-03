# Raw2D MCP Package Design

`raw2d-mcp` ka goal AI agents ko Raw2D scene JSON create, update, validate aur explain karne ke tools dena hai. Ye package engine pipeline ko hide nahi karega; output clear JSON aur TypeScript snippets hoga.

## Package Scope

- Package name: `raw2d-mcp`
- Runtime: Node.js ESM
- Input: strict JSON scene documents
- Output: typed JSON results aur generated TypeScript snippets
- Dependency: pehle `raw2d-core`; browser renderer dependency tabhi jab tool renderer code generate kare.

First version local aur deterministic rahega. Ye browser open, file upload, external service call, ya project files mutate nahi karega jab tak future write tool clearly design na ho.

## Scene JSON

Scene JSON Raw2D public API names ke close rahega:

```json
{
  "scene": {
    "objects": [
      {
        "type": "rect",
        "id": "hero-card",
        "x": 80,
        "y": 64,
        "width": 160,
        "height": 96,
        "material": { "fillColor": "#35c2ff" }
      }
    ]
  },
  "camera": { "x": 0, "y": 0, "zoom": 1 }
}
```

## Initial Tools

- `raw2d_create_scene`: empty scene JSON aur camera create kare.
- `raw2d_add_object`: Rect, Circle, Line, Text2D, Sprite, ya ShapePath data add kare.
- `raw2d_update_transform`: x, y, rotation, scale, origin, zIndex, visibility, renderMode update kare.
- `raw2d_update_material`: fill, stroke, line width, opacity aur text style data update kare.
- `raw2d_inspect_scene`: object counts, unsupported fields, bounds-ready objects aur renderer hints summarize kare.
- `raw2d_validate_scene`: input mutate kiye bina validation errors return kare.
- `raw2d_generate_canvas_example`: scene JSON se Canvas setup generate kare.
- `raw2d_generate_webgl_example`: WebGLRenderer2D setup Canvas fallback ke saath generate kare.
- `raw2d_generate_docs_snippet`: scene JSON se short docs examples generate kare.
- `raw2d_run_visual_check`: baad ka tool; repo visual test command call karega.

## Boundaries

MCP tools data aur code return karenge. Ye silently files write, npm publish, Git push, ya project data transmit nahi karenge. Future write tools explicit output path lenge.

## Validation Rules

- Unknown object types reject karein.
- Code generation se pehle invalid colors reject karein.
- Invalid dimensions ko Raw2D classes ke behavior ke saath consistent rakhein.
- Texture references named assets hon, arbitrary local paths nahi.
- Canvas aur WebGL support alag report karein.
