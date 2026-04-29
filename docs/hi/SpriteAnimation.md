# Sprite Animation

Sprite animation Raw2D me explicit hai. Engine hidden game loop nahi chalata. Aap `deltaSeconds` dete ho, animator sprite ka frame update karta hai, phir renderer draw karta hai.

## Animation Clip

```ts
import { SpriteAnimationClip } from "raw2d";

const idleClip = new SpriteAnimationClip({
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

## Animator

```ts
import { Sprite, SpriteAnimator } from "raw2d";

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle1"),
  x: 120,
  y: 100
});

const animator = new SpriteAnimator({
  sprite,
  clip: idleClip
});
```

## Manual Update Loop

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

## Playback Control

```ts
animator.pause();
animator.play();
animator.stop();
animator.reset();
```

## Important Notes

- Clip frames normally `TextureAtlas` se aate hain.
- Animator sirf `sprite.frame` update karta hai.
- Canvas aur WebGL dono same Sprite data ko render karte hain.
- Timing app ke control me rehti hai.

## English Reference

Detailed English version: `docs/SpriteAnimation.md`
