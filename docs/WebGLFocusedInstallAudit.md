# WebGL Focused Install Audit

This audit checks the focused WebGL package path: `raw2d-core` plus `raw2d-webgl`. It proves that WebGL users can avoid the umbrella package while still getting a buildable renderer setup.

## Command

Run the WebGL-only consumer smoke:

```bash
npm run test:consumer:webgl
```

The script creates a temporary Vite TypeScript app, packs the WebGL package path, installs it, typechecks, builds, and imports WebGL exports at runtime.

## Install Shape

The generated user app should directly install:

```bash
npm install raw2d-core raw2d-webgl
```

`raw2d-webgl` may pull sprite and text packages as transitive dependencies because the renderer can batch Sprite and Text2D objects.

## Scene Requirement

The app must create a WebGL renderer and render when WebGL2 is available:

```ts
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D, isWebGL2Available } from "raw2d-webgl";

const scene = new Scene();
const camera = new Camera2D();
const renderer = new WebGLRenderer2D({ canvas, width: 320, height: 180 });
scene.add(new Rect({ width: 128, height: 72, material: new BasicMaterial({ fillColor: "#35c2ff" }) }));

if (isWebGL2Available({ canvas })) {
  renderer.render(scene, camera);
}
```

## Pass Criteria

The audit passes when:

- the user-facing install path is `raw2d-core raw2d-webgl`.
- TypeScript strict mode accepts the imports.
- Vite builds the temporary app.
- runtime import prints `webgl-focused-runtime-ok`.
- no Canvas renderer package is required by the generated app code.
