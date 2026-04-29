# WebGL Performance

Ye doc batata hai ki Raw2D me WebGL renderer ko kaise measure karein. Goal ye hai ki developer ko clear dikhe ki batching, texture atlas, culling, aur static cache sach me kya kar rahe hain.

## Stats Ka Meaning

- `objects`: culling/filter ke baad render hone wale objects
- `renderList.total`: scene me check kiye gaye candidate objects
- `renderList.culled`: camera view ke bahar hone ki wajah se skip hue objects
- `batches`: compatible objects ke groups
- `drawCalls`: WebGL ko bheje gaye actual draw ranges
- `textureBinds`: texture switch kitni baar hua
- `textTextureCacheHits`: cached `Text2D` texture reuse hua
- `textTextureCacheMisses`: `Text2D` ke liye nayi texture entry bani
- `staticCacheHits`: static geometry cache se reuse hui
- `uploadBufferDataCalls`: full vertex-buffer uploads
- `uploadBufferSubDataCalls`: partial vertex-buffer uploads
- `uploadedBytes`: is frame me GPU ko bheja gaya vertex data

Full field reference ke liye `docs/hi/RendererStats.md` dekhein.

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

## Stats Categories

Stats ko groups me padhein, taki issue kis system me hai ye clear rahe:

```ts
renderer.render(scene, camera, { culling: true });

const stats = renderer.getStats();

console.log(stats.renderList);
console.log(stats.drawCalls, stats.batches, stats.vertices);
console.log(stats.textureBinds, stats.textureUploads);
console.log(stats.textTextureCacheHits, stats.textTextureCacheMisses);
console.log(stats.uploadBufferDataCalls, stats.uploadBufferSubDataCalls);
console.log(stats.uploadedBytes);
```

- render-list stats scene traversal samjhate hain
- batch stats draw work samjhate hain
- texture stats GPU texture work samjhate hain
- upload stats buffer churn samjhate hain

## Practical Notes

- Packed atlas use karne se `textureBinds` kam hone chahiye.
- Safe sprite layers me `sortWebGLSpritesForBatching()` se texture order group kar sakte hain.
- `analyzeWebGLSpriteBatching()` se sort karne se pehle potential bind reduction dekh sakte hain.
- Static objects repeat render me `staticCacheHits` badhate hain.
- Moving objects ko `dynamic` rakhein.
- Browser timing approximate hota hai; same page me relative comparison ke liye use karein.

## English Reference

Detailed English version: `docs/WebGLPerformance.md`
