# Sprite Animation

Sprite animation in Raw2D is explicit and low-level.

`SpriteAnimationClip` stores frames and timing. `SpriteAnimator` applies those frames to a `Sprite` when your app calls `update(deltaSeconds)`.

Raw2D does not create a hidden game loop.

## Create Clip

```ts
import { SpriteAnimationClip } from "raw2d";

const clip = new SpriteAnimationClip({
  name: "idle",
  frames: [
    atlas.getFrame("idle1"),
    atlas.getFrame("idle2"),
    atlas.getFrame("idle3")
  ],
  fps: 12,
  loop: true
});
```

The frames usually come from `TextureAtlas`.

## Create Animator

```ts
import { Sprite, SpriteAnimator } from "raw2d";

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle1")
});

const animator = new SpriteAnimator({
  sprite,
  clip
});
```

The animator only changes `sprite.frame`. Canvas and WebGL render the new frame normally.

## Update Manually

```ts
let lastTime = performance.now();

function animate(time: number): void {
  const deltaSeconds = (time - lastTime) / 1000;
  lastTime = time;

  animator.update(deltaSeconds);
  raw2dCanvas.render(scene, camera);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

This keeps timing under your control.

## Playback Control

```ts
animator.pause();
animator.play();
animator.stop();
animator.reset();
animator.setClip(runClip);
```

For non-looping clips, the animator stops on the last frame.

## Why It Matters

This gives Raw2D a small animation layer without mixing animation into the renderer.

```text
TextureAtlas -> SpriteAnimationClip -> SpriteAnimator -> Sprite.frame -> Renderer
```

Canvas and WebGL share the same Sprite data, so animation works in both renderer paths.
