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
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.2.0/dist/raw2d.umd.cjs"></script>
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

Use `TextureAtlasPacker` when separate sprite sources should share one atlas texture:

```ts
const atlas = new TextureAtlasPacker({
  padding: 2,
  maxWidth: 1024,
  powerOfTwo: true
}).pack([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage }
]);

scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle") }));
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run") }));
```

In WebGL, this helps consecutive sprites stay in one texture batch.

WebGL texture stats make the difference visible:

```ts
raw2dWebGL.render(scene, camera);
console.log(raw2dWebGL.getStats().textureBinds);
console.log(raw2dWebGL.getStats().textureUploads);
```

For performance checks, render a static scene twice and inspect WebGL stats:

```ts
raw2dWebGL.render(scene, camera);
raw2dWebGL.render(scene, camera);

console.log(raw2dWebGL.getStats().staticCacheHits);
console.log(raw2dWebGL.getStats().uploadedBytes);
```

For quick Canvas vs WebGL timing, measure only the render call and average several frames:

```ts
const start = performance.now();
raw2dWebGL.render(scene, camera);
const frameMs = performance.now() - start;

console.log({ frameMs, fps: 1000 / frameMs });
```

Browser timing is approximate. Use it for same-page comparisons, then profile deeper with browser performance tools.

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

Use `renderMode` to give WebGL a low-level performance hint:

```ts
background.setRenderMode("static");
player.setRenderMode("dynamic");
tileSprite.setRenderMode("static");
animatedSprite.setRenderMode("dynamic");
```

Static and dynamic WebGL runs are separated in stats. Clean static WebGL runs are cached after the first upload and reported through `staticCacheHits` and `staticCacheMisses`.

Objects and materials track dirty versions for renderer caches:

```ts
rect.markClean();
rect.setSize(240, 120);
rect.material.setFillColor("#35c2ff");

console.log(rect.getDirtyState());
console.log(rect.material.getDirtyState());
```

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

WebGLRenderer2D currently batches `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, convex `Polygon`, `Sprite`, and rasterized `Text2D` objects through ordered WebGL runs:

```ts
import { Camera2D, Circle, Line, Rect, Scene, Sprite, Text2D, Texture, WebGLRenderer2D } from "raw2d";

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
scene.add(new Text2D({ x: 40, y: 130, text: "Raw2D", font: "28px sans-serif" }));

raw2dWebGL.render(scene, camera);
console.log(raw2dWebGL.getStats());
```

Canvas is still the complete renderer. WebGL is the performance path being built around explicit batches and stats. Consecutive shapes with the same material key are merged into shape draw ranges, and consecutive Sprites or rasterized Text2D textures are merged into texture draw ranges. `TextureAtlas` lets Sprites use named frames from one Texture, which is the base for larger sprite batches. WebGL batches reuse CPU float buffers and GPU buffer capacity so later frames can upload with `bufferSubData` when capacity already fits. Static runs can skip vertex upload entirely when their cache key is unchanged. Polygon batching uses a simple triangle fan first, so convex polygons are the safe target.

For long-running apps, clear or dispose WebGL resources explicitly:

```ts
raw2dWebGL.clearTextureCache();
raw2dWebGL.dispose();
```

Use `clearTextureCache()` when assets unload but the renderer stays alive. Use `dispose()` when the canvas is removed. This releases cached textures, rasterized text textures, buffers, and shader programs.

Raw2D also listens for WebGL context loss. While the browser context is lost, `raw2dWebGL.render()` skips GPU work. After context restore, shader programs, buffers, static caches, and texture caches are recreated automatically:

```ts
if (!raw2dWebGL.isContextLost()) {
  raw2dWebGL.render(scene, camera);
}
```

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

Asset loading keeps the same explicit model:

```ts
const atlas = await new TextureAtlasLoader({ cache: true }).load("/sprites/player.atlas.json");
const clip = createSpriteAnimationClip({
  atlas,
  frameNames: ["idle1", "idle2"],
  fps: 12
});
```

WebGL batch writers can reuse typed arrays through `WebGLFloatBuffer`, and `WebGLRenderer2D` uses that internally to reduce per-frame allocation pressure.

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

`WebGLRenderer2D` is also public. It batches supported primitives, Sprites, and rasterized Text2D through WebGL2:

```ts
import { WebGLRenderer2D } from "raw2d-webgl";

const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());
```

Use Canvas for full object support today. Use WebGLRenderer2D when supported objects can benefit from explicit batches, texture reuse, and static render runs.

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
