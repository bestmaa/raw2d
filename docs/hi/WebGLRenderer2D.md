# WebGLRenderer2D

WebGLRenderer2D Raw2D ka performance renderer hai. Iska target ye hai ki scene ko explicit pipeline se draw kiya jaye:

```text
Scene -> RenderPipeline -> Batches -> Buffers -> DrawCalls
```

Canvas renderer simple aur reference path hai. WebGL renderer batch-first path hai, jahan many objects ko kam draw calls me draw karne ki koshish hoti hai.

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

## Stats Dekhna

```ts
renderer.render(scene, camera);

const stats = renderer.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.batches);
console.log(stats.textureBinds);
console.log(stats.shapePathUnsupportedFills);
console.log(stats.renderList.culled);
```

Stats se pata chalta hai ki WebGL batching sach me kaam kar rahi hai ya nahi.

`shapePathUnsupportedFills` batata hai ki kitne ShapePath fills WebGL ne intentionally skip kiye. Agar path me multiple subpaths, hole-style fill, degenerate polygon, ya self-intersection hai to WebGL galat draw karne ke bajay is count ko badhata hai. Stroke enabled ho to stroke phir bhi render ho sakta hai.

`objects` accepted render-list item count hai. `stats.renderList.total`, `accepted`, aur `culled` se pata chalta hai ki batching se pehle pipeline ne kya skip kiya.

## Culling Aur Render List

Offscreen objects ko WebGL batch me aane se pehle skip karna ho to culling on karo:

```ts
renderer.render(scene, camera, { culling: true });
console.log(renderer.getStats().renderList.culled);
```

Same prepared list ko inspect aur render dono karna ho:

```ts
const renderList = renderer.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());
renderer.render(scene, camera, { renderList });
```

## ShapePath Fill Fallback

Default mode `"skip"` hai. Matlab unsupported ShapePath fill skip hoga aur stats me count badhega.

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "skip"
});
```

Development me warning chahiye ho to `"warn"` use karo:

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "warn",
  onShapePathFillFallback: (fallback) => {
    console.warn(fallback.objectId, fallback.reason);
  }
});
```

Abhi modes:

- `skip`: fill skip karo aur stats me count do
- `warn`: fill skip karo, saath me callback ya console warning do

## Sprite Aur Texture

Same texture wale consecutive sprites ek texture batch me aa sakte hain.

```ts
const sprite = new Sprite({
  texture,
  x: 80,
  y: 60,
  width: 64,
  height: 64
});

scene.add(sprite);
renderer.render(scene, camera);
```

Raw2D scene order ko silently reorder nahi karta. Predictable render order performance se zyada important hai.

## Static Render Mode

Static objects baar-baar change nahi hote, to WebGL unke buffers cache kar sakta hai.

```ts
background.setRenderMode("static");

renderer.render(scene, camera);
renderer.render(scene, camera);

console.log(renderer.getStats().staticCacheHits);
```

## Important Notes

- WebGLRenderer2D Canvas ka replacement nahi, performance path hai.
- Shapes, sprites, text, atlas, static cache, ShapePath fill safety, aur buffer reuse gradually improve ho rahe hain.
- Raw2D ka goal pipeline ko hidden magic nahi banana hai.
- Debugging ke liye stats public rakhe gaye hain.

## English Reference

Detailed English version: `docs/WebGLRenderer2D.md`
