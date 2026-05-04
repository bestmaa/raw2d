# Umbrella Beta Install Audit

This audit checks the `raw2d` umbrella package in a fresh Vite TypeScript app. It proves that a beginner can install one package and render a scene without knowing the focused package split.

## Command

Run the automated smoke from the Raw2D repo:

```bash
npm run test:consumer:umbrella
```

The script packs the workspace packages, installs `raw2d` into a temporary app, runs TypeScript, builds with Vite, and imports the package at runtime.

## Scene Requirement

The generated app must create a visible Canvas scene:

```ts
import { BasicMaterial, Camera2D, CanvasRenderer, Rect, Scene, Text2D } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });
scene.add(new Rect({ width: 120, height: 72, material: new BasicMaterial({ fillColor: "#35c2ff" }) }));
scene.add(new Text2D({ text: "Raw2D", material: new BasicMaterial({ fillColor: "#ffffff" }) }));
renderer.render(scene, camera);
```

## Runtime Requirement

The runtime check must import from `raw2d` and confirm public classes exist:

```js
const m = await import("raw2d");
console.log(typeof m.Scene, typeof m.CanvasRenderer);
```

It must also confirm the umbrella package does not expose low-level WebGL internals like `createWebGLShapeBatch`.

## Pass Criteria

The audit passes when:

- temporary Vite app creation succeeds.
- `npm install raw2d` through packed packages succeeds.
- `npx tsc --noEmit` passes.
- `npx vite build` passes.
- runtime import check prints `umbrella-runtime-ok`.
- the scene code calls `renderer.render(scene, camera)`.
