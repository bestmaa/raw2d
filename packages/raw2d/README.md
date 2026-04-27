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

Install focused packages when you want tighter bundle control:

```sh
npm install raw2d-core raw2d-canvas raw2d-sprite
```

Use the CDN build without a bundler:

```html
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.1.1/dist/raw2d.umd.cjs"></script>
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

Load and render a sprite:

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/sprite.png");

scene.add(new Sprite({ x: 120, y: 80, texture, origin: "center", width: 128, height: 128 }));
rawCanvas.render(scene, camera);
```

Use `origin` to control where x/y and rotation attach to an object:

```ts
sprite.setOrigin("center");
```

Use bounds helpers for selection, hit testing, culling, and future resize controls:

```ts
import { getSpriteWorldBounds } from "raw2d";

const bounds = getSpriteWorldBounds(sprite);
```

Canvas works first. WebGL2 is intentionally a skeleton while the batch-first pipeline is designed.

Canvas and WebGL are public renderer packages:

```ts
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

Use `Canvas` for production rendering today. `WebGLRenderer2D` is public but not render-ready yet.
