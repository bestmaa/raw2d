# Raw2D MCP Beginner

`raw2d-mcp` AI tools aur scripts ke liye separate package hai. Ye scene JSON create, validate, inspect, aur examples generate karta hai.

## Install

```bash
npm install raw2d-mcp raw2d
```

## Scene Banayein

```ts
import { createRaw2DSceneJson } from "raw2d-mcp";

const document = createRaw2DSceneJson({
  camera: { x: 0, y: 0, zoom: 1 }
});
```

## Rect Add Karein

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

## Validate Aur Inspect

```ts
const validation = validateRaw2DScene({ document: nextDocument });
const inspection = inspectRaw2DScene({ document: nextDocument });

console.log(validation.valid);
console.log(inspection.objectCount);
```

## Example Generate Karein

```ts
const example = generateRaw2DCanvasExample({ document: nextDocument });

console.log(example.code);
```

## Rule

MCP helpers JSON, generated code, markdown, ya command plans return karte hain. Ye hidden file edit, browser run, Git push, ya npm publish nahi karte.
