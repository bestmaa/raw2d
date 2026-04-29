# Getting Started

Ye Raw2D start karne ka shortest guide hai. Isme install se lekar first scene render tak ka flow diya gaya hai.

Pehle `raw2d` package use karo. Ye umbrella package hai, jisme stable public API ek jagah milti hai.

## Install

```bash
npm install raw2d
```

Advanced users baad me focused packages use kar sakte hain:

```bash
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-interaction
```

## Canvas Element

```html
<canvas id="raw2d-canvas"></canvas>
```

Raw2D ko real browser `HTMLCanvasElement` chahiye. Ye app ke liye hidden canvas create nahi karta.

## First Object Render

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

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

## Animation Loop

```ts
function animate(): void {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```

Raw2D hidden loop start nahi karta. Timing app ke control me rehti hai.

## WebGL Par Switch

Same `Scene` aur `Camera2D` ko WebGL renderer se draw kar sakte ho, jab objects supported hon.

```ts
import { WebGLRenderer2D } from "raw2d";

const webglRenderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
```

Canvas complete reference renderer hai. WebGL batch-first performance renderer hai.

## Next Topics

- `Canvas.md` me Canvas renderer detail hai.
- `WebGLRenderer2D.md` me WebGL renderer detail hai.
- `Scene.md` aur `Camera2D.md` core render flow samjhate hain.
- `Rect.md`, `Circle.md`, aur `Line.md` primitives ke liye hain.
- `TextureAtlas.md` aur `SpriteAnimation.md` sprite workflow ke liye hain.
- `InteractionController.md` selection, drag, aur resize ke liye hai.
