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
console.log(stats.textTextureCacheHits);
console.log(stats.shapePathUnsupportedFills);
console.log(stats.renderList.culled);
```

Stats se pata chalta hai ki WebGL batching sach me kaam kar rahi hai ya nahi.

Text stats se pata chalta hai ki `Text2D` raster texture reuse ho raha hai ya new texture ban raha hai. `strokeColor` agar `fillColor` se alag hai to text stroke bhi texture me rasterize hota hai.

`shapePathUnsupportedFills` batata hai ki kitne ShapePath fills direct WebGL geometry se draw nahi ho sakte. `skip` aur `warn` mode me ye fills skip hote hain. `rasterize` mode me fill offscreen canvas texture me draw hota hai, phir WebGL us texture ko render karta hai. Stroke enabled ho to stroke phir bhi WebGL geometry se render ho sakta hai.

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
- `rasterize`: unsupported fill ko offscreen canvas texture me draw karke WebGL me render karo

Complex fills dikhane ke liye:

```ts
const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "rasterize"
});
```

Ye fallback explicit hai kyunki pure GPU geometry ke bajay texture upload path use hota hai. ShapePath move/rotate/scale karne par cached texture reuse hota hai.

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

## Text2D Texture Cache

`Text2D` pehle canvas texture me rasterize hota hai, fir sprite-like texture batch me draw hota hai. Move, rotate, ya scale karne par same texture reuse hota hai. Text, font, fill color, stroke color, ya line width badalne par texture rebuild hota hai.

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().textTextureCacheMisses);

label.x += 20;
renderer.render(scene, camera);
console.log(renderer.getStats().textTextureCacheHits);
```

Stroke tab draw hota hai jab `strokeColor` aur `fillColor` alag ho.

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
