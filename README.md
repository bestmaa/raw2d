# Raw2D

Raw2D is a low-level 2D rendering engine for JavaScript and TypeScript.

It is browser-first, Canvas-first, and built around small isolated classes. Objects store scene data. Renderer modules draw those objects.

## Documentation

Read the public docs at:

```text
https://raw2d.com/doc
```

Use this URL to check the live Raw2D documentation after deployments.

## Positioning

Raw2D is not trying to be another PixiJS or Phaser. Those engines already provide powerful high-level rendering and game workflows.

Raw2D focuses on a different identity: low-level, modular, transparent 2D rendering for developers who want control. The engine should keep the rendering path understandable, debuggable, and easy to learn from.

The long-term render pipeline should stay explicit:

```text
Scene -> RenderPipeline -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall
```

Performance matters, but Raw2D's main advantage should be control, modularity, and transparent internals.

## Install

Recommended:

```bash
npm install raw2d
```

Advanced focused packages:

```bash
npm install raw2d-core raw2d-canvas raw2d-sprite
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.1.5/dist/raw2d.umd.cjs"></script>
```

The UMD build exposes `Raw2D` on `window`.

```html
<script>
  const { BasicMaterial, Camera2D, Canvas, Rect, Scene } = Raw2D;
</script>
```

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(rect);
raw2dCanvas.render(scene, camera);
```

## Texture And Sprite

Use `TextureLoader` to load an image, then pass the texture into `Sprite`:

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/sprite.png");

const sprite = new Sprite({
  x: 120,
  y: 80,
  texture,
  origin: "center",
  width: 128,
  height: 128
});

scene.add(sprite);
raw2dCanvas.render(scene, camera);
```

Objects support origin keywords for placement, rotation, and scaling:

```ts
rect.setOrigin("center");
sprite.setOrigin("bottom-right");
circle.setOrigin({ x: 0.5, y: 0.5 });
```

Use bounds helpers for culling, hit testing, selection, and future transform tools:

```ts
import { getRectLocalBounds, getWorldBounds } from "raw2d";

const worldBounds = getWorldBounds({
  object: rect,
  localBounds: getRectLocalBounds(rect)
});
```

Use `zIndex` when overlapping objects need predictable draw order:

```ts
background.setZIndex(-100);
player.setZIndex(10);
uiPanel.setZIndex(100);

raw2dCanvas.render(scene, camera);
```

Canvas draws lower `zIndex` first and higher `zIndex` later.

Use `RenderPipeline` when tooling or custom renderers need to inspect prepared render work:

```ts
const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());
raw2dCanvas.render(scene, camera, { renderList });
```

The pipeline prepares visibility, culling, hierarchy, and render order before drawing.

Object transforms use cached matrices internally. You can inspect them when building tools or custom render paths:

```ts
rect.setPosition(100, 80);
rect.rotation = 0.4;

const localMatrix = rect.getLocalMatrix();
const worldMatrix = rect.getWorldMatrix();
```

RenderPipeline also stores matrix snapshots on each render item for WebGL batching.

WebGLRenderer2D currently batches `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, convex `Polygon`, and `Sprite` objects through ordered WebGL runs:

```ts
import { Camera2D, Circle, Line, Rect, Scene, Sprite, Texture, WebGLRenderer2D } from "raw2d";

const raw2dWebGL = new WebGLRenderer2D({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();
const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

scene.add(new Rect({ x: 40, y: 40, width: 80, height: 50 }));
scene.add(new Circle({ x: 160, y: 65, radius: 28 }));
scene.add(new Line({ x: 220, y: 65, startX: 0, startY: 0, endX: 80, endY: 0 }));
scene.add(new Sprite({ texture, x: 320, y: 40, width: 48, height: 48 }));

raw2dWebGL.render(scene, camera);
console.log(raw2dWebGL.getStats());
```

Canvas is still the complete renderer. WebGL is the performance path being built around explicit batches and stats. Consecutive shapes with the same material key are merged into shape draw ranges, and consecutive Sprites with the same Texture are merged into texture draw ranges. `TextureAtlas` lets Sprites use named frames from one Texture, which is the base for larger sprite batches. Polygon batching uses a simple triangle fan first, so convex polygons are the safe target.

Sprite animation is explicit and renderer-independent:

```ts
const clip = new SpriteAnimationClip({
  frames: [atlas.getFrame("idle1"), atlas.getFrame("idle2")],
  fps: 12,
  loop: true
});

const animator = new SpriteAnimator({ sprite, clip });
animator.update(deltaSeconds);
```

Use `Group2D` when several objects should move, rotate, scale, and render together:

```ts
const group = new Group2D({ x: 220, y: 140 });

group.add(rect);
group.add(circle);
scene.add(group);

raw2dCanvas.render(scene, camera);
```

## Architecture

```text
packages/
  core/      raw2d-core
  canvas/    raw2d-canvas
  webgl/     raw2d-webgl
  sprite/    raw2d-sprite
  text/      raw2d-text
  effects/   raw2d-effects
  raw2d/     umbrella package
```

Every class keeps its own `*.type.ts` file. Drawing logic stays in renderer modules, not inside objects.

The umbrella package keeps the easy import:

```ts
import { Canvas, Scene, Rect } from "raw2d";
```

Advanced users can depend on focused packages:

```ts
import { Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

## Canvas And WebGL

`Canvas` is a public renderer API, not an internal-only class. It is the recommended renderer today:

```ts
import { Canvas } from "raw2d";
```

`WebGLRenderer2D` is also public. It currently renders `Rect` through WebGL2 with one dynamic rect batch:

```ts
import { WebGLRenderer2D } from "raw2d-webgl";

const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());
```

Use Canvas for full object support today. Use WebGLRenderer2D for rect-heavy scenes and early WebGL integration while Circle, Line, Sprite, Text2D, and path batches are added.

For 1,000 rects, Canvas reports about 1,000 shape draw calls:

```ts
canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());
// { objects: 1000, drawCalls: 1000 }
```

WebGLRenderer2D writes those rects into one buffer and draws once:

```ts
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
// { objects: 1000, rects: 1000, vertices: 6000, drawCalls: 1, unsupported: 0 }
```

## Local Development

```bash
npm install
npm run dev
```

Docs run at:

```text
http://localhost:5174/doc
```

Public docs run at:

```text
https://raw2d.com/doc
```

Build and package checks:

```bash
npm run typecheck
npm run build
npm run pack:check
```

## License And Attribution

Raw2D is licensed under the Apache License 2.0.

```text
Copyright 2026 Aditya Nandlal
```

If you redistribute Raw2D or a modified version, keep the `LICENSE` and `NOTICE` files with the distribution. Do not remove the original copyright or attribution notices.

The Apache-2.0 license covers the source code. The Raw2D name and project identity are project marks; do not use them to imply that a fork, package, product, or service is the official Raw2D project unless you have permission.

## Performance Roadmap

- WebGL2 renderer
- batch rendering
- texture atlas
- object pooling
- dirty matrix updates
- culling
- typed array buffers
- static and dynamic batches

## Modular Roadmap

- core
- canvas
- webgl
- sprite
- text
- effects

## Future WebGL Plan

`Canvas` is the first working renderer path. `WebGLRenderer2D` will stay simple at first, then grow into batched geometry, shaders, texture atlas support, typed arrays, and draw call reduction.

Raw2D intentionally does not include physics, WASM, ECS, React, or external rendering libraries yet.
