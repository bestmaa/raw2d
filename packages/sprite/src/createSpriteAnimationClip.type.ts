import type { SpriteAnimationClipOptions } from "./SpriteAnimationClip.type.js";
import type { TextureAtlas } from "./TextureAtlas.js";

export interface CreateSpriteAnimationClipOptions extends Omit<SpriteAnimationClipOptions, "frames"> {
  readonly atlas: TextureAtlas;
  readonly frameNames: readonly string[];
}
