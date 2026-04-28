# Raw2D

Raw2D is a low-level, modular, browser-first 2D rendering engine for TypeScript.

Public documentation:

```text
https://raw2d.com/doc
```

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
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.1.5/dist/raw2d.umd.cjs"></script>
```

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
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
raw2dCanvas.render(scene, camera);
```

Load and render a sprite:

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/sprite.png");

scene.add(new Sprite({ x: 120, y: 80, texture, origin: "center", width: 128, height: 128 }));
raw2dCanvas.render(scene, camera);
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

Use the render pipeline when you want to inspect or reuse prepared draw work:

```ts
const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());
raw2dCanvas.render(scene, camera, { renderList });
```

Object transforms use cached matrices internally:

```ts
rect.updateMatrix();
const localMatrix = rect.getLocalMatrix();
```

Canvas works first. WebGL2 now batches `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, and convex `Polygon` objects.

Canvas and WebGL are public renderer packages:

```ts
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

Use `Canvas` for full object support today. Use `WebGLRenderer2D` for primitive WebGL experiments:

```ts
const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());
```

The WebGL stats show how much work went into the current batch:

```ts
// { objects, rects, circles, ellipses, lines, polylines, polygons, vertices, drawCalls, unsupported }
console.log(webglRenderer.getStats());
```

Check the live docs after deployment:

```text
https://raw2d.com/doc
```

## License

Raw2D is licensed under Apache-2.0.

```text
Copyright 2026 Aditya Nandlal
```

Redistributions must keep the included `LICENSE` and `NOTICE` files.
