import { SpriteAnimationClip } from "./SpriteAnimationClip.js";
import type { CreateSpriteAnimationClipOptions } from "./createSpriteAnimationClip.type.js";

export function createSpriteAnimationClip(options: CreateSpriteAnimationClipOptions): SpriteAnimationClip {
  return new SpriteAnimationClip({
    name: options.name,
    fps: options.fps,
    loop: options.loop,
    frames: options.frameNames.map((frameName) => options.atlas.getFrame(frameName))
  });
}
