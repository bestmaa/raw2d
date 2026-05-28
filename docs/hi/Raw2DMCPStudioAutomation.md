# Raw2D MCP Studio Automation

`raw2d-mcp` Studio-safe scene edits prepare kar sakta hai bina Studio, Canvas, WebGL, DOM APIs, ya browser tools import kiye.

## Boundary

- MCP helpers JSON, validation results, generated Studio `.raw2d.json`, aur command plans return karte hain.
- MCP helpers files write, Studio UI click, browser run, package publish, ya Git push nahi karte.
- Studio UI state, command history, save/load, aur renderer adapters ka owner rahta hai.
- Canvas aur WebGL renderer packages hi rahenge; MCP un par depend nahi karega.

## Agent-Safe Workflow

1. `createRaw2DSceneJson` aur object helpers se scene document banao.
2. Create, update, delete, reorder, aur Sprite asset-reference edits ke liye `createRaw2DMcpSceneEditPlan` use karo.
3. Studio JSON ko `validateRaw2DStudioScene` se validate karo.
4. Studio example ko `generateRaw2DStudioExample` se generate karo.
5. Host file write ya Studio import se pehle JSON ya plan user ko dikhao.

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

Plan deterministic step ids, affected object ids, aur before/after object order deta hai taaki agent edit apply karne se pehle clearly explain kar sake.

## Studio Validation

```ts
import { validateRaw2DStudioScene } from "raw2d-mcp";

const result = validateRaw2DStudioScene({ document: studioDocument });
```

Validation schema errors ko warnings se alag rakhta hai. Missing asset references aur WebGL renderer notes warnings hain, kyunki Studio scene load karke diagnostics dikha sakta hai.

## Generated Studio Examples

```ts
import { generateRaw2DStudioExample } from "raw2d-mcp";

const example = generateRaw2DStudioExample({
  document,
  name: "Agent Draft",
  rendererMode: "canvas"
});
```

Generated example stable filename, formatted JSON, Studio scene document, aur validation output deta hai. Tests verify karte hain ki JSON Studio save/load aur render adapters se round-trip hota hai.

## Review Rules

- Edit propose karne se pehle duplicate ids reject karo.
- Sprite asset ids ko `assetSlot` ke through explicit rakho.
- WebGL warnings ko hidden failures nahi, user-visible notes samjho.
- Chhote plans prefer karo jo inspect aur undo karna easy ho.
- Destructive deletes ko large generated batch ke andar hide mat karo.
