import type { RawMaterialProps } from "./RawMaterialProps.type.js";
import type { RawObject2DProps } from "./RawObject2DProps.type.js";

export interface RawRectProps extends RawObject2DProps, RawMaterialProps {
  readonly width: number;
  readonly height: number;
}
