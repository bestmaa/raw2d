# Raw2D

Raw2D is a low-level, modular, browser-first 2D rendering engine for TypeScript.

Public documentation:

```text
https://raw2d.com/doc
```

It is designed around explicit control and readable internals:

- `raw2d-core` for scene graph, objects, camera, and materials.
- `raw2d-canvas` for the working Canvas renderer.
- `raw2d-webgl` for the batch-first WebGL2 renderer.
- `raw2d-text`, `raw2d-sprite`, and `raw2d-effects` for focused feature packages.

The umbrella `raw2d` package keeps a stable app-level runtime API. Lower-level renderer helpers stay available from focused packages such as `raw2d-webgl` and `raw2d-canvas`.

The umbrella runtime export surface is audited by tests. App code should import common objects, materials, renderers, textures, and interaction controllers from `raw2d`; renderer internals should be imported from focused packages only when building engine-level tools.

Pipeline architecture is intentionally explicit:

```text
Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall
```

Use `renderer.createRenderList(...)`, `renderer.getStats()`, and `renderer.getDiagnostics()` when building debugging tools or comparing Canvas and WebGL behavior.

Use `CanvasRenderer` when you want explicit renderer naming next to `WebGLRenderer2D`. The shorter `Canvas` name remains available for existing examples and compatibility.

Raw2D treats documented exports, constructor option names, and renderer lifecycle methods as stable public API. Deprecations should add a compatibility alias first, then update docs, examples, and tests before any removal.

Install the umbrella package when you want the stable public API:

```sh
npm install raw2d
```

Install focused packages when you want tighter bundle control:

```sh
npm install raw2d-core raw2d-canvas raw2d-sprite
```

Use the CDN build without a bundler:

```html
<script src="https://cdn.jsdelivr.net/npm/raw2d@0.9.8/dist/raw2d.umd.cjs"></script>
```

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 100,
  y: 100,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#ff0000" })
});

scene.add(rect);
raw2dCanvas.render(scene, camera);
```

Load and render a sprite:

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/sprite.png");

scene.add(new Sprite({ x: 120, y: 80, texture, origin: "center", width: 128, height: 128 }));
raw2dCanvas.render(scene, camera);
```

Pack separate sprite sources into one atlas texture:

```ts
import { Sprite, TextureAtlasPacker } from "raw2d";

const result = new TextureAtlasPacker({ padding: 2, sort: "area" }).packWithStats([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage }
]);
const atlas = result.atlas;

scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle") }));
```

Run repository examples when checking package usage:

```text
examples/canvas-basic/
examples/webgl-basic/
examples/sprite-atlas/
examples/interaction-basic/
examples/text-basic/
```

Use `origin` to control where x/y and rotation attach to an object:

```ts
sprite.setOrigin("center");
```

Use bounds helpers for selection, hit testing, culling, and future resize controls:

```ts
import { getSpriteWorldBounds } from "raw2d";

const bounds = getSpriteWorldBounds(sprite);
```

Use the render pipeline when you want to inspect or reuse prepared draw work:

```ts
const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());
raw2dCanvas.render(scene, camera, { renderList });
```

Object transforms use cached matrices internally:

```ts
rect.updateMatrix();
const localMatrix = rect.getLocalMatrix();
```

Use `renderMode` as a low-level WebGL performance hint:

```ts
background.setRenderMode("static");
player.setRenderMode("dynamic");
```

Objects and materials expose dirty versions for renderer caches:

```ts
rect.markClean();
rect.setSize(160, 100);
rect.material.setFillColor("#35c2ff");

console.log(rect.getDirtyState());
console.log(rect.material.getDirtyState());
```

Canvas works first. WebGL2 now batches `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, simple `Polygon`, `Sprite`, and rasterized `Text2D` objects. `TextureAtlas` stores named Sprite frames inside one Texture for Canvas source rectangles and WebGL UVs. `TextureAtlasPacker` can build that atlas texture from separate sources and report packing occupancy.

`SpriteAnimationClip` and `SpriteAnimator` provide explicit atlas-frame animation. Your app calls `animator.update(deltaSeconds)`, then renders with Canvas or WebGL.

`TextureAtlasLoader` can load simple atlas JSON files and `createSpriteAnimationClip` can build clips from frame names.

Canvas and WebGL are public renderer packages:

```ts
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

Use `Canvas` for full object support today. Use `WebGLRenderer2D` for shape, Sprite, and rasterized Text2D WebGL experiments:

```ts
const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());
```

For performance checks, render static scenes twice and compare atlas stats:

```ts
webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats().textureBinds);
console.log(webglRenderer.getStats().staticCacheHits);
```

For quick frame timing, keep app logic outside the measured block:

```ts
const start = performance.now();
webglRenderer.render(scene, camera);
const frameMs = performance.now() - start;

console.log({ frameMs, fps: 1000 / frameMs });
```

Treat browser timing as approximate. It is useful for relative Canvas/WebGL checks in one page, not as a final benchmark.

The WebGL stats show how much work went into the current frame:

```ts
// { objects, batches, textures, textureBinds, textureUploads, textureCacheHits, drawCalls }
console.log(webglRenderer.getStats());
```

WebGL keeps render order stable. It merges only consecutive shapes with the same material key and consecutive Sprites with the same Texture. Clean static render runs are cached after their first upload, and dynamic runs keep using the dynamic upload path.

`Text2D` works in WebGL by rasterizing text into a small texture. Updating text, font, or fill color rebuilds that texture, then the renderer draws it through the same ordered texture path as Sprites.

Check the live docs after deployment:

```text
https://raw2d.com/doc
```

## License

Raw2D is licensed under Apache-2.0.

```text
Copyright 2026 Aditya Nandlal
```

Redistributions must keep the included `LICENSE` and `NOTICE` files.
