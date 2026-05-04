# Raw2D MCP Server Entry

`raw2d-mcp` me Node.js stdio server entry honi chahiye jisse agents Raw2D scene automation tools use kar saken. Ye entry browser rendering packages se separate rehni chahiye.

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

Future package metadata me bin entry honi chahiye:

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

MCP clients is command ko stdio server ki tarah launch kar sakte hain.

## Tool Dispatch

Server me small dispatch table honi chahiye:

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

## Verification

Executable server add karne se pehle ye checks pass hone chahiye:

```bash
npm run typecheck
npm test
npm run test:consumer:mcp
```

Pehle executable task me local stdio smoke bhi hona chahiye jo server start kare, ek tool request bheje, aur JSON response check kare.
