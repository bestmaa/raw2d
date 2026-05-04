# Raw2D MCP And Plugin Consumer Guide

Raw2D has two automation surfaces:

- `raw2d-mcp` is an installable package for scene JSON, validation, inspection, and generated examples.
- `plugins/raw2d` is a repo-local Codex plugin for contributors working inside this repository.

## When To Use MCP

Use `raw2d-mcp` when an external agent or script needs deterministic Raw2D data:

```bash
npm install raw2d-mcp raw2d
```

```ts
import { createRaw2DSceneJson, validateRaw2DScene } from "raw2d-mcp";

const document = createRaw2DSceneJson();
const result = validateRaw2DScene({ document });
```

MCP helpers return JSON, generated code, or command plans. They do not draw, push Git, publish npm packages, or control a browser.

## When To Use The Plugin

Use the repo plugin when contributing to Raw2D itself:

```bash
node plugins/raw2d/scripts/run-docs-qa.mjs --json
node plugins/raw2d/scripts/create-raw2d-showcase.mjs --out /tmp/raw2d-showcase --renderer webgl
node plugins/raw2d/scripts/run-fresh-install-audit.mjs --dry-run --json
```

The plugin can scaffold examples, explain stats, run docs QA, and prepare audit plans. Release tasks still own version bumps, tags, pushes, release notes, and npm workflow checks.

## Recommended Flow

1. Use MCP to create or inspect scene JSON.
2. Generate Canvas/WebGL snippets from that JSON.
3. Use plugin scripts to create examples or run audit checks in this repo.
4. Run browser and visual checks before claiming the result is ready.
5. Push or publish only when the task explicitly asks for a release.
