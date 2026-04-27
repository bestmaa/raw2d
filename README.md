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
Scene -> Batcher -> Buffer -> Shader -> DrawCall
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
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.1.2/dist/raw2d.umd.cjs"></script>
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

`WebGLRenderer2D` is also public, but it is a skeleton right now. It exists so Raw2D can grow a transparent, batch-first WebGL2 pipeline without mixing WebGL code into Canvas modules:

```ts
import { WebGLRenderer2D } from "raw2d-webgl";
```

Use Canvas for real rendering today. Use WebGLRenderer2D only for early integration experiments until the batcher, buffers, shaders, and draw calls are implemented.

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
