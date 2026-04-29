# WebGL Performance

Ye doc batata hai ki Raw2D me WebGL renderer ko kaise measure karein. Goal ye hai ki developer ko clear dikhe ki batching, texture atlas, culling, aur static cache sach me kya kar rahe hain.

## Stats Ka Meaning

- `objects`: culling/filter ke baad render hone wale objects
- `renderList.total`: scene me check kiye gaye candidate objects
- `renderList.culled`: camera view ke bahar hone ki wajah se skip hue objects
- `batches`: compatible objects ke groups
- `drawCalls`: WebGL ko bheje gaye actual draw ranges
- `textureBinds`: texture switch kitni baar hua
- `staticCacheHits`: static geometry cache se reuse hui
- `uploadedBytes`: is frame me GPU ko bheja gaya vertex data

## Culling Example

Culling on karne par camera ke bahar wale objects batcher tak nahi jate:

```ts
renderer.render(scene, camera, { culling: true });

const stats = renderer.getStats();

console.log(stats.renderList.total);
console.log(stats.renderList.culled);
console.log(stats.objects);
```

Debug karte waqt agar object missing lag raha ho to culling off karke compare karein:

```ts
renderer.render(scene, camera, { culling: false });
```

## Canvas vs WebGL

Canvas stable reference renderer hai. WebGL ka goal large scenes me batching, atlas, aur cache ka benefit dena hai:

```ts
const canvasStart = performance.now();
canvasRenderer.render(scene, camera, { culling: true });
const canvasFrameMs = performance.now() - canvasStart;

renderer.render(scene, camera, { culling: true });
const webglStart = performance.now();
renderer.render(scene, camera, { culling: true });
const webglFrameMs = performance.now() - webglStart;

console.log({ canvasFrameMs, webglFrameMs, stats: renderer.getStats() });
```

## Practical Notes

- Packed atlas use karne se `textureBinds` kam hone chahiye.
- Static objects repeat render me `staticCacheHits` badhate hain.
- Moving objects ko `dynamic` rakhein.
- Browser timing approximate hota hai; same page me relative comparison ke liye use karein.

## English Reference

Detailed English version: `docs/WebGLPerformance.md`
