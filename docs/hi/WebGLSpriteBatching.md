# WebGL Sprite Batching

WebGL sirf consecutive compatible sprites ko batch kar sakta hai. Raw2D scene ko secretly reorder nahi karta, kyunki usse visual order change ho sakta hai.

Ye strategy tab use karein jab sprite layer reorder karna safe ho, jaise tile maps, background decoration, particles, ya non-overlapping icon grids.

## Problem

Alternating textures zyada texture binds banate hain:

```ts
const sprites = [
  new Sprite({ texture: grassTexture }),
  new Sprite({ texture: stoneTexture }),
  new Sprite({ texture: grassTexture }),
  new Sprite({ texture: stoneTexture })
];
```

Yahaan texture har sprite par change ho raha hai, isliye texture groups badh sakte hain.

## Atlas Pehle Prefer Karein

Usually best fix atlas hota hai:

```ts
const atlas = new TextureAtlasPacker().pack([
  { name: "grass", source: grassImage },
  { name: "stone", source: stoneImage }
]);

const grass = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("grass") });
const stone = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("stone") });
```

Dono sprites same `Texture` share karte hain, isliye consecutive atlas sprites ek texture batch me reh sakte hain.

## Safe Sprite Layer Sort Karein

Jab layer reorder karna safe ho, tab `sortWebGLSpritesForBatching()` use karein:

```ts
import { sortWebGLSpritesForBatching } from "raw2d";

const sortedSprites = sortWebGLSpritesForBatching({
  sprites
});

for (const sprite of sortedSprites) {
  scene.add(sprite);
}
```

Helper naya array return karta hai. Input mutate nahi hota.

Sorting order:

- `zIndex`
- `renderMode`
- texture key
- same keys par original order

## Texture Binds Estimate Karein

Render se pehle order compare karne ke liye `estimateWebGLSpriteTextureBinds()` use karein:

```ts
import {
  estimateWebGLSpriteTextureBinds,
  sortWebGLSpritesForBatching
} from "raw2d";

const before = estimateWebGLSpriteTextureBinds({ sprites });
const sorted = sortWebGLSpritesForBatching({ sprites });
const after = estimateWebGLSpriteTextureBinds({ sprites: sorted });

console.log({ before, after });
```

Final truth renderer stats hi hain:

```ts
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureBinds);
```

## Visual Order Warning

Overlapping gameplay sprites ko sort na karein jab tak visual order change hona allowed na ho.

Strict draw order ke liye `zIndex` aur insertion order use karein. Performance-heavy background layers me sprites ko scene me add karne se pehle sort karna better hai.

