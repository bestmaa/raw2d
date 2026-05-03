# Raw2D MCP Boundary

`raw2d-mcp` is for explicit scene automation. It should help agents create, validate, inspect, and explain Raw2D scenes without silently controlling the project.

## Allowed Behavior

- Return scene JSON.
- Return validation and inspection results.
- Return generated TypeScript and markdown strings.
- Return command plans for visual checks and export audits.
- Throw clear errors for duplicate or missing object ids.

## Disallowed Behavior

- Do not write project files without a separate explicit tool.
- Do not publish npm packages.
- Do not push Git commits.
- Do not upload scene data or call external services.
- Do not control a browser internally.
- Do not hide generated code from the caller.

## Agent Workflow

1. Create or update scene JSON.
2. Validate the scene JSON.
3. Generate examples or docs snippets.
4. Show generated output to the user or caller.
5. Run visual-check commands only through the host environment.

## Public Surface

The MCP package should stay small and deterministic. Each tool should return plain data that can be tested with Node unit tests.
