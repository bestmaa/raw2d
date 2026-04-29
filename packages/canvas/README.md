# raw2d-canvas

Canvas renderer package for Raw2D.

Canvas is the complete reference renderer. It supports Raw2D scene traversal, transforms, visibility, culling options, sprites, text, shapes, and render stats.

```bash
npm install raw2d-canvas raw2d-core
```

```ts
import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";

const renderer = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({ width: 120, height: 80 }));
renderer.render(scene, camera);
```

For most apps, install `raw2d` first. Use `raw2d-canvas` directly when you want the renderer package without the umbrella bundle.
