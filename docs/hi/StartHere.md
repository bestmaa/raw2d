# Yahan Se Shuru Karein

Ye Raw2D ka beginner path hai. Agar aap pehli baar library try kar rahe hain, to isi order me chalna sabse simple rahega.

## Sabse Pehle Kya Install Karna Hai

Pehle umbrella package install karein. Isme Raw2D ka public API ek jagah milta hai:

```bash
npm install raw2d
```

Focused packages baad me use karein, jab aapko sirf canvas, webgl, ya interaction layer alag se chahiye.

## Pehla Render Goal

Pehle ek canvas, ek scene, ek camera, ek object banayein. Uske baad `render(scene, camera)` call karein.

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);
```

## Seekhne Ka Order

Docs padhte waqt ye flow follow karein:

1. Install / Setup
2. Canvas Init
3. Scene
4. Camera2D
5. Rect ya Circle draw karna
6. Texture aur Sprite
7. Canvas / WebGL
8. Interaction Path
9. React ya MCP, sirf jab project me zarurat ho

## Canvas First

Canvas Raw2D ka reference renderer hai. Debugging, simple scenes, aur visual correctness check karne ke liye pehle Canvas use karein.

## WebGL Kab Use Karna Hai

WebGL tab use karein jab scene me bahut objects, sprites, texture atlas, ya draw-call pressure ho. Scene aur camera same rahte hain, renderer swap hota hai.

## Next

Next docs: `/doc#beginner-path`, phir `/examples/canvas-basic/`, phir `/examples/webgl-basic/`.
