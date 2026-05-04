# Start Here

This is the shortest beginner path for Raw2D.

## What To Install First

Start with the umbrella package:

```bash
npm install raw2d
```

Focused packages are useful later, after the public API is clear.

## First Render Goal

Create a canvas, one scene, one camera, one object, and render once.

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

## Beginner Order

Use this order while learning:

1. Install / Setup
2. Canvas Init
3. Scene
4. Camera2D
5. Rect or Circle
6. Texture and Sprite
7. Canvas / WebGL
8. Interaction Path
9. React Later or MCP only if needed

## Canvas First

Canvas is the reference renderer. Use it for correctness, debugging, simple scenes, and full feature coverage.

## WebGL When Needed

WebGL is the batch-first renderer. Use it for many sprites, texture atlas scenes, and draw-call pressure.

## Next

Open `/doc#beginner-path`, then `/examples/canvas-basic/`, then `/examples/webgl-basic/`.
