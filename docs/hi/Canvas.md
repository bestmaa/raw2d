# Canvas

Canvas Raw2D ka stable reference renderer hai. Iska kaam browser ke real `HTMLCanvasElement` ko manage karna, size set karna, clear karna, aur `Scene + Camera2D` ko draw karna hai.

Raw2D me object khud draw nahi karta. `Rect`, `Circle`, `Line`, `Sprite`, ya `Text2D` sirf data rakhte hain. Drawing renderer ki responsibility hai.

## Basic Setup

```html
<canvas id="raw2d-canvas"></canvas>
```

```ts
import { Camera2D, Canvas, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D();

raw2dCanvas.render(scene, camera);
```

## Sabse Chhota Working Scene

Ye sabse chhota useful Canvas-first scene hai. Isme ek renderer, ek scene, ek camera, ek object, aur ek render call hai.

```html
<canvas id="raw2d-canvas"></canvas>
```

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

raw2dCanvas.render(scene, camera);
```

`render(scene, camera)` canvas clear karta hai, scene traverse karta hai, camera aur object transforms apply karta hai, phir supported objects draw karta hai.

## Render Flow

`render(scene, camera)` pehle canvas clear karta hai. Uske baad scene ke visible objects ko camera ke hisab se draw karta hai.

```ts
raw2dCanvas.render(scene, camera);
```

Animation me har frame render call kar sakte hain:

```ts
function animate(): void {
  raw2dCanvas.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```

## Resize

Fullscreen app ya responsive editor ke liye canvas ka logical size update karein.

```ts
function resize(): void {
  raw2dCanvas.setSize(window.innerWidth, window.innerHeight);
  raw2dCanvas.render(scene, camera);
}

window.addEventListener("resize", resize);
resize();
```

## Important Notes

- Canvas path sabse pehle complete hona chahiye, kyunki ye simple aur debug-friendly renderer hai.
- WebGL fast path hai, lekin Canvas behavior ko reference maana jata hai.
- Canvas object ke andar rendering pipeline unnecessary hide nahi honi chahiye.
- Object data aur renderer drawing logic separate rehne chahiye.

## English Reference

Detailed English version: `docs/Canvas.md`
