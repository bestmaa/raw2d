# WebGLRenderer2D

`WebGLRenderer2D` is the first WebGL2 renderer path for Raw2D.

Current scope:

- renders `Rect`
- uses `RenderPipeline`
- uses cached world matrices
- batches all visible rects into one dynamic vertex buffer
- draws the rect batch with one WebGL draw call
- reports render stats

It does not render Circle, Line, Text2D, Sprite, or paths yet. Unsupported objects are counted in stats so tooling can see what WebGL skipped.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Rect, Scene, WebGLRenderer2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 100,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);
```

## Stats

```ts
renderer.render(scene, camera);

console.log(renderer.getStats());
```

Example:

```ts
{
  objects: 1000,
  rects: 1000,
  vertices: 6000,
  drawCalls: 1,
  unsupported: 0
}
```

`drawCalls: 1` means all rects were written into one buffer and drawn together.

## Canvas Vs WebGL

Canvas is simpler and supports more Raw2D objects today:

```ts
import { Canvas } from "raw2d";

const canvasRenderer = new Canvas({ canvas: canvasElement });
canvasRenderer.render(scene, camera);

console.log(canvasRenderer.getStats());
```

For 1,000 rects, Canvas stats are roughly:

```ts
{
  objects: 1000,
  drawCalls: 1000
}
```

WebGL currently supports fewer objects, but rects are batched:

```ts
const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());
```

For 1,000 rects:

```ts
{
  objects: 1000,
  rects: 1000,
  vertices: 6000,
  drawCalls: 1,
  unsupported: 0
}
```

This does not mean WebGL is always faster in every scene. It means Raw2D now has the correct path for reducing draw calls as WebGL support grows.

## Culling

Use the same culling option as Canvas:

```ts
webglRenderer.render(scene, camera, {
  culling: true
});
```

The renderer builds a `RenderList`, skips off-screen rects, writes visible rect vertices, then draws.

## Shared RenderList

You can build the list yourself:

```ts
const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

webglRenderer.render(scene, camera, { renderList });
```

This keeps the pipeline explicit and inspectable.

## Current Limitations

- Rect only.
- Fill color only.
- No texture upload yet.
- No texture atlas yet.
- No static/dynamic batch separation yet.
- No Circle, Line, Sprite, Text2D, Polygon, or ShapePath rendering yet.

Canvas is still the recommended full-feature renderer. WebGL is now the performance path being built out.

