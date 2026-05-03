# raw2d-mcp

`raw2d-mcp` is the planned Model Context Protocol package for Raw2D scene automation. The first scaffold exposes a stable manifest so later tasks can add tools one by one.

## Current Scope

- Describe the package name and version.
- List planned MCP tool names.
- Create an empty scene JSON document with camera defaults.
- Keep runtime code deterministic and side-effect free.
- Avoid browser, file-writing, publishing, or network behavior in the scaffold.

## Create Scene JSON

```ts
import { createRaw2DSceneJson } from "raw2d-mcp";

const document = createRaw2DSceneJson({
  camera: { x: 0, y: 0, zoom: 1 }
});
```

The returned shape is intentionally close to Raw2D examples:

```json
{
  "scene": { "objects": [] },
  "camera": { "x": 0, "y": 0, "zoom": 1 }
}
```

## Planned Tool Areas

- Scene creation
- Object creation
- Transform updates
- Material updates
- Scene inspection
- Scene validation
- Canvas/WebGL example generation
- Docs snippet generation
- Visual test command integration

## Boundary

This package should return data and generated code. It should not silently mutate a project or transmit project data.

## Add Object JSON

```ts
import { addRaw2DSceneObject, createRaw2DSceneJson } from "raw2d-mcp";

const emptyScene = createRaw2DSceneJson();
const sceneWithRect = addRaw2DSceneObject({
  document: emptyScene,
  object: {
    type: "rect",
    id: "hero-card",
    x: 80,
    y: 64,
    width: 160,
    height: 96,
    material: { fillColor: "#35c2ff" }
  }
});
```

The add helper returns a new scene document and rejects duplicate object ids.

## Update Object Transform

```ts
import { updateRaw2DObjectTransform } from "raw2d-mcp";

const movedScene = updateRaw2DObjectTransform({
  document: sceneWithRect,
  id: "hero-card",
  transform: {
    x: 120,
    y: 90,
    rotation: 0.25,
    renderMode: "static"
  }
});
```

The update helper only changes the matching object and throws when the id is missing.
