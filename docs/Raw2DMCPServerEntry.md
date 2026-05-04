# Raw2D MCP Server Entry

`raw2d-mcp` should provide a Node.js stdio server entry for agents that need Raw2D scene automation. The entry must stay separate from browser rendering packages.

## Goal

The server entry should make Raw2D tools available through MCP while keeping the package deterministic and easy to audit.

It should:

- run in Node.js as ESM
- communicate over stdio
- expose the same tool names as `createRaw2DMcpManifest`
- call pure helper functions from `raw2d-mcp`
- return JSON results and generated code strings
- avoid Canvas, WebGL, DOM, browser, and file-system side effects by default

## Package Boundary

Allowed dependency direction:

```text
raw2d-mcp -> raw2d-core
raw2d-mcp -> Node.js stdio adapter
```

Not allowed:

```text
raw2d-mcp -> raw2d-canvas
raw2d-mcp -> raw2d-webgl
raw2d-mcp -> browser globals
raw2d-mcp -> project file writes without explicit future tool design
```

Renderer packages can still appear in generated examples, but the MCP server should not import them at runtime.

## CLI Shape

Future package metadata should expose a bin entry:

```json
{
  "bin": {
    "raw2d-mcp": "./dist/server.js"
  }
}
```

Local usage should look like:

```bash
npx raw2d-mcp
```

MCP clients can then launch that command as a stdio server.

## Tool Dispatch

The server should use a small dispatch table:

```ts
const tools = {
  raw2d_create_scene: createRaw2DSceneJson,
  raw2d_add_object: addRaw2DSceneObject,
  raw2d_validate_scene: validateRaw2DScene
};
```

The dispatch layer should only:

- parse MCP input
- call the matching helper
- serialize the result
- convert thrown errors into structured MCP errors

## Verification

Before adding the executable server, verify:

```bash
npm run typecheck
npm test
npm run test:consumer:mcp
```

The first executable task should also include a local stdio smoke that starts the server, sends one tool request, and checks the JSON response.
