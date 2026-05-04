# WebGL Focused Install Audit

Ye audit focused WebGL package path check karta hai: `raw2d-core` plus `raw2d-webgl`. Isse prove hota hai ki WebGL users umbrella package ke bina buildable renderer setup use kar sakte hain.

## Command

WebGL-only consumer smoke run karo:

```bash
npm run test:consumer:webgl
```

Script temporary Vite TypeScript app banata hai, WebGL package path pack karke install karta hai, typecheck karta hai, build karta hai, aur runtime par WebGL exports import karta hai.

## Install Shape

Generated user app ko directly ye install karna chahiye:

```bash
npm install raw2d-core raw2d-webgl
```

`raw2d-webgl` sprite aur text packages ko transitive dependencies ke roop me la sakta hai, kyunki renderer Sprite aur Text2D objects batch kar sakta hai.

## Scene Requirement

App ko WebGL renderer create karna chahiye aur WebGL2 available ho to render karna chahiye:

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

Audit tab pass hai jab:

- user-facing install path `raw2d-core raw2d-webgl` rahe.
- TypeScript strict mode imports accept kare.
- Vite temporary app build kare.
- runtime import `webgl-focused-runtime-ok` print kare.
- generated app code ko Canvas renderer package ki zarurat na ho.
