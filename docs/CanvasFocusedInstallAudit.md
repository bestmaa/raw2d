# Canvas Focused Install Audit

This audit checks the smallest focused package path for Canvas users: `raw2d-core` plus `raw2d-canvas`. It keeps WebGL, sprite, text, React, and MCP out of the generated app.

## Command

Run the Canvas-only consumer smoke:

```bash
npm run test:consumer:canvas
```

The script creates a temporary Vite TypeScript app, packs the Canvas package path, installs it, typechecks, builds, and runs a runtime import check.

## Install Shape

The generated user app should only need:

```bash
npm install raw2d-core raw2d-canvas
```

This is the recommended path for users who want the smallest Canvas renderer setup.

`raw2d-canvas` may pull `raw2d-sprite` and `raw2d-text` as transitive dependencies because the Canvas renderer can draw Sprite and Text2D objects. Users do not need to import those packages for a Rect-only Canvas scene.

## Scene Requirement

The app must render a visible Canvas object:

```ts
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { CanvasRenderer } from "raw2d-canvas";

const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });
scene.add(new Rect({ width: 128, height: 72, material: new BasicMaterial({ fillColor: "#35c2ff" }) }));
renderer.render(scene, camera);
```

## Pass Criteria

The audit passes when:

- the user-facing install path is `raw2d-core raw2d-canvas`.
- local unpublished transitive tarballs install successfully.
- TypeScript strict mode accepts the imports.
- Vite builds the temporary app.
- runtime import prints `canvas-focused-runtime-ok`.
- renderer stats report at least one rendered object.
