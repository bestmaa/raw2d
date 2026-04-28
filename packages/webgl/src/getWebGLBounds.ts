import { getCoreLocalBounds, getWorldBounds, type Object2D, type RenderItem } from "raw2d-core";
import { Sprite, getSpriteLocalBounds } from "raw2d-sprite";
import { isWebGLShape } from "./getWebGLRenderRunKind.js";

export function getWebGLBounds(object: Object2D): RenderItem<Object2D>["bounds"] {
  if (isWebGLShape(object)) {
    return getWorldBounds({ object, localBounds: getCoreLocalBounds(object) });
  }

  if (object instanceof Sprite) {
    return getWorldBounds({ object, localBounds: getSpriteLocalBounds(object) });
  }

  return null;
}
