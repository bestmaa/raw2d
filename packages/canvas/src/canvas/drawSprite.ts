import { applyObjectTransform } from "./applyObjectTransform.js";
import type { DrawSpriteOptions } from "./drawSprite.type.js";

export function drawSprite(options: DrawSpriteOptions): void {
  const { context, sprite } = options;

  context.save();
  applyObjectTransform({ context, object: sprite });
  context.globalAlpha *= sprite.opacity;
  context.drawImage(sprite.texture.source, 0, 0, sprite.width, sprite.height);
  context.restore();
}
