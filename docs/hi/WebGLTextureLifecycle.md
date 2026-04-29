# WebGL Texture Lifecycle

WebGL texture GPU memory me rehti hai. JavaScript garbage collection turant GPU memory free nahi karta, isliye long-running editor ya game me cache clear aur renderer dispose ka control zaruri hai.

## Texture Cache

`WebGLRenderer2D` ek `Texture` object ko pehli baar upload karta hai, fir next frames me wahi `WebGLTexture` reuse karta hai:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().textureUploads);

renderer.render(scene, camera);
console.log(renderer.getStats().textureCacheHits);
```

## Text Texture Cache

`Text2D` WebGL me direct text draw nahi karta. Pehle text ek chhote canvas texture me rasterize hota hai, fir sprite-like texture batch me draw hota hai.

Cache key sirf visual text data par based hai:

- text
- font
- align
- baseline
- fill color

Iska matlab text ko move, rotate, ya scale karne par texture rebuild nahi hota:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().textTextureCacheMisses);

label.x += 20;
renderer.render(scene, camera);
console.log(renderer.getStats().textTextureCacheHits);
```

Text, font, align, baseline, ya fill color change karne par old text texture retire hota hai aur new texture banta hai.

## Clear Aur Dispose

Asset pack unload karte waqt cache clear kar sakte ho:

```ts
renderer.clearTextureCache();
```

Canvas ya renderer remove karte waqt dispose karo:

```ts
renderer.dispose();
```

## English Reference

Detailed English version: `docs/WebGLTextureLifecycle.md`
