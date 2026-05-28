import type { Texture } from "raw2d";
import type { Raw2DFiberSpriteProps } from "./Raw2DFiberProps.type.js";

export function resolveRaw2DFiberSpriteTexture(props: Raw2DFiberSpriteProps): Texture {
  if (props.texture) {
    return props.texture;
  }

  if (props.assetGroup && props.textureName) {
    return props.assetGroup.getTexture(props.textureName);
  }

  throw new Error("rawSprite requires a texture or assetGroup with textureName.");
}

export function shouldDisposeRaw2DFiberTexture(props: Raw2DFiberSpriteProps): boolean {
  return props.textureOwnership === "owned";
}
