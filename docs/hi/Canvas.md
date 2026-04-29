# Canvas

Canvas Raw2D ka stable reference renderer hai. Iska kaam browser ke real `HTMLCanvasElement` ko manage karna, size set karna, clear karna, aur `Scene + Camera2D` ko draw karna hai.

Raw2D me object khud draw nahi karta. `Rect`, `Circle`, `Line`, `Sprite`, ya `Text2D` sirf apna data rakhte hain. Drawing renderer karta hai.

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

## Render Ka Flow

`render(scene, camera)` pehle canvas clear karta hai, phir scene ke visible objects ko camera ke hisab se draw karta hai.

```ts
raw2dCanvas.render(scene, camera);
```

Har frame me render call kar sakte ho:

```ts
function animate(): void {
  raw2dCanvas.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```

## Resize

Fullscreen ya responsive editor ke liye canvas ka logical size update karo.

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
- Canvas object ke andar rendering pipeline hide nahi honi chahiye.
- Object data aur renderer drawing logic separate rehna chahiye.

## English Reference

Detailed English version: `docs/Canvas.md`
