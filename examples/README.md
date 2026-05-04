# Raw2D Examples

These examples are small browser-first checks for the public Raw2D packages.
They are intentionally simple so package users can copy the setup into a fresh
Vite project.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5174/examples/`.

If port `5174` is already busy, run Vite manually:

```bash
npx vite --host 0.0.0.0 --port 5175
```

## Example Routes

- `/examples/canvas-basic/` shows the Canvas renderer baseline.
- `/examples/webgl-basic/` shows WebGL sprite batching and stats.
- `/examples/showcase/` shows a dense scene with sprites, shapes, labels, and stats.
- `/examples/sprite-atlas/` shows atlas-packed sprites sharing one texture.
- `/examples/interaction-basic/` shows selection, drag, and Rect resize.
- `/examples/camera-controls/` shows pointer pan and wheel zoom.
- `/examples/shape-path/` compares Canvas and WebGL ShapePath rendering.
- `/examples/text-basic/` shows Text2D rendering.
- `/examples/mcp-scene/` shows `raw2d-mcp` scene JSON helpers.
- `/examples/react-basic/` shows the separate `raw2d-react` bridge.

## Package Imports

Use the umbrella package when learning:

```ts
import { Camera2D, Canvas, Rect, Scene } from "raw2d";
```

Use focused packages when bundle control matters:

```ts
import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
```

React and MCP are separate packages:

```ts
import { Raw2DCanvas, RawRect } from "raw2d-react";
import { createRaw2DSceneJson } from "raw2d-mcp";
```

## Verification

Every example route is covered by browser smoke tests:

```bash
npm run test:browser
```

Full project verification:

```bash
npm run typecheck
npm test
npm run build:docs
npm run test:consumer
```
