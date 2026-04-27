import { getWorldBounds } from "raw2d-core";
import type { Rectangle } from "raw2d-core";
import type { Sprite } from "./Sprite.js";
import { getSpriteLocalBounds } from "./getSpriteLocalBounds.js";

export function getSpriteWorldBounds(sprite: Sprite): Rectangle {
  return getWorldBounds({ object: sprite, localBounds: getSpriteLocalBounds(sprite) });
}
