import type { Object2DOriginValue, Object2DRenderMode } from "raw2d";

export interface RawObject2DProps {
  readonly name?: string;
  readonly x?: number;
  readonly y?: number;
  readonly origin?: Object2DOriginValue;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly zIndex?: number;
  readonly visible?: boolean;
  readonly renderMode?: Object2DRenderMode;
}
