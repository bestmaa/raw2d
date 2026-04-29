# Getting Started

This guide is the shortest path from install to a working Raw2D scene.

Use `raw2d` first. It is the umbrella package that re-exports the stable public API from the focused packages.

## Install

```bash
npm install raw2d
```

Advanced users can install focused packages later:

```bash
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-interaction
```

## Add A Canvas Element

```html
<canvas id="raw2d-canvas"></canvas>
```

Raw2D expects a real browser `HTMLCanvasElement`. It does not create hidden canvases for your app.

## Render Your First Object

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

## Add An Animation Loop

```ts
function animate(): void {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```

Raw2D does not start a hidden loop. Your app controls timing.

## Switch To WebGL

The same `Scene` and `Camera2D` can be rendered with WebGL when your objects are supported.

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

Canvas is the complete reference renderer. WebGL is the batch-first performance renderer.

## Next Topics

- `Canvas.md` for the Canvas renderer
- `WebGLRenderer2D.md` for the WebGL renderer
- `Scene.md` and `Camera2D.md` for the core render flow
- `Rect.md`, `Circle.md`, and `Line.md` for primitives
- `TextureAtlas.md` and `SpriteAnimation.md` for sprite workflows
- `InteractionController.md` for selection, drag, and resize
