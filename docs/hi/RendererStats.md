# Renderer Stats

`getStats()` last render pass ke numbers deta hai. Canvas base renderer stats deta hai, aur WebGL uske upar batching, texture, text-cache, aur upload details add karta hai.

Stats debugging aur relative comparison ke liye hain. Final profiling ke liye browser performance tools bhi use karein.

## Canvas Stats

Canvas me base fields milte hain:

```ts
raw2dCanvas.render(scene, camera, { culling: true });

const stats = raw2dCanvas.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.renderList);
```

- `objects`: visibility, filters, aur culling ke baad accepted objects
- `drawCalls`: Raw2D ke hisab se Canvas draw operations
- `renderList`: scene traversal counts

## Render List Stats

`renderList` batata hai renderer tak kya pahucha:

```ts
const stats = renderer.getStats();

console.log(stats.renderList.total);
console.log(stats.renderList.accepted);
console.log(stats.renderList.hidden);
console.log(stats.renderList.filtered);
console.log(stats.renderList.culled);
```

- `total`: check kiye gaye candidate objects
- `accepted`: render ke liye allowed objects
- `hidden`: invisible objects jo skip hue
- `filtered`: renderer filter se skip hue objects
- `culled`: camera view ke bahar wale objects

## WebGL Batch Stats

WebGL batch aur draw-call details bhi deta hai:

```ts
webglRenderer.render(scene, camera, { culling: true });

const stats = webglRenderer.getStats();

console.log(stats.batches);
console.log(stats.drawCalls);
console.log(stats.vertices);
```

- `batches`: batcher ke compatible object groups
- `drawCalls`: WebGL ko bheje gaye draw ranges
- `vertices`: frame ke liye likhe gaye vertices

Agar `drawCalls` almost `objects` jitna hai, to scene order, texture usage, aur material compatibility check karein.

## Texture Stats

Sprite-heavy scenes me texture numbers important hote hain:

```ts
const stats = webglRenderer.getStats();

console.log(stats.textures);
console.log(stats.textureBinds);
console.log(stats.textureUploads);
console.log(stats.textureCacheHits);
console.log(stats.spriteTextureBindReduction);
```

- `textures`: frame me use hui unique textures
- `textureBinds`: drawing ke time texture switches
- `textureUploads`: is frame me naye GPU texture uploads
- `textureCacheHits`: reused GPU texture records
- `spriteTextureGroups`: frame me unique Sprite texture groups
- `spriteTextureBinds`: current scene order me Sprite-only texture binds
- `sortedSpriteTextureBinds`: safe sorting ke baad estimated Sprite binds
- `spriteTextureBindReduction`: safe reorderable Sprite layers me possible bind reduction
- `skippedSpriteTextures`: disposed texture wale Sprites jo skip hue

High `textureBinds` ka matlab usually sprites atlas ya same texture ke order me grouped nahi hain.

`textureBinds` me `Text2D` texture draws bhi aa sakte hain. Sirf Sprite texture diagnosis ke liye `spriteTextureBinds` dekhein.

## Text Texture Stats

WebGL `Text2D` ko cached text textures se render karta hai:

```ts
const stats = webglRenderer.getStats();

console.log(stats.textTextures);
console.log(stats.textTextureCacheHits);
console.log(stats.textTextureCacheMisses);
console.log(stats.textTextureEvictions);
console.log(stats.retiredTextTextures);
```

- `textTextures`: is frame me use hue raster text texture records
- `textTextureCacheHits`: reused text texture entries
- `textTextureCacheMisses`: text/material style change ki wajah se naye entries
- `textTextureEvictions`: cache se remove hue old entries
- `retiredTextTextures`: cleanup ke wait me old GPU text textures

Agar misses har frame high hain, text content ya style baar-baar change ho raha hai.

## Static Cache Stats

Static batches map tiles, background sprites, aur stable decoration ke liye useful hain:

```ts
staticSprite.setRenderMode("static");

webglRenderer.render(scene, camera); // warm cache
webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();

console.log(stats.staticBatches);
console.log(stats.dynamicBatches);
console.log(stats.staticSpriteBatches);
console.log(stats.dynamicSpriteBatches);
console.log(stats.staticCacheHits);
console.log(stats.staticCacheMisses);
```

- `staticBatches`: cached static groups
- `dynamicBatches`: har frame rebuild hone wale dynamic groups
- `staticObjects`: is frame ke static objects
- `dynamicObjects`: is frame ke dynamic objects
- `staticSprites`: is frame me rendered static Sprites
- `dynamicSprites`: is frame me rendered dynamic Sprites
- `spriteBatches`: Sprite/Text2D texture pipeline ke draw batches
- `staticSpriteBatches`: static texture-pipeline batches
- `dynamicSpriteBatches`: dynamic texture-pipeline batches
- `staticCacheHits`: static runs jo rebuild ke bina reuse hue
- `staticCacheMisses`: version change ki wajah se rebuild hue static runs

## Upload Stats

Upload stats GPU buffer churn dikhate hain:

```ts
const stats = webglRenderer.getStats();

console.log(stats.uploadBufferDataCalls);
console.log(stats.uploadBufferSubDataCalls);
console.log(stats.uploadedBytes);
```

- `uploadBufferDataCalls`: full buffer uploads
- `uploadBufferSubDataCalls`: partial buffer uploads
- `uploadedBytes`: is frame GPU ko bheje gaye vertex bytes

Unchanged scene me `uploadedBytes` high rahe to objects dynamic hain ya static object mutate ho raha hai.

## Coverage Stats

Coverage stats batate hain kaun se object paths render ya skip hue:

```ts
const stats = webglRenderer.getStats();

console.log(stats.rects);
console.log(stats.sprites);
console.log(stats.shapePaths);
console.log(stats.shapePathUnsupportedFills);
console.log(stats.unsupported);
```

- shape counters batate hain har type ke kitne objects process hue
- `shapePathUnsupportedFills` un fills ko track karta hai jo direct WebGL geometry batch nahi kar paya; `rasterize` fallback unhe texture ke roop me draw kar sakta hai
- `unsupported` un objects ko track karta hai jo renderer draw nahi kar paya
