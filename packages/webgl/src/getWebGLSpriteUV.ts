import type { Sprite } from "raw2d-sprite";
import type { WebGLSpriteUV } from "./WebGLSpriteUV.type.js";

export function getWebGLSpriteUV(sprite: Sprite): WebGLSpriteUV {
  const textureWidth = sprite.texture.width;
  const textureHeight = sprite.texture.height;

  if (!sprite.frame || textureWidth <= 0 || textureHeight <= 0) {
    return { u0: 0, v0: 0, u1: 1, v1: 1 };
  }

  return {
    u0: sprite.frame.x / textureWidth,
    v0: sprite.frame.y / textureHeight,
    u1: (sprite.frame.x + sprite.frame.width) / textureWidth,
    v1: (sprite.frame.y + sprite.frame.height) / textureHeight
  };
}
