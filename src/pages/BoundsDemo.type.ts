import type { Object2DOriginKeyword } from "raw2d";

export type BoundsDemoVariant = "rectangle" | "local" | "world";

export interface BoundsDemoOptions {
  readonly variant?: BoundsDemoVariant;
}

export interface BoundsDemoState {
  origin: Object2DOriginKeyword;
  rotation: number;
  variant: BoundsDemoVariant;
}
