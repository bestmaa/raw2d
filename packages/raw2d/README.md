# Raw2D

Raw2D is a low-level, modular, browser-first 2D rendering engine for TypeScript.

It is designed around explicit control and readable internals:

- `raw2d-core` for scene graph, objects, camera, and materials.
- `raw2d-canvas` for the working Canvas renderer.
- `raw2d-webgl` for the future batch-first WebGL2 renderer.
- `raw2d-text`, `raw2d-sprite`, and `raw2d-effects` for focused feature packages.

Install the umbrella package when you want the stable public API:

```sh
npm install raw2d
```

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 100,
  y: 100,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#ff0000" })
});

scene.add(rect);
rawCanvas.render(scene, camera);
```

Canvas works first. WebGL2 is intentionally a skeleton while the batch-first pipeline is designed.

Canvas and WebGL are public renderer packages:

```ts
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

Use `Canvas` for production rendering today. `WebGLRenderer2D` is public but not render-ready yet.
