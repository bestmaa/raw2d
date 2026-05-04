# Raw2D MCP Schemas

`raw2d-mcp` tools use explicit JSON inputs and JSON outputs. Tools are deterministic and do not draw, write files, publish packages, or push Git.

## Shared Scene Document

Most tools accept this scene document shape:

```ts
interface SceneDocument {
  scene: { objects: SceneObject[] };
  camera: { x: number; y: number; zoom: number };
}
```

Supported object types are `rect`, `circle`, `line`, `text`, `sprite`, and `shapePath`.

## Tool Schemas

### raw2d_create_scene

Input:

```ts
{ camera?: { x?: number; y?: number; zoom?: number } }
```

Output: `SceneDocument`

Creates an empty scene with camera defaults.

### raw2d_add_object

Input:

```ts
{ document: SceneDocument; object: SceneObject }
```

Output: `SceneDocument`

Adds one supported object and rejects duplicate ids.

### raw2d_update_transform

Input:

```ts
{ document: SceneDocument; id: string; transform: TransformPatch }
```

Output: `SceneDocument`

Updates x/y, rotation, scale, origin, zIndex, visibility, or renderMode for one object.

### raw2d_update_material

Input:

```ts
{ document: SceneDocument; id: string; material: MaterialPatch }
```

Output: `SceneDocument`

Merges fill, stroke, line width, opacity, and text style fields into one object.

### raw2d_inspect_scene

Input:

```ts
{ document: SceneDocument }
```

Output: object count, type counts, texture/text flags, and renderer hints.

### raw2d_validate_scene

Input:

```ts
{ document: unknown }
```

Output:

```ts
{ valid: boolean; errors: ValidationError[] }
```

Reports path-based validation errors without throwing for bad scene data.

### raw2d_generate_canvas_example

Input:

```ts
{ document: SceneDocument; canvasSelector?: string }
```

Output:

```ts
{ code: string; renderer: "canvas" }
```

Generates copyable Canvas setup code.

### raw2d_generate_webgl_example

Input:

```ts
{ document: SceneDocument; canvasSelector?: string }
```

Output:

```ts
{ code: string; renderer: "webgl" }
```

Generates copyable WebGLRenderer2D setup code with explicit Raw2D imports.

### raw2d_generate_docs_snippet

Input:

```ts
{ document: SceneDocument; title?: string; renderer?: "canvas" | "webgl" }
```

Output:

```ts
{ markdown: string }
```

Generates a short docs snippet with scene summary and code.

### raw2d_run_visual_check

Input:

```ts
{ target?: "all" | "browser" | "webgl" }
```

Output:

```ts
{ commands: { command: string; args: string[] }[] }
```

Returns command plans only. The MCP server does not run browser or visual checks internally.
