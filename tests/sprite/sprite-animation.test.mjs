import assert from "node:assert/strict";
import test from "node:test";
import { Sprite, SpriteAnimationClip, SpriteAnimator, Texture, TextureAtlas } from "raw2d-sprite";

test("SpriteAnimationClip stores frames and timing metadata", () => {
  const clip = new SpriteAnimationClip({
    name: "idle",
    frames: [
      { x: 0, y: 0, width: 16, height: 16 },
      { x: 16, y: 0, width: 16, height: 16 }
    ],
    fps: 8,
    loop: false
  });

  assert.equal(clip.frameCount, 2);
  assert.equal(clip.duration, 0.25);
  assert.deepEqual(clip.getSnapshot(), {
    name: "idle",
    frameCount: 2,
    fps: 8,
    loop: false,
    duration: 0.25
  });
});

test("SpriteAnimator advances Sprite frames with explicit delta time", () => {
  const { atlas, sprite } = createAnimatedSprite();
  const clip = new SpriteAnimationClip({
    frames: [atlas.getFrame("a"), atlas.getFrame("b"), atlas.getFrame("c")],
    fps: 10,
    loop: true
  });
  const animator = new SpriteAnimator({ sprite, clip });

  assert.deepEqual(sprite.frame, atlas.getFrame("a"));

  animator.update(0.1);
  assert.equal(animator.getFrameIndex(), 1);
  assert.deepEqual(sprite.frame, atlas.getFrame("b"));

  animator.update(0.2);
  assert.equal(animator.getFrameIndex(), 0);
  assert.deepEqual(sprite.frame, atlas.getFrame("a"));
});

test("SpriteAnimator stops at the last frame when loop is false", () => {
  const { atlas, sprite } = createAnimatedSprite();
  const clip = new SpriteAnimationClip({
    frames: [atlas.getFrame("a"), atlas.getFrame("b")],
    fps: 4,
    loop: false
  });
  const animator = new SpriteAnimator({ sprite, clip });

  animator.update(1);

  assert.equal(animator.getFrameIndex(), 1);
  assert.equal(animator.isPlaying(), false);
  assert.deepEqual(sprite.frame, atlas.getFrame("b"));
});

test("SpriteAnimator setClip applies the first frame from the new clip", () => {
  const { atlas, sprite } = createAnimatedSprite();
  const idleClip = new SpriteAnimationClip({
    frames: [atlas.getFrame("a"), atlas.getFrame("b")],
    fps: 10
  });
  const runClip = new SpriteAnimationClip({
    frames: [atlas.getFrame("c"), atlas.getFrame("b")],
    fps: 10
  });
  const animator = new SpriteAnimator({ sprite, clip: idleClip });

  animator.setClip(runClip);

  assert.equal(animator.getFrameIndex(), 0);
  assert.deepEqual(sprite.frame, atlas.getFrame("c"));
});

function createAnimatedSprite() {
  const texture = new Texture({
    source: { width: 48, height: 16 },
    width: 48,
    height: 16
  });
  const atlas = new TextureAtlas({
    texture,
    frames: {
      a: { x: 0, y: 0, width: 16, height: 16 },
      b: { x: 16, y: 0, width: 16, height: 16 },
      c: { x: 32, y: 0, width: 16, height: 16 }
    }
  });
  const sprite = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("a") });

  return { atlas, sprite };
}
