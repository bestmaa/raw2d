# raw2d-mcp

`raw2d-mcp` is the planned Model Context Protocol package for Raw2D scene automation. The first scaffold exposes a stable manifest so later tasks can add tools one by one.

## Current Scope

- Describe the package name and version.
- List planned MCP tool names.
- Keep runtime code deterministic and side-effect free.
- Avoid browser, file-writing, publishing, or network behavior in the scaffold.

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
