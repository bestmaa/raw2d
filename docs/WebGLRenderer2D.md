# WebGLRenderer2D

`WebGLRenderer2D` is Raw2D's WebGL2 renderer path. It is built to stay explicit: scene data enters `RenderPipeline`, the renderer creates ordered render runs, each run writes a buffer, and WebGL issues draw calls.

Current scope:

- renders `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, and convex `Polygon`
- renders `Sprite`
- uses cached world matrices from `RenderPipeline`
- batches consecutive shape objects by material key
- batches consecutive sprites by texture key
- uploads textures through a small `WebGLTextureCache`
- reports batch, texture, vertex, and draw call stats

Canvas is still the complete renderer. WebGL is the performance path being built out.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Rect, Scene, WebGLRenderer2D } from "raw2d";

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

## Sprite Usage

```ts
import { Camera2D, Scene, Sprite, Texture, WebGLRenderer2D } from "raw2d";

const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

const sprite = new Sprite({
  texture,
  x: 80,
  y: 60,
  width: 64,
  height: 64,
  opacity: 0.9
});

scene.add(sprite);
renderer.render(scene, new Camera2D());
```

Sprites with the same `Texture` object are grouped only when they are consecutive in render order. Raw2D keeps ordering predictable instead of silently reordering the scene.

## Stats

```ts
renderer.render(scene, camera);
console.log(renderer.getStats());
```

Example:

```ts
{
  objects: 500,
  rects: 100,
  circles: 80,
  ellipses: 80,
  lines: 80,
  polylines: 80,
  polygons: 40,
  sprites: 40,
  textures: 1,
  batches: 240,
  vertices: 18000,
  drawCalls: 240,
  unsupported: 0
}
```

`batches` and `drawCalls` stay separate from `objects` so you can see whether WebGL is actually reducing work.

## Ordered Runs

The renderer does not hide the pipeline too much:

```text
Scene -> RenderPipeline -> RenderList -> RenderRun -> Buffer -> Shader -> DrawCall
```

Render runs are consecutive groups:

- shape run: `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, `Polygon`
- sprite run: `Sprite`
- unsupported run: counted but skipped

This makes WebGL behavior easy to debug and prepares Raw2D for future atlas and batch systems.

## Current Limitations

- no texture atlas yet
- no typed array pool yet
- no static/dynamic batch separation yet
- no text WebGL path yet
- polygon batching expects convex polygons
- SVG texture sources should be rasterized to canvas before WebGL upload

Future work should keep the same transparent path while improving batching.
