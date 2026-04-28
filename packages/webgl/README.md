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
- sprite frame UVs from `TextureAtlas`
- texture upload cache
- reusable CPU-side float buffers
- reusable GPU buffer upload capacity
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

SVG texture sources should be rasterized to canvas before upload. Automatic atlas packing and static/dynamic batches are future steps.

`WebGLRenderer2D` already uses `WebGLFloatBuffer` internally for shape and sprite batch data. Custom batch code can pass a `floatBuffer` option to `createWebGLShapeBatch` or `createWebGLSpriteBatch`.

It also uses `WebGLBufferUploader` internally. The first frame that needs more GPU capacity uses `bufferData`; later frames that fit the same capacity use `bufferSubData`.
