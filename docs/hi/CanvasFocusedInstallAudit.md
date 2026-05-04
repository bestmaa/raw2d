# Canvas Focused Install Audit

Ye audit Canvas users ke liye sabse chhota focused package path check karta hai: `raw2d-core` plus `raw2d-canvas`. Generated app me WebGL, sprite, text, React, aur MCP nahi aana chahiye.

## Command

Canvas-only consumer smoke run karo:

```bash
npm run test:consumer:canvas
```

Script temporary Vite TypeScript app banata hai, Canvas package path pack karke install karta hai, typecheck karta hai, build karta hai, aur runtime import check run karta hai.

## Install Shape

Generated user app ko sirf ye chahiye:

```bash
npm install raw2d-core raw2d-canvas
```

Ye users ke liye recommended path hai jab unhe smallest Canvas renderer setup chahiye.

`raw2d-canvas` transitive dependency ke roop me `raw2d-sprite` aur `raw2d-text` la sakta hai, kyunki Canvas renderer Sprite aur Text2D draw kar sakta hai. Rect-only Canvas scene ke liye user ko un packages ko import karne ki zarurat nahi hai.

## Scene Requirement

App ko visible Canvas object render karna chahiye:

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

Audit tab pass hai jab:

- user-facing install path `raw2d-core raw2d-canvas` rahe.
- local unpublished transitive tarballs successfully install hon.
- TypeScript strict mode imports accept kare.
- Vite temporary app build kare.
- runtime import `canvas-focused-runtime-ok` print kare.
- renderer stats kam se kam ek rendered object report kare.
