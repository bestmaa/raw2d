# raw2d-mcp

`raw2d-mcp` is the planned Model Context Protocol package for Raw2D scene automation. The first scaffold exposes a stable manifest so later tasks can add tools one by one.

## Current Scope

- Create Raw2D scene JSON with camera defaults.
- Add supported object JSON.
- Update transform and material fields immutably.
- Validate and inspect scene JSON.
- Generate Canvas, WebGL, and markdown examples.
- Create explicit visual-check and export-audit plans.
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

## Update Object Material

```ts
import { updateRaw2DObjectMaterial } from "raw2d-mcp";

const styledScene = updateRaw2DObjectMaterial({
  document: movedScene,
  id: "hero-card",
  material: {
    fillColor: "#f45b69",
    strokeColor: "#ffffff",
    lineWidth: 2,
    opacity: 0.9
  }
});
```

Material patches merge with existing material data so small updates do not erase other style fields.

## Inspect Scene

```ts
import { inspectRaw2DScene } from "raw2d-mcp";

const inspection = inspectRaw2DScene({ document: styledScene });
```

Inspection returns object counts, type counts, texture/text flags, and renderer hints. It does not build Raw2D objects or draw anything.

## Validate Scene

```ts
import { validateRaw2DScene } from "raw2d-mcp";

const result = validateRaw2DScene({ document: styledScene });

if (!result.valid) {
  console.table(result.errors);
}
```

Validation accepts unknown JSON and returns path-based errors. It does not throw for bad scene data.

## Generate Canvas And WebGL Examples

```ts
import { generateRaw2DCanvasExample, generateRaw2DWebGLExample } from "raw2d-mcp";

const canvasExample = generateRaw2DCanvasExample({ document: styledScene });
const webglExample = generateRaw2DWebGLExample({ document: styledScene });

console.log(canvasExample.code);
console.log(webglExample.code);
```

Generated examples import from `raw2d`, create a canvas renderer, rebuild scene objects, and call `renderer.render(scene, camera)`.

## Generate Docs Snippet

```ts
import { generateRaw2DDocsSnippet } from "raw2d-mcp";

const snippet = generateRaw2DDocsSnippet({
  document: styledScene,
  title: "Hero Card Scene",
  renderer: "canvas"
});

console.log(snippet.markdown);
```

The snippet includes a short scene summary plus a fenced TypeScript example.

## Visual Check Plan

```ts
import { createRaw2DVisualCheckPlan } from "raw2d-mcp";

const plan = createRaw2DVisualCheckPlan({ target: "all" });

for (const command of plan.commands) {
  console.log(command.command, command.args.join(" "));
}
```

The MCP package returns explicit commands instead of controlling a browser internally. Agents can display the plan, ask for confirmation, then run the commands in the Raw2D repo.

## AI Control Boundary

`raw2d-mcp` returns plain data. It should not silently write files, publish npm packages, push Git, call external services, or control a browser internally.

Recommended agent flow:

1. Create or update scene JSON.
2. Validate and inspect it.
3. Generate examples, docs snippets, audits, or visual-check plans.
4. Show the generated output.
5. Run host commands only after the caller allows it.

## Audit Package Exports

```ts
import { auditRaw2DPackageExports } from "raw2d-mcp";

const result = auditRaw2DPackageExports({
  packages: [packageManifestJson]
});
```

The audit checks Raw2D package export-map conventions and returns structured issues for agents to report or fix.
