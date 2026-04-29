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

`Texture.dispose()` texture ko disposed mark karta hai aur `ImageBitmap` jaise closeable source par `close()` call karta hai. Disposed Sprite textures ko Canvas aur WebGL renderer skip kar dete hain.

Jab Sprite ko texture chahiye ho, tab us texture ko dispose na karein. Pehle Sprite remove karein, texture replace karein, ya accept karein ki Sprite render nahi hoga.

## WebGL GPU Cleanup

Texture source cleanup aur GPU cleanup alag cheezein hain:

```ts
texture.dispose();                 // source lifecycle
webglRenderer.clearTextureCache(); // GPU texture lifecycle
```

Render ke time agar disposed Sprite texture milta hai to WebGL renderer uska cached GPU texture release karta hai. Pura asset pack unload karte waqt `clearTextureCache()` use karein.

## Asset Pack Cleanup Pattern

Loaded textures ko ek chhote owner me rakhein, taaki unload explicit rahe:

```ts
const loader = new TextureLoader({ cache: true });
const textures = [
  await loader.load("/sprites/player.png"),
  await loader.load("/sprites/enemy.png")
];

function unloadLevelAssets(): void {
  for (const texture of textures) {
    texture.dispose();
  }

  loader.clearCache();
  webglRenderer.clearTextureCache();
}
```

Is pattern me app asset lifetime own karta hai, aur renderer GPU resource lifetime own karta hai.

## AssetGroupLoader

Jab ek screen, level, ya document ko start hone se pehle kai textures aur atlases chahiye, tab `AssetGroupLoader` use karein:

```ts
import { AssetGroupLoader } from "raw2d";

const assets = await new AssetGroupLoader().load({
  player: "/sprites/player.png",
  enemy: { type: "texture", url: "/sprites/enemy.png" },
  playerAtlas: { type: "atlas", url: "/sprites/player.atlas.json" }
});

const playerTexture = assets.getTexture("player");
const playerAtlas = assets.getAtlas("playerAtlas");
```

String entry `{ type: "texture", url }` ka shorthand hai. Atlas entry internally `TextureAtlasLoader` use karti hai.

## Loading Progress

```ts
const assets = await new AssetGroupLoader().load(manifest, {
  onProgress: (event) => {
    const percent = Math.round((event.loaded / event.total) * 100);
    console.log(percent, event.name, event.status);
  }
});
```

Progress event me asset name, kind, loaded count, total count, aur loaded/failed status milta hai.

## Failed Assets

Default behavior me koi asset fail ho to group loader reject karta hai. Agar app ko baaki assets load karke missing assets baad me inspect karne hain, to `failFast: false` use karein:

```ts
const assets = await new AssetGroupLoader({
  failFast: false
}).load(manifest);

if (assets.hasError("player")) {
  console.error(assets.getError("player"));
}
```

Ye editor aur tools me useful hai, jahan ek optional image missing hone se pura document block nahi hona chahiye.

## AssetGroup Unload

`AssetGroup.dispose()` group ke sabhi unique textures dispose karta hai, atlas textures ke saath:

```ts
assets.dispose();
loader.clearCache();
webglRenderer.clearTextureCache();
```

Isse level, document, ya asset pack unload karne ke liye ek clear place milta hai.

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
