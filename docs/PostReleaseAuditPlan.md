# Post-Release Consumer Audit

This audit checks Raw2D from the outside, the same way a new npm user would use it.

## Goal

Confirm that published packages, CDN files, docs snippets, and examples work without workspace paths.

## Fresh Install Matrix

Run these in temporary projects:

```bash
npm install raw2d
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-text
npm install raw2d-mcp
npm install raw2d-react react react-dom
```

## Runtime Checks

Each app must build and render one real scene:

- Canvas basic scene.
- WebGL basic scene.
- Sprite and Texture Atlas scene.
- Interaction select, drag, and resize scene.
- React adapter scene.
- MCP scene JSON helper import.

## Snippet Checks

Docs and README snippets must use package imports only:

```ts
import { Scene, Camera2D } from "raw2d";
import { CanvasRenderer } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

Do not accept snippets that rely on `src/`, relative package internals, or workspace aliases.

## Pass Criteria

The audit passes when:

- `npm view raw2d version` shows the expected release.
- jsDelivr returns the same release.
- Fresh apps install with no dependency warnings that block the build.
- `npm run build` passes for every generated app.
- Canvas, WebGL, Sprite, Texture Atlas, and Interaction examples visibly render.
- `/doc` and `/readme` still load after the release.
