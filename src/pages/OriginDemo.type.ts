import type { Object2DOriginKeyword } from "raw2d";

export type OriginDemoVariant = "keywords" | "rect" | "custom" | "defaults";

export interface OriginDemoOptions {
  readonly variant?: OriginDemoVariant;
}

export interface OriginDemoState {
  origin: Object2DOriginKeyword;
  rotation: number;
  variant: OriginDemoVariant;
}
