# raw2d-core

Core scene graph, geometry, materials, camera, transform, bounds, hit testing, culling, and render-pipeline primitives for Raw2D.

Use this package when you want the data layer without choosing a renderer.

```bash
npm install raw2d-core
```

```ts
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";

const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
```

For app-level code, `raw2d` re-exports the stable public API. Use focused packages like this one for bundle control, engine-builder tools, and explicit module boundaries.
