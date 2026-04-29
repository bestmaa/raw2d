# WebGL Sprite Batching

WebGL can batch only consecutive compatible sprites. Raw2D keeps this rule visible: the renderer does not secretly reorder your scene because that could change what appears on top.

Use this strategy for sprite layers where reordering is safe, such as tile maps, background decorations, particles, or non-overlapping icon grids.

## The Problem

Alternating textures create more texture binds:

```ts
const sprites = [
  new Sprite({ texture: grassTexture }),
  new Sprite({ texture: stoneTexture }),
  new Sprite({ texture: grassTexture }),
  new Sprite({ texture: stoneTexture })
];
```

This can become `4` texture groups because the texture changes every sprite.

## Prefer Atlas First

The best fix is usually an atlas:

```ts
const atlas = new TextureAtlasPacker().pack([
  { name: "grass", source: grassImage },
  { name: "stone", source: stoneImage }
]);

const grass = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("grass") });
const stone = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("stone") });
```

Both sprites now share one `Texture`, so consecutive atlas sprites can stay in one texture batch.

## Asset Pipeline To Stats

Use `AssetGroupLoader` when files should load first, then become a packed atlas:

```ts
const assets = await new AssetGroupLoader().load({
  grass: "/sprites/grass.png",
  stone: "/sprites/stone.png"
}, {
  packAtlas: { atlasName: "tiles", padding: 2, edgeBleed: 1 }
});

const atlas = assets.getAtlas("tiles");
scene.add(createSpriteFromAtlas({ atlas, frame: "grass", x: 0, y: 0 }));
scene.add(createSpriteFromAtlas({ atlas, frame: "stone", x: 32, y: 0 }));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureBinds);
// 1 when only this packed atlas texture is used
```

This keeps the pipeline explicit: load files, pack atlas, create Sprites, render, then read stats.

## Sort A Safe Sprite Layer

Use `sortWebGLSpritesForBatching()` when the layer can be reordered:

```ts
import { sortWebGLSpritesForBatching } from "raw2d";

const sortedSprites = sortWebGLSpritesForBatching({
  sprites
});

for (const sprite of sortedSprites) {
  scene.add(sprite);
}
```

The helper returns a new array. It does not mutate your input.

Sorting uses:

- `zIndex`
- `renderMode`
- texture key
- original order as a stable fallback

## Estimate Texture Binds

Use `estimateWebGLSpriteTextureBinds()` to compare order before rendering:

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

This estimate counts consecutive texture groups using the same keys the helper sorts by. The renderer stats remain the final source of truth:

```ts
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureBinds);
```

## Diagnose A Layer

Use `analyzeWebGLSpriteBatching()` when you want one report before touching scene order:

```ts
import { analyzeWebGLSpriteBatching } from "raw2d";

const report = analyzeWebGLSpriteBatching({ sprites });

console.log(report.spriteCount);
console.log(report.currentTextureBinds);
console.log(report.sortedTextureBinds);
console.log(report.potentialReduction);
console.log(report.textureGroups);
```

Important fields:

- `currentTextureBinds`: estimated texture switches in the current order
- `sortedTextureBinds`: estimated texture switches after batch-friendly sorting
- `potentialReduction`: how many binds sorting could remove
- `textureGroups`: each texture key and how many sprites use it

Use the report to decide whether sorting is worth it. If `potentialReduction` is `0`, the layer is already batch-friendly.

## Custom Texture Keys

Pass a custom key when a layer uses generated or external texture-like objects:

```ts
const sorted = sortWebGLSpritesForBatching({
  sprites,
  getTextureKey: (sprite) => sprite.texture.url ?? sprite.texture.id
});
```

## Visual Order Warning

Do not sort overlapping gameplay sprites unless the visual order is allowed to change.

For strict draw order, keep scene order explicit with `zIndex` and insertion order. For performance-heavy background layers, sort within that layer before adding it to the scene.
