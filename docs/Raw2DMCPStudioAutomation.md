# Raw2D MCP Studio Automation

`raw2d-mcp` can prepare Studio-safe scene edits without importing Studio, Canvas, WebGL, DOM APIs, or browser tools.

## Boundary

- MCP helpers return JSON, validation results, generated Studio `.raw2d.json`, and command plans.
- MCP helpers do not write files, click the Studio UI, run a browser, publish packages, or push Git.
- Studio remains the owner of UI state, command history, save/load, and renderer adapters.
- Canvas and WebGL packages remain renderer packages; MCP must not depend on them.

## Agent-Safe Workflow

1. Build a scene document with `createRaw2DSceneJson` and object helpers.
2. Use `createRaw2DMcpSceneEditPlan` for create, update, delete, reorder, and Sprite asset-reference edits.
3. Validate Studio JSON with `validateRaw2DStudioScene`.
4. Generate a Studio example with `generateRaw2DStudioExample`.
5. Show the JSON or plan to the user before any host writes files or imports it into Studio.

## Studio Edit Plans

```ts
import { createRaw2DMcpSceneEditPlan } from "raw2d-mcp";

const plan = createRaw2DMcpSceneEditPlan({
  document,
  operations: [
    { type: "createObject", object: { id: "card", type: "rect", width: 120, height: 80 } },
    { type: "reorderObject", id: "card", index: 0 }
  ]
});
```

The plan includes deterministic step ids, affected object ids, and before/after object order so an agent can explain the edit before applying it elsewhere.

## Studio Validation

```ts
import { validateRaw2DStudioScene } from "raw2d-mcp";

const result = validateRaw2DStudioScene({ document: studioDocument });
```

Validation reports schema errors separately from warnings. Missing asset references and WebGL renderer notes are warnings because Studio can still load the scene and surface diagnostics.

## Generated Studio Examples

```ts
import { generateRaw2DStudioExample } from "raw2d-mcp";

const example = generateRaw2DStudioExample({
  document,
  name: "Agent Draft",
  rendererMode: "canvas"
});
```

The generated example contains a stable filename, formatted JSON, the Studio scene document, and validation output. Tests verify the JSON round-trips through Studio save/load and render adapters.

## Review Rules

- Reject duplicate ids before proposing edits.
- Keep Sprite asset ids explicit through `assetSlot`.
- Treat WebGL warnings as user-visible notes, not hidden failures.
- Prefer small plans that are easy to inspect and undo.
- Never hide destructive deletes inside a large generated batch.
