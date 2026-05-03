# Raw2D MCP Package Design

`raw2d-mcp` will expose Raw2D scene authoring and inspection as explicit Model Context Protocol tools. It should help AI agents create, update, validate, and explain Raw2D scenes without hiding the engine pipeline.

## Package Scope

- Package name: `raw2d-mcp`
- Runtime: Node.js ESM
- Input format: strict JSON scene documents
- Output format: typed JSON results plus generated TypeScript snippets
- Dependency direction: MCP package may depend on `raw2d-core`; it must not depend on browser renderers unless a tool explicitly generates renderer code.

The first version should be local and deterministic. It should not open browsers, upload files, call external services, or mutate a user project unless a future command is explicitly designed for that.

## Scene JSON Shape

The scene document should stay close to Raw2D public API names:

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

- `raw2d_create_scene`: create an empty scene JSON document with a camera.
- `raw2d_add_object`: add Rect, Circle, Line, Text2D, Sprite, or ShapePath data.
- `raw2d_update_transform`: update x, y, rotation, scale, origin, zIndex, visibility, or renderMode.
- `raw2d_update_material`: update fill, stroke, line width, opacity, and text style data.
- `raw2d_inspect_scene`: summarize object counts, unsupported fields, bounds-ready objects, and renderer hints.
- `raw2d_validate_scene`: return structured validation errors without mutating input.
- `raw2d_generate_canvas_example`: generate a Canvas setup from scene JSON.
- `raw2d_generate_webgl_example`: generate a WebGLRenderer2D setup with Canvas fallback.
- `raw2d_generate_docs_snippet`: generate short docs examples from scene JSON.
- `raw2d_run_visual_check`: planned later; should call the repo visual test command, not implement browser control inside MCP.

## Tool Boundaries

MCP tools should return data and code. They should not silently write files, publish packages, push Git, or transmit project data. Future write tools must make the output path explicit and should be separate from read-only tools.

## Validation Rules

- Reject unknown object types.
- Reject invalid colors before code generation.
- Clamp or reject invalid dimensions consistently with Raw2D classes.
- Require texture references to be named assets, not arbitrary local paths.
- Report renderer support separately for Canvas and WebGL.

## Future Commands

Later versions can add project scaffold helpers, export audits, visual test launchers, and plugin integration. Those should stay modular so `raw2d-mcp` remains useful for engine builders and documentation automation.
