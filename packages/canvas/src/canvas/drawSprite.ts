import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawSpriteOptions } from "./drawSprite.type.js";

export function drawSprite(options: DrawSpriteOptions): void {
  const { context, sprite } = options;

  if (sprite.texture.isDisposed()) {
    return;
  }

  context.save();
  applyObjectTransform({ context, object: sprite });
  applyOriginOffset({ context, object: sprite, localX: 0, localY: 0, width: sprite.width, height: sprite.height });
  context.globalAlpha *= sprite.opacity;

  if (sprite.frame) {
    context.drawImage(
      sprite.texture.source,
      sprite.frame.x,
      sprite.frame.y,
      sprite.frame.width,
      sprite.frame.height,
      0,
      0,
      sprite.width,
      sprite.height
    );
  } else {
    context.drawImage(sprite.texture.source, 0, 0, sprite.width, sprite.height);
  }

  context.restore();
}
