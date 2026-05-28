import { Group2D, Sprite } from "raw2d";
import type { Raw2DFiberHostInstance } from "./Raw2DFiberHostConfig.type.js";
import { shouldDisposeRaw2DFiberTexture } from "./resolveRaw2DFiberSpriteTexture.js";

export function disposeRaw2DFiberInstance(instance: Raw2DFiberHostInstance): void {
  for (const child of instance.children) {
    disposeRaw2DFiberInstance(child);
  }

  if (instance.object instanceof Group2D) {
    instance.object.clear();
  }

  instance.children.length = 0;

  if (instance.type === "rawSprite" && instance.object instanceof Sprite && shouldDisposeRaw2DFiberTexture(instance.props)) {
    instance.object.texture.dispose();
  }
}
