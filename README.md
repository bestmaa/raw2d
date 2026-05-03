# Raw2D

Raw2D is a low-level 2D rendering engine for JavaScript and TypeScript.

It is browser-first, Canvas-first, WebGL2-ready, and built around small isolated modules. Objects store scene data and transform behavior. Renderers draw those objects.

Public docs: https://raw2d.com/doc

Markdown reference: https://raw2d.com/readme

## Why Raw2D Exists

Raw2D is not trying to replace PixiJS or Phaser. Those are powerful high-level engines.

Raw2D is for developers who want:

- explicit control over the render pipeline
- small focused classes
- readable TypeScript internals
- Canvas as the complete reference renderer
- WebGL2 batching without hiding too much
- tooling-friendly APIs for editors, visual tools, and engine experiments

The long-term pipeline should stay understandable:

```text
Scene -> RenderPipeline -> RenderRun -> Batcher -> Buffer -> DrawCall
```

Performance matters, but the project identity is control, modularity, and transparency.

## Install

Use the umbrella package first:

```bash
npm install raw2d
```

Focused packages are available for advanced users:

```bash
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-text raw2d-interaction
```

CDN usage:

```html
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.5.1/dist/raw2d.umd.cjs"></script>
<script>
  const { BasicMaterial, Camera2D, Canvas, Rect, Scene } = Raw2D;
</script>
```

## Quick Canvas Example

```html
<canvas id="raw2d-canvas"></canvas>
```

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

const rect = new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
renderer.render(scene, camera);
```

## Canvas Or WebGL

Use `Canvas` when you want the most complete and easiest renderer path.

```ts
import { Canvas } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement });
renderer.render(scene, camera);
```

Use `WebGLRenderer2D` when your scene uses supported objects and you want explicit batching, packed-atlas texture reuse, static render runs, opt-in safe sprite sorting, and performance stats.

```ts
import { WebGLRenderer2D } from "raw2d";

const renderer = new WebGLRenderer2D({ canvas: canvasElement });
renderer.render(scene, camera);

const stats = renderer.getStats();

console.log(stats.drawCalls);
console.log(stats.textureBinds);
console.log(stats.spriteTextureBindReduction);
```

Both renderers implement the shared `Renderer2DLike` contract:

```ts
import type { Renderer2DLike } from "raw2d";

function drawFrame(renderer: Renderer2DLike): void {
  renderer.render(scene, camera);
}
```

## Sprite And Texture

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/sprite.png");

scene.add(new Sprite({
  texture,
  x: 120,
  y: 80,
  width: 128,
  height: 128,
  origin: "center"
}));

renderer.render(scene, camera);
```

Use `TextureAtlas`, `TextureAtlasPacker`, `createSpriteFromAtlas`, or `AssetGroupLoader` `packAtlas` when many sprites should share one texture. In WebGL this helps reduce texture binds, and `packWithStats()` shows atlas occupancy.

## Interaction Tools

Interaction lives in focused modules, not inside the renderer.

```ts
import { InteractionController, SelectionManager } from "raw2d";

const selection = new SelectionManager();
const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  selection,
  onChange: () => renderer.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
```

## Architecture

```text
packages/
  core/         raw2d-core
  canvas/       raw2d-canvas
  webgl/        raw2d-webgl
  sprite/       raw2d-sprite
  text/         raw2d-text
  interaction/  raw2d-interaction
  effects/      raw2d-effects
  raw2d/        umbrella package
```

Rules that shape the codebase:

- TypeScript strict mode
- no external rendering library
- no React dependency in core packages
- each module keeps its own `*.type.ts`
- object classes do not contain Canvas/WebGL drawing logic
- renderers own drawing
- files stay small and focused

## Local Development

```bash
npm install
npm run dev
```

Docs run locally at:

```text
http://localhost:5174/doc
```

Examples run at `http://localhost:5174/examples/canvas-basic/` and the other `examples/*/` paths.

Quality checks:

```bash
npm test
npm run build:docs
npm run pack:check
```

## Performance Roadmap

- WebGL2 renderer
- batch rendering
- texture atlas
- object pooling
- dirty matrix updates
- culling
- typed array buffers
- static and dynamic batches

## Future Direction

Raw2D will keep Canvas and WebGL both public. Canvas stays the complete reference renderer. WebGL grows as the batch-first performance path. Future modules may include effects, tooling, and React fiber-style integration, but the low-level engine should stay independent.

Raw2D intentionally does not include physics, WASM, ECS, or external rendering libraries.

## License And Attribution

Raw2D is licensed under the Apache License 2.0.

```text
Copyright 2026 Aditya Nandlal
```

If you redistribute Raw2D or a modified version, keep the `LICENSE` and `NOTICE` files with the distribution. Do not remove the original copyright or attribution notices.

The Apache-2.0 license covers the source code. The Raw2D name and project identity are project marks; do not use them to imply that a fork, package, product, or service is the official Raw2D project unless you have permission.
