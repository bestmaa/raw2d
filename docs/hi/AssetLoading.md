# Asset Loading

Raw2D me image loading explicit rakha gaya hai. Sprite package browser image sources load karta hai, unhe `Texture` me wrap karta hai, aur drawing ka kaam Canvas ya WebGL renderer karta hai.

Image, sprite, atlas, ya sprite animation use karni ho to ye flow follow karein.

## TextureLoader

`TextureLoader` URL se image load karke `Texture` deta hai:

```ts
import { TextureLoader } from "raw2d";

const texture = await new TextureLoader({
  cache: true,
  crossOrigin: "anonymous"
}).load("/sprites/player.png");
```

`cache: true` same URL aur same cross-origin ke liye same loading promise reuse karta hai. Load fail ho jaye to cache entry remove ho jati hai, isliye retry possible rehta hai.

## Sprite Render Karna

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement });
const scene = new Scene();
const camera = new Camera2D();

const texture = await new TextureLoader({ cache: true }).load("/sprites/player.png");

scene.add(new Sprite({
  texture,
  x: 120,
  y: 80,
  origin: "center"
}));

renderer.render(scene, camera);
```

Same `Texture` Canvas aur WebGL dono me kaam karta hai. Renderer decide karta hai ki usko draw ya upload kaise karna hai.

## Existing Source Se Texture

Jab aapke paas pehle se canvas, image, ya bitmap source ho, tab `fromSource()` use karein:

```ts
const texture = new TextureLoader().fromSource(canvasSource, {
  id: "generated-minimap",
  url: "memory://minimap"
});
```

Supported sources normal `CanvasImageSource` values hain, jaise `HTMLImageElement`, `HTMLCanvasElement`, `ImageBitmap`, `OffscreenCanvas`, aur video-like sources.

## ImageBitmap Mode

Browser se loaded image ko pehle `ImageBitmap` me convert karna ho to `imageBitmap: true` use karein:

```ts
const texture = await new TextureLoader({
  imageBitmap: true,
  imageBitmapOptions: { premultiplyAlpha: "premultiply" }
}).load("/sprites/player.png");
```

Kuch browsers me ye upload path help kar sakta hai. Isko optional rakhein kyunki runtime support alag ho sakta hai.

## Cache Lifecycle

```ts
const loader = new TextureLoader({ cache: true });

const first = await loader.load("/sprites/player.png");
const second = await loader.load("/sprites/player.png");

console.log(first === second);
// true

loader.deleteFromCache("/sprites/player.png");
loader.clearCache();
loader.dispose();
```

TextureLoader cache load promises store karta hai. Ye WebGL GPU textures delete nahi karta. GPU cleanup ke liye `webglRenderer.clearTextureCache()` ya renderer `dispose()` use karein.

## Texture Lifecycle

```ts
const texture = await new TextureLoader().load("/sprites/player.png");

console.log(texture.getSnapshot());
console.log(texture.getStatus());

texture.dispose();
```

`Texture.dispose()` texture ko disposed mark karta hai aur `ImageBitmap` jaise closeable source par `close()` call karta hai. Jab Sprite ko texture chahiye ho, tab us texture ko dispose na karein.

## TextureAtlasLoader

Atlas JSON format:

```json
{
  "image": "player.png",
  "frames": {
    "idle1": { "x": 0, "y": 0, "width": 32, "height": 32 },
    "idle2": { "x": 32, "y": 0, "width": 32, "height": 32 }
  }
}
```

Load karna:

```ts
import { TextureAtlasLoader } from "raw2d";

const atlas = await new TextureAtlasLoader({
  cache: true
}).load("/sprites/player.atlas.json");
```

Atlas JSON ka `image` path JSON file ke location se resolve hota hai.

## Animation Clip From Names

```ts
import { createSpriteAnimationClip } from "raw2d";

const idleClip = createSpriteAnimationClip({
  atlas,
  frameNames: ["idle1", "idle2"],
  fps: 12,
  loop: true,
  name: "idle"
});
```

Isse animation code readable rehta hai, kyunki clip frame names use karta hai, copied rectangles nahi.

## English Reference

Detailed English version: `docs/AssetLoading.md`
