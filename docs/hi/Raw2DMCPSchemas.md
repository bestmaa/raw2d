# Raw2D MCP Schemas

`raw2d-mcp` tools clear JSON inputs aur JSON outputs use karte hain. Tools deterministic hain aur draw, file write, npm publish, ya Git push nahi karte.

## Shared Scene Document

Zyada tools ye scene document shape accept karte hain:

```ts
interface SceneDocument {
  scene: { objects: SceneObject[] };
  camera: { x: number; y: number; zoom: number };
}
```

Supported object types hain `rect`, `circle`, `line`, `text`, `sprite`, aur `shapePath`.

## Tool Schemas

### raw2d_create_scene

Input:

```ts
{ camera?: { x?: number; y?: number; zoom?: number } }
```

Output: `SceneDocument`

Empty scene create karta hai camera defaults ke saath.

### raw2d_add_object

Input:

```ts
{ document: SceneDocument; object: SceneObject }
```

Output: `SceneDocument`

Ek supported object add karta hai aur duplicate ids reject karta hai.

### raw2d_update_transform

Input:

```ts
{ document: SceneDocument; id: string; transform: TransformPatch }
```

Output: `SceneDocument`

Ek object ke x/y, rotation, scale, origin, zIndex, visibility, ya renderMode update karta hai.

### raw2d_update_material

Input:

```ts
{ document: SceneDocument; id: string; material: MaterialPatch }
```

Output: `SceneDocument`

Fill, stroke, line width, opacity, aur text style fields merge karta hai.

### raw2d_update_objects

Input:

```ts
{
  document: SceneDocument;
  transforms?: { id: string; transform: TransformPatch }[];
  materials?: { id: string; material: MaterialPatch }[];
}
```

Output:

```ts
{ document: SceneDocument; updatedIds: string[] }
```

Ek hi deterministic update me kai objects ke transform aur material patches apply karta hai.

### raw2d_inspect_scene

Input:

```ts
{ document: SceneDocument }
```

Output: object count, type counts, texture/text flags, aur renderer hints.

### raw2d_validate_scene

Input:

```ts
{ document: unknown }
```

Output:

```ts
{ valid: boolean; errors: ValidationError[] }
```

Bad scene data ke liye throw nahi karta; path-based validation errors return karta hai.

### raw2d_generate_canvas_example

Input:

```ts
{ document: SceneDocument; canvasSelector?: string }
```

Output:

```ts
{ code: string; renderer: "canvas" }
```

Copyable Canvas setup code generate karta hai.

### raw2d_generate_webgl_example

Input:

```ts
{ document: SceneDocument; canvasSelector?: string }
```

Output:

```ts
{ code: string; renderer: "webgl" }
```

Explicit Raw2D imports ke saath WebGLRenderer2D setup code generate karta hai.

### raw2d_generate_docs_snippet

Input:

```ts
{ document: SceneDocument; title?: string; renderer?: "canvas" | "webgl" }
```

Output:

```ts
{ markdown: string }
```

Scene summary aur code ke saath short docs snippet generate karta hai.

### raw2d_run_visual_check

Input:

```ts
{ target?: "all" | "browser" | "webgl" }
```

Output:

```ts
{ commands: { command: string; args: string[] }[] }
```

Sirf command plans return karta hai. MCP server browser ya visual checks internally run nahi karta.
