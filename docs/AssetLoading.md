# Asset Loading

Raw2D keeps asset loading small and explicit.

The sprite package provides:

- `TextureLoader` for image files
- `TextureAtlasLoader` for JSON atlas files
- `createSpriteAnimationClip` for frame-name based clips

## TextureLoader

```ts
import { TextureLoader } from "raw2d";

const texture = await new TextureLoader({
  cache: true,
  crossOrigin: "anonymous"
}).load("/sprites/player.png");
```

`cache: true` reuses the same loading promise for the same URL and cross-origin setting.

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

Load it:

```ts
import { TextureAtlasLoader } from "raw2d";

const atlas = await new TextureAtlasLoader({
  cache: true
}).load("/sprites/player.atlas.json");
```

The `image` path is resolved from the atlas JSON file location, so `player.png` above resolves beside `player.atlas.json`.

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

This keeps docs and app code readable because animation clips can reference frame names instead of copying rectangles.

## Full Flow

```ts
const atlas = await new TextureAtlasLoader({ cache: true }).load("/sprites/player.atlas.json");

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle1")
});

const clip = createSpriteAnimationClip({
  atlas,
  frameNames: ["idle1", "idle2"],
  fps: 12
});

const animator = new SpriteAnimator({ sprite, clip });

function animate(deltaSeconds: number): void {
  animator.update(deltaSeconds);
  raw2dCanvas.render(scene, camera);
}
```

This is still low-level. Raw2D loads assets and updates frames, but the app owns the render loop.
