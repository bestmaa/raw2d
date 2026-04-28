# raw2d-webgl

WebGL2 renderer package for Raw2D.

This package is the batch-first renderer path. It keeps the render pipeline visible instead of hiding everything behind a black box:

```text
Scene -> RenderPipeline -> RenderRun -> Buffer -> Shader -> DrawCall
```

Current support:

- `Rect`, `Circle`, `Ellipse`, `Line`, `Polyline`, convex `Polygon`
- `Sprite`
- ordered shape material batches
- ordered sprite texture batches
- static and dynamic render run separation
- sprite frame UVs from `TextureAtlas`
- texture upload cache
- reusable CPU-side float buffers
- reusable GPU buffer upload capacity
- static batch cache for clean static runs
- render stats for objects, sprites, textures, batches, vertices, draw calls, buffer uploads, and unsupported objects

## Usage

```ts
import { Camera2D, Rect, Scene } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { WebGLRenderer2D } from "raw2d-webgl";

const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
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
scene.add(new Sprite({ texture, x: 160, y: 40, width: 64, height: 64 }));

renderer.render(scene, camera);
console.log(renderer.getStats());
```

## Notes

Sprite batching uses the same `Texture` object as the texture key. Consecutive Sprites with the same Texture are merged into one draw call, even when they use different atlas frames. Raw2D does not reorder across unrelated objects, so scene order remains predictable.

Use `TextureAtlasPacker` from `raw2d-sprite` when separate sprite images should become one atlas texture:

```ts
const atlas = new TextureAtlasPacker().pack([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage }
]);

scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle") }));
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run") }));

renderer.render(scene, camera);
console.log(renderer.getStats().textures);
// 1
```

Texture stats make this visible:

```ts
// separate textures:
// { textures: 2, textureBinds: 2, textureUploads: 2 }

// packed atlas:
// { textures: 1, textureBinds: 1, textureUploads: 1 }
```

When a texture has already been uploaded, later frames report cache reuse:

```ts
renderer.render(scene, camera);
renderer.render(scene, camera);

console.log(renderer.getStats().textureCacheHits);
```

Use `object.setRenderMode("static")` for rarely changing objects and `object.setRenderMode("dynamic")` for animated or frequently changing objects. WebGL splits render runs by mode and reports `staticBatches`, `dynamicBatches`, `staticObjects`, `dynamicObjects`, `staticCacheHits`, and `staticCacheMisses`.

Object and material versions invalidate static cached batches:

```ts
staticRect.setRenderMode("static");

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheHits);
// 1

staticRect.setSize(200, 120);

renderer.render(scene, camera);
console.log(renderer.getStats().staticCacheMisses);
// 1
```

SVG texture sources should be rasterized to canvas before upload. Automatic atlas packing and static batch compaction are future steps.

`WebGLRenderer2D` already uses `WebGLFloatBuffer` internally for shape and sprite batch data. Custom batch code can pass a `floatBuffer` option to `createWebGLShapeBatch` or `createWebGLSpriteBatch`.

It also uses `WebGLBufferUploader` internally. The first frame that needs more GPU capacity uses `bufferData`; later frames that fit the same capacity use `bufferSubData`.
