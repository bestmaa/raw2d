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

