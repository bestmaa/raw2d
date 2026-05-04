# Raw2D MCP Server Entry

`raw2d-mcp` provides a Node.js stdio server entry for agents that need Raw2D scene automation. The entry stays separate from browser rendering packages.

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

Package metadata exposes a bin entry:

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

MCP clients can launch that command as a stdio server.

## Tool Dispatch

The server uses a small dispatch table:

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

## Local Smoke

The server accepts one JSON request per line and writes one JSON response per line.

```json
{"jsonrpc":"2.0","id":1,"method":"raw2d_create_scene","params":{}}
```

Expected response:

```json
{"jsonrpc":"2.0","id":1,"result":{"scene":{"objects":[]},"camera":{"x":0,"y":0,"zoom":1}}}
```

## Verification

After changing the executable server, verify:

```bash
npm run typecheck
npm test
npm run test:consumer:mcp
```

The local stdio smoke starts `packages/mcp/dist/server.js`, sends one tool request, and checks the JSON response.
