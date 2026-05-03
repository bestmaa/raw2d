import type { RawMaterialProps } from "./RawMaterialProps.type.js";
import type { RawObject2DProps } from "./RawObject2DProps.type.js";

export interface RawText2DProps extends RawObject2DProps, RawMaterialProps {
  readonly text: string;
  readonly font?: string;
  readonly align?: CanvasTextAlign;
  readonly baseline?: CanvasTextBaseline;
}
