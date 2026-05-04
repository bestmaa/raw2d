# Raw2D MCP Server Entry

`raw2d-mcp` me Node.js stdio server entry hai jisse agents Raw2D scene automation tools use kar sakte hain. Ye entry browser rendering packages se separate rehti hai.

## Goal

Server entry ka kaam MCP tools expose karna hai, par package deterministic aur audit-friendly rehna chahiye.

Isko ye karna chahiye:

- Node.js me ESM ke saath run
- stdio par communicate
- wahi tool names expose jo `createRaw2DMcpManifest` me hain
- `raw2d-mcp` ke pure helper functions call
- JSON results aur generated code strings return
- default me Canvas, WebGL, DOM, browser, aur file-system side effects avoid

## Package Boundary

Allowed dependency direction:

```text
raw2d-mcp -> raw2d-core
raw2d-mcp -> Node.js stdio adapter
```

Allowed nahi:

```text
raw2d-mcp -> raw2d-canvas
raw2d-mcp -> raw2d-webgl
raw2d-mcp -> browser globals
raw2d-mcp -> hidden project file writes
```

Generated examples me renderer packages aa sakte hain, lekin MCP server runtime me unko import nahi karega.

## CLI Shape

Package metadata me bin entry hai:

```json
{
  "bin": {
    "raw2d-mcp": "./dist/server.js"
  }
}
```

Local usage:

```bash
npx raw2d-mcp
```

MCP clients is command ko stdio server ki tarah launch karte hain.

## Tool Dispatch

Server me small dispatch table hoti hai:

```ts
const tools = {
  raw2d_create_scene: createRaw2DSceneJson,
  raw2d_add_object: addRaw2DSceneObject,
  raw2d_validate_scene: validateRaw2DScene
};
```

Dispatch layer sirf ye kare:

- MCP input parse
- matching helper call
- result serialize
- thrown errors ko structured MCP errors me convert

## Local Smoke

Server ek line me JSON request leta hai aur ek line me JSON response deta hai.

```json
{"jsonrpc":"2.0","id":1,"method":"raw2d_create_scene","params":{}}
```

Expected response:

```json
{"jsonrpc":"2.0","id":1,"result":{"scene":{"objects":[]},"camera":{"x":0,"y":0,"zoom":1}}}
```

## Verification

Executable server change karne ke baad ye checks pass hone chahiye:

```bash
npm run typecheck
npm test
npm run test:consumer:mcp
```

Local stdio smoke `packages/mcp/dist/server.js` start karta hai, ek tool request bhejta hai, aur JSON response check karta hai.
