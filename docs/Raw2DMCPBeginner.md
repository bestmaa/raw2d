# Raw2D MCP Beginner

`raw2d-mcp` is a separate package for AI tools and scripts. It creates scene JSON, validates it, inspects it, and generates examples.

## Install

```bash
npm install raw2d-mcp raw2d
```

## Create A Scene

```ts
import { createRaw2DSceneJson } from "raw2d-mcp";

const document = createRaw2DSceneJson({
  camera: { x: 0, y: 0, zoom: 1 }
});
```

## Add A Rect

```ts
import { addRaw2DSceneObject } from "raw2d-mcp";

const nextDocument = addRaw2DSceneObject({
  document,
  object: {
    type: "rect",
    id: "card",
    x: 80,
    y: 64,
    width: 160,
    height: 96,
    material: { fillColor: "#35c2ff" }
  }
});
```

## Validate And Inspect

```ts
const validation = validateRaw2DScene({ document: nextDocument });
const inspection = inspectRaw2DScene({ document: nextDocument });

console.log(validation.valid);
console.log(inspection.objectCount);
```

## Generate Example

```ts
const example = generateRaw2DCanvasExample({ document: nextDocument });

console.log(example.code);
```

## Rule

MCP helpers return JSON, generated code, markdown, or command plans. They do not silently edit files, run browsers, push Git, or publish npm packages.
