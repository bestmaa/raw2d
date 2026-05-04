# Canvas

`Canvas` is Raw2D's complete reference renderer.

It wraps a browser `HTMLCanvasElement`, manages the 2D context, handles logical sizing, clears the surface, and renders supported scene objects with a `Camera2D`.

Objects do not contain Canvas drawing logic. `Canvas` owns drawing for the Canvas path.

Detailed API reference:

- `Canvas-api.md`
- `Canvas-objects.md`
- `BasicMaterial.md`
- `GettingStarted.md`

## Import

```ts
import { Canvas } from "raw2d";
```

Focused package import:

```ts
import { Canvas } from "raw2d-canvas";
```

## Create A Canvas Element

```html
<canvas id="raw2d-canvas"></canvas>
```

```ts
const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}
```

## Render A Scene

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const raw2dCanvas = new Canvas({
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

raw2dCanvas.render(scene, camera);
```

## Smallest Working Scene

This is the smallest useful Canvas-first scene. It has one renderer, one scene, one camera, one object, and one render call.

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

`render(scene, camera)` clears the canvas, traverses the scene, applies camera and object transforms, then draws supported objects.

## Animation Loop

```ts
function animate(): void {
  raw2dCanvas.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```

Raw2D does not create a hidden loop. The app controls timing.

## Fullscreen Usage

```ts
const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});

function resizeCanvas(): void {
  raw2dCanvas.setSize(window.innerWidth, window.innerHeight);
  raw2dCanvas.render(scene, camera);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
```

## What Canvas Does

- stores the original canvas element
- creates a `CanvasRenderingContext2D`
- stores logical width, height, and pixel ratio
- sets backing buffer size and CSS size
- clears the full canvas
- builds or accepts a render list
- draws supported scene objects
- exposes renderer stats
- implements the shared `Renderer2DLike` contract

## What Canvas Does Not Do

- it does not own scene data
- it does not hide an animation loop
- it does not load assets by itself
- it does not contain WebGL drawing logic
- it does not mutate object transforms during render

## Canvas And WebGL

Canvas is the complete reference renderer. WebGLRenderer2D is the batch-first performance renderer.

Use Canvas first when building new object behavior. Add WebGL support after Canvas behavior is clear.

## Current Source Files

```text
packages/canvas/src/Canvas.ts
packages/canvas/src/Canvas.type.ts
packages/canvas/src/index.ts
```
