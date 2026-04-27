import { Rectangle } from "raw2d-core";
import type { Sprite } from "./Sprite.js";

export function getSpriteLocalBounds(sprite: Sprite): Rectangle {
  return new Rectangle({ x: 0, y: 0, width: sprite.width, height: sprite.height });
}
