# raw2d-sprite

Sprite and texture package for Raw2D.

This package contains data objects only:

- `Texture`
- `TextureLoader`
- `TextureAtlasLoader`
- `TextureAtlas`
- `TextureAtlasPacker`
- `SpriteAnimationClip`
- `SpriteAnimator`
- `Sprite`
- Sprite bounds helpers

Rendering stays in `raw2d-canvas` and `raw2d-webgl`.

## TextureAtlas

`TextureAtlas` stores named rectangles inside one `Texture`.

```ts
import { Sprite, Texture, TextureAtlas } from "raw2d-sprite";

const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

const atlas = new TextureAtlas({
  texture,
  frames: {
    idle: { x: 0, y: 0, width: 32, height: 32 },
    run: { x: 32, y: 0, width: 32, height: 32 }
  }
});

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle")
});
```

The atlas is intentionally simple and explicit. It gives Canvas a source rectangle and gives WebGL frame UVs for larger sprite batches.

## TextureAtlasPacker

`TextureAtlasPacker` turns separate image-like sources into one generated canvas texture and a `TextureAtlas`.

```ts
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";

const atlas = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 1024,
  maxHeight: 1024,
  powerOfTwo: true
}).pack([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage }
]);

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle")
});
```

Packed sprites share one `atlas.texture`, so consecutive WebGL Sprites can stay in one texture batch.

`edgeBleed` copies sprite edge pixels into the padding around each frame. This helps reduce WebGL filtering seams without changing frame UVs.

## Asset Loading

```ts
import { Sprite, TextureLoader } from "raw2d-sprite";

const texture = await new TextureLoader({
  cache: true,
  crossOrigin: "anonymous"
}).load("/sprites/player.png");

const sprite = new Sprite({
  texture,
  origin: "center"
});
```

Use `fromSource()` when a canvas, image, or bitmap already exists:

```ts
const texture = new TextureLoader().fromSource(canvasSource, {
  id: "generated-minimap",
  url: "memory://minimap"
});
```

Loader cache stores URL load promises. Use `clearCache()` for loader cache and renderer disposal APIs for GPU resources.

```ts
import { TextureAtlasLoader, createSpriteAnimationClip } from "raw2d-sprite";

const atlas = await new TextureAtlasLoader({
  cache: true
}).load("/sprites/player.atlas.json");

const idleClip = createSpriteAnimationClip({
  atlas,
  frameNames: ["idle1", "idle2"],
  fps: 12,
  loop: true
});
```

Atlas JSON uses one image path and named frame rectangles:

```json
{
  "image": "player.png",
  "frames": {
    "idle1": { "x": 0, "y": 0, "width": 32, "height": 32 }
  }
}
```

## Sprite Animation

Animation is explicit. The animator changes `sprite.frame` only when you call `update(deltaSeconds)`.

```ts
import { SpriteAnimationClip, SpriteAnimator } from "raw2d-sprite";

const clip = new SpriteAnimationClip({
  frames: [atlas.getFrame("idle1"), atlas.getFrame("idle2")],
  fps: 12,
  loop: true
});

const animator = new SpriteAnimator({ sprite, clip });

animator.update(deltaSeconds);
```

The renderer is not involved in animation state. Canvas and WebGL draw whichever frame the Sprite currently stores.
