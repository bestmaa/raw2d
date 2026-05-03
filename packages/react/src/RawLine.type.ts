import type { RawMaterialProps } from "./RawMaterialProps.type.js";
import type { RawObject2DProps } from "./RawObject2DProps.type.js";

export interface RawLineProps extends RawObject2DProps, RawMaterialProps {
  readonly startX?: number;
  readonly startY?: number;
  readonly endX: number;
  readonly endY: number;
}
