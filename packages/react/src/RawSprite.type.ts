import type { Texture, TextureFrame } from "raw2d";
import type { RawObject2DProps } from "./RawObject2DProps.type.js";

export interface RawSpriteProps extends RawObject2DProps {
  readonly texture: Texture;
  readonly frame?: TextureFrame | null;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}
