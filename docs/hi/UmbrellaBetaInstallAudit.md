# Umbrella Beta Install Audit

Ye audit `raw2d` umbrella package ko fresh Vite TypeScript app me check karta hai. Isse prove hota hai ki beginner ek package install karke scene render kar sakta hai, focused package split samjhe bina.

## Command

Raw2D repo se automated smoke run karo:

```bash
npm run test:consumer:umbrella
```

Script workspace packages pack karta hai, temporary app me `raw2d` install karta hai, TypeScript run karta hai, Vite build karta hai, aur runtime par package import karta hai.

## Scene Requirement

Generated app ko visible Canvas scene create karna chahiye:

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

Runtime check ko `raw2d` se import karke public classes confirm karni chahiye:

```js
const m = await import("raw2d");
console.log(typeof m.Scene, typeof m.CanvasRenderer);
```

Ye bhi confirm hona chahiye ki umbrella package low-level WebGL internals jaise `createWebGLShapeBatch` expose nahi karta.

## Pass Criteria

Audit tab pass hai jab:

- temporary Vite app creation succeed ho.
- packed packages se `npm install raw2d` succeed ho.
- `npx tsc --noEmit` pass ho.
- `npx vite build` pass ho.
- runtime import check `umbrella-runtime-ok` print kare.
- scene code `renderer.render(scene, camera)` call kare.
