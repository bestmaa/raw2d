# Getting Started

Ye Raw2D shuru karne ka short guide hai. Isme install se lekar pehla scene render karne tak ka flow diya gaya hai.

Pehle `raw2d` package use karein. Ye umbrella package hai, jisme stable public API ek jagah milti hai.

## Install

```bash
npm install raw2d
```

Advanced users baad me focused packages install kar sakte hain:

```bash
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-interaction
```

## Canvas Element

```html
<canvas id="raw2d-canvas"></canvas>
```

Raw2D ko real browser `HTMLCanvasElement` chahiye. Ye app ke liye apne aap hidden canvas create nahi karta.

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

Raw2D apne aap animation loop start nahi karta. Timing aur redraw app ke control me rehte hain.

## WebGL Par Switch

Same `Scene` aur `Camera2D` ko WebGL renderer se draw kar sakte hain, jab objects supported hon.

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

- `Canvas.md`: Canvas renderer ka setup aur render flow.
- `WebGLRenderer2D.md`: WebGL renderer aur stats.
- `Scene.md` aur `Camera2D.md`: core render flow.
- `Rect.md`, `Circle.md`, aur `Line.md`: drawing primitives.
- `TextureAtlas.md` aur `SpriteAnimation.md`: sprite workflow.
- `InteractionController.md`: selection, drag, aur resize.
