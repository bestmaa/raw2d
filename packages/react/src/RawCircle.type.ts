import type { RawMaterialProps } from "./RawMaterialProps.type.js";
import type { RawObject2DProps } from "./RawObject2DProps.type.js";

export interface RawCircleProps extends RawObject2DProps, RawMaterialProps {
  readonly radius: number;
}
